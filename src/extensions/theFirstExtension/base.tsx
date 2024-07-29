import { IEditorTab, IStatusBarItem } from '@dtinsight/molecule/esm/model';
import ProcessesListView from "../../views/processesList";

const PROCESSES_LIST_ID = "ProcessesList";

export const STATUS_BAR_LANGUAGE: IStatusBarItem = {
    id: 'LanguageStatus',
    sortIndex: 3,
}

export const processesListTab: IEditorTab = {
    id: PROCESSES_LIST_ID,
    name: 'Processes',
    renderPane: () => {
        return <ProcessesListView />;
    }
  }
  
  