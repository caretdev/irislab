import molecule from "@dtinsight/molecule";
import { IExtension } from "@dtinsight/molecule/esm/model/extension";
import { IExtensionService } from "@dtinsight/molecule/esm/services";
import * as folderTreeController from "./folderTreeController";
import * as searchPaneController from "./searchPaneController";
import { IFolderTreeNodeProps } from "@dtinsight/molecule/esm/model/workbench/explorer/folderTree";
import API from "../../api";
import { FileTypes } from "@dtinsight/molecule/esm/model";

export class FirstExtension implements IExtension {
  id: string = "";
  name: string = "";

  constructor(
    id: string = "TheFirstExtension",
    name: string = "The First Extension"
  ) {
    this.id = id;
    this.name = name;
  }

  async onLoadData(
    treeNode: IFolderTreeNodeProps,
    callback: (treeNode: IFolderTreeNodeProps) => void
  ) {
    const [root, main, ...patharr] = treeNode.location?.split("/") || [
      "",
      "",
      "",
    ];
    if (root !== "IRIS") {
      callback(treeNode);
      return;
    }

    const path = patharr.join("/");
    if (main === "Classes") {
      treeNode.children = await API.getFolderTree(path).then((data) => {
        return data
          .map((item: string[]) => ({ name: item[0], type: parseInt(item[1]) }))
          .map((item: { name: string; type: any }) => ({
            id: (path ? path.replaceAll("/", ".") + "." : "") + item.name,
            name: item.name,
            fileType: item.type === 9 ? FileTypes.RootFolder : FileTypes.File,
            location: "IRIS/Classes/" + (path ? path + "/" : "") + item.name,
            isLeaf: item.type !== 9,
            children: [],
            data: { language: "xml" },
          }));
      });
    } else if (main === "Tables") {
      if (!path) {
        treeNode.children = await API.getSchemas().then((data) => {
          return data
            .map((item: string[]) => ({
              name: item[0]
            }))
            .map((item: { name: string; }) => ({
              id: item.name,
              name: item.name,
              fileType: FileTypes.RootFolder,
              location: "IRIS/Tables/" + item.name,
              isLeaf: false,
              children: [],
              data: "",
            }));
        });
      } else {
        treeNode.children = await API.getTables(path).then((data) => {
          return data
            .map((item: string[]) => ({
              name: item[0],
            }))
            .map((item: { name: string; }) => ({
              id: item.name,
              name: item.name,
              fileType: FileTypes.File,
              location: "IRIS/Tables/" + (path ? path + "/" : "") + item.name,
              isLeaf: true,
              children: [],
              data: { language: "plaintext" },
            }));
        });
      }
    }
    callback(treeNode);
  }

  activate(extensionCtx: IExtensionService): void {
    folderTreeController.initFolderTree();
    folderTreeController.handleSelectFolderTree();
    folderTreeController.handleStatusBarLanguage();
    searchPaneController.handleSearchEvent();
    searchPaneController.handleSelectSearchResult();
    molecule.folderTree.onLoadData(this.onLoadData);
  }

  dispose(extensionCtx: IExtensionService): void {
    throw new Error("Method not implemented.");
  }
}
