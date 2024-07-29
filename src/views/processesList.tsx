import React from "react";
import styled from "styled-components";
import DataTable, { TableColumn } from "react-data-table-component";

import API from "../api";

interface ProcessesListRow {
  Process: string;
  JobType: string;
  Device: string;
  Namespace: string;
  Routine: string;
  CPU: string;
  Glob: string;
  Pr: string;
  User: string;
  Location: string;
}

// Process, JobType, Device, Namespace, Routine, CPU, Glob, Pr, User, Location
const columns: TableColumn<ProcessesListRow>[] = [
  {
    name: "Process",
    selector: (row) => row.Process,
  },
  {
    name: "JobType",
    selector: (row) => row.JobType,
  },
  {
    name: "Device",
    selector: (row) => row.Device,
  },
  {
    name: "Namespace",
    selector: (row) => row.Namespace,
  },
  {
    name: "Routine",
    selector: (row) => row.Routine,
  },
  {
    name: "CPU",
    selector: (row) => row.CPU,
  },
  {
    name: "Glob",
    selector: (row) => row.Glob,
  },
  {
    name: "Pr",
    selector: (row) => row.Pr,
  },
  {
    name: "User",
    selector: (row) => row.User,
  },
  {
    name: "Location",
    selector: (row) => row.Location,
  },
];

const ProcessesList = styled.div`
  width: 100%;
  margin: auto;
`;

export class ProcessesListView extends React.Component {
  state = {
    data: [],
  };

  //   constructor(props: ProcessesListProps) {
  //     super(props);
  //   }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    API.getSS()
      .then((data: any) =>
        data.map((row: string[]) => {
          const [
            Process,
            JobType,
            Device,
            Namespace,
            Routine,
            CPU,
            Glob,
            Pr,
            User,
            Location,
          ] = row;
          return {
            Process,
            JobType,
            Device,
            Namespace,
            Routine,
            CPU,
            Glob,
            Pr,
            User,
            Location,
          };
        })
      )
      .then((data: ProcessesListRow[]) => {
        this.setState({ data });
      });
  };

  close = async (e: React.FormEvent) => {};

  render() {
    return (
      <ProcessesList className="processesList__table">
        <DataTable columns={columns} data={this.state.data} />
      </ProcessesList>
    );
  }
}

export default ProcessesListView;
