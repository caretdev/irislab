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

  activate(extensionCtx: IExtensionService): void {
    folderTreeController.initFolderTree();
    folderTreeController.handleSelectFolderTree();
    folderTreeController.handleStatusBarLanguage();
    searchPaneController.handleSearchEvent();
    searchPaneController.handleSelectSearchResult();
    folderTreeController.handleOnLoadData();
  }

  dispose(extensionCtx: IExtensionService): void {
    throw new Error("Method not implemented.");
  }
}
