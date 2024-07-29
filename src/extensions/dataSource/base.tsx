import { IActivityBarItem, ISidebarPane, IMenuBarItem } from '@dtinsight/molecule/esm/model';
import DataSourceView from '../../views/dataSource/dataSourceSidebar';
import { localize } from '@dtinsight/molecule/esm/i18n/localize';

export const DATA_SOURCE_ID = 'DataSource';

export const dataSourceActivityBar: IActivityBarItem = {
    id: DATA_SOURCE_ID,
    sortIndex: -1, // sorting the dataSource to the first position
    name: 'Data Source',
    title: 'Data Source Management',
    icon: 'database'
}

export const dataSourceSidebar: ISidebarPane = {
    id: DATA_SOURCE_ID,
    title: 'DataSourcePane',
    render: () => {
        return <DataSourceView />;
    }
}

export const createDataSourceMenuItem: IMenuBarItem = {
    id: 'menu.createDataSource',
    name: localize('menu.createDataSource', 'Create Data Source'),
    icon: ''
}
