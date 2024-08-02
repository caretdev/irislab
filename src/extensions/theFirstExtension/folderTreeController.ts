import molecule from "@dtinsight/molecule";
import {
  Float,
  IFolderTreeNodeProps,
  FileTypes,
} from "@dtinsight/molecule/esm/model";
import { transformToEditorTab } from "../../common";

import API from "../../api";
import { STATUS_BAR_LANGUAGE, processesListTab } from "./base";

function makeId(path: string) {
  return Array.from(path).reduce(
    (hash, char) => 0 | (31 * hash + char.charCodeAt(0)),
    0
  );
}

function namespaceFolder(ns: string) {
  return {
    id: ns,
    name: ns,
    fileType: FileTypes.RootFolder,
    location: `IRIS/${ns}`,
    isLeaf: false,
    data: "",
    children: [
      {
        id: `${ns}_classes`,
        name: "Classes",
        fileType: FileTypes.RootFolder,
        location: `IRIS/${ns}/Classes`,
        isLeaf: false,
        data: "",
      },
      {
        id: `${ns}_routines`,
        name: "Routines",
        fileType: FileTypes.RootFolder,
        location: `IRIS/${ns}/routines`,
        isLeaf: false,
        data: "",
      },
      {
        id: `${ns}_globals`,
        name: "Globals",
        fileType: FileTypes.RootFolder,
        location: `IRIS/${ns}/globals`,
        isLeaf: false,
        data: "",
      },
      {
        id: `${ns}_tables`,
        name: "Tables",
        fileType: FileTypes.RootFolder,
        location: `IRIS/${ns}/Tables`,
        isLeaf: false,
        data: "",
      },
    ],
  };
}

export async function initFolderTree() {
  const serverInfo = await API.getInfo();
  const folderTreeData = {
    id: 0,
    name: "IRIS",
    fileType: FileTypes.RootFolder,
    location: "IRIS",
    isLeaf: false,
    data: "",
    children: [
      ...serverInfo.namespaces.map(namespaceFolder),
      {
        id: "processes",
        name: "Processes",
        fileType: FileTypes.File,
        location: "IRIS/%SYS/Processes",
        isLeaf: true,
        data: "",
      },
    ],
  };
  molecule.folderTree.add(folderTreeData);
}

export function handleSelectFolderTree() {
  molecule.folderTree.onSelectFile((file: IFolderTreeNodeProps) => {
    const [root, namespace, main, ...patharr] = file.location?.split("/") || [
      "",
      "",
      "",
      "",
    ];
    if (root !== "IRIS") {
      return;
    }
    if (main === "Classes") {
      const docName = patharr.join("/");
      API.getDoc(namespace, docName).then((lines) => {
        file.data.value = lines.join("\n");
        molecule.editor.open(transformToEditorTab(file));
        molecule.editor.updateEditorOptions({ readOnly: true });
        updateStatusBarLanguage(file.data.language);
      });
    } else if (main === "Processes") {
      molecule.editor.open(processesListTab);
    }
  });
}

export function updateStatusBarLanguage(language: string) {
  if (!language) return;
  language = language.toUpperCase();
  const languageStatusItem = molecule.statusBar.getStatusBarItem(
    STATUS_BAR_LANGUAGE.id,
    Float.right
  );
  if (languageStatusItem) {
    languageStatusItem.name = language;
    molecule.statusBar.update(languageStatusItem, Float.right);
  } else {
    molecule.statusBar.add(
      Object.assign({}, STATUS_BAR_LANGUAGE, { name: language }),
      Float.right
    );
  }
}

export function handleStatusBarLanguage() {
  const moleculeEditor = molecule.editor;
  moleculeEditor.onSelectTab((tabId, groupId) => {
    if (!groupId) return;
    const group = moleculeEditor.getGroupById(groupId);
    if (!group) return;
    const tab: any = moleculeEditor.getTabById(tabId, group.id!);
    if (tab) {
      updateStatusBarLanguage(tab.data!.language!);
    }
  });
}

export function handleOnLoadData() {
  molecule.folderTree.onLoadData(
    async (
      treeNode: IFolderTreeNodeProps,
      callback: (treeNode: IFolderTreeNodeProps) => void
    ) => {
      const [root, namespace, main, ...patharr] = treeNode.location?.split(
        "/"
      ) || ["", "", "", ""];
      if (root !== "IRIS") {
        callback(treeNode);
        return;
      }

      const path = patharr.join("/");
      if (main === "Classes") {
        treeNode.children = await API.getFolderTree(namespace, path).then(
          (data) => {
            return data
              .map((item: string[]) => ({
                name: item[0],
                type: parseInt(item[1]),
              }))
              .map((item: { name: string; type: any }) => ({
                id: makeId(treeNode.location + item.name),
                name: item.name,
                fileType:
                  item.type === 9 ? FileTypes.RootFolder : FileTypes.File,
                location: `${root}/${namespace}/${main}/${path}${
                  path ? "/" : ""
                }${item.name}`,
                isLeaf: item.type !== 9,
                children: [],
                data: { language: "objectscript-class" },
              }));
          }
        );
      } else if (main === "Tables") {
        if (!path) {
          treeNode.children = await API.getSchemas(namespace).then((data) => {
            return data
              .map((item: string[]) => ({
                name: item[0],
              }))
              .map((item: { name: string }) => ({
                id: makeId(treeNode.location + item.name),
                name: item.name,
                fileType: FileTypes.RootFolder,
                location: `${root}/${namespace}/${main}/${item.name}`,
                isLeaf: false,
                children: [],
                data: "",
              }));
          });
        } else {
          treeNode.children = await API.getTables(namespace, path).then(
            (data) => {
              return data
                .map((item: string[]) => ({
                  name: item[0],
                }))
                .map((item: { name: string }) => ({
                  id: makeId(treeNode.location + item.name),
                  name: item.name,
                  fileType: FileTypes.File,
                  location: `${root}/${namespace}/${main}/${path}${
                    path ? "/" : ""
                  }${item.name}`,
                  isLeaf: true,
                  children: [],
                  data: { language: "plaintext" },
                }));
            }
          );
        }
      }
      callback(treeNode);
    }
  );
}
