import React from "react";
import molecule from "@dtinsight/molecule";
import { Header, Content } from "@dtinsight/molecule/esm/workbench/sidebar";
import {
  IActionBarItemProps,
  ITreeNodeItemProps,
} from "@dtinsight/molecule/esm/components";
import { ICollapseItem } from "@dtinsight/molecule/esm/components/collapse";
import { localize } from "@dtinsight/molecule/esm/i18n/localize";

import API from "../../api";

const Tree = molecule.component.TreeView;
const Toolbar = molecule.component.Toolbar;
const Collapse = molecule.component.Collapse;
export class DataSourceSidebarView extends React.Component {
  state = {
    data: [],
    currentDataSource: undefined,
  };

  componentDidMount() {
    this.fetchData();
    molecule.event.EventBus.subscribe("addDataSource", () => {
      this.reload();
    });
  }

  async fetchData() {
    const schemas = await API.getSchemas();
    const data: ICollapseItem[] = schemas.map((el: string) => ({
      id: el,
      name: el,
      isLeaf: false,
      fileType: "RootFolder",
    }));
    this.setState({
      data,
    });
  }

  reload() {
    this.fetchData();
  }

  selectedSource = (node: ITreeNodeItemProps) => {};

  async expandItem(expandedKeys: React.Key[], node: ITreeNodeItemProps) {
    const tables = await API.getTables(expandedKeys[0].toString());
  };

  renderHeaderToolbar(): IActionBarItemProps[] {
    return [
      {
        icon: "refresh",
        id: "reload",
        title: "Reload",
        onClick: () => this.reload(),
      },
    ];
  }

  renderCollapse(): ICollapseItem[] {
    return [
      {
        id: "DataSourceList",
        name: "Catalogue",
        renderPanel: () => {
          return (
            <Tree
              data={this.state.data}
              onSelect={this.selectedSource}
              onExpand={this.expandItem}
            />
          );
        },
      },
    ];
  }

  render() {
    return (
      <div className="dataSource" style={{ width: "100%", height: "100%" }}>
        <Header
          title={localize("demo.dataSourceManagement", "DataSource Management")}
          toolbar={<Toolbar data={this.renderHeaderToolbar()} />}
        />
        <Content>
          <Collapse data={this.renderCollapse()} />
        </Content>
      </div>
    );
  }
}

export default DataSourceSidebarView;
