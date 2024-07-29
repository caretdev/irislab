import molecule from "@dtinsight/molecule";
import {
  Float,
  IFolderTreeNodeProps,
  FileTypes,
} from "@dtinsight/molecule/esm/model";
import { transformToEditorTab } from "../../common";

import API from "../../api";
import { STATUS_BAR_LANGUAGE, processesListTab } from "./base";

export async function initFolderTree() {
  const folderTreeData = {
    id: 0,
    name: "%SYS",
    fileType: FileTypes.RootFolder,
    location: "IRIS",
    isLeaf: false,
    data: "",
    children: [
      {
        id: "classes",
        name: "Classes",
        fileType: FileTypes.RootFolder,
        location: "IRIS/Classes",
        isLeaf: false,
        data: "",
      },
      {
        id: "routines",
        name: "Routines",
        fileType: FileTypes.RootFolder,
        location: "IRIS/routines",
        isLeaf: false,
        data: "",
      },
      {
        id: "globals",
        name: "Globals",
        fileType: FileTypes.RootFolder,
        location: "IRIS/globals",
        isLeaf: false,
        data: "",
      },
      {
        id: "tables",
        name: "Tables",
        fileType: FileTypes.RootFolder,
        location: "IRIS/Tables",
        isLeaf: false,
        data: "",
      },
      {
        id: "processes",
        name: "Processes",
        fileType: FileTypes.File,
        location: "IRIS/Processes",
        isLeaf: true,
        data: "",
      },
    ],
  };
  molecule.folderTree.add(folderTreeData);
}

export function handleSelectFolderTree() {
  molecule.folderTree.onSelectFile((file: IFolderTreeNodeProps) => {
    const [root, main, ...patharr] = file.location?.split("/") || [
      "",
      "",
      "",
    ];
    if (root !== "IRIS") {
      return;
    }
    if (main === "Classes") {
      const docName = patharr.join("/");
      API.getDoc(docName).then((lines) => {
        file.data.value = lines.join("\n");
        molecule.editor.open(transformToEditorTab(file));
        updateStatusBarLanguage(file.data.language);
      });
    }
    else if (main === "Processes") {
      molecule.editor.open(processesListTab)
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
