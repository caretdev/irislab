import http from "../common/http";

const basePath = "./mock";

const api = {
  getFolderTree(path: string) {
    // return http.get(`${basePath}/folderTree.json`);
    return http.get(encodeURI(`api/classes/${path}`));
  },

  getDoc(docname: string) {
    return http.get(encodeURI(`api/doc/${docname}`));
  },

  search(value: string) {
    return http.get(`${basePath}/folderTree.json`, { query: value });
  },

  getDataSource() {
    return http.get(`api/dataSource`);
  },

  getSchemas() {
    return http.get(`api/schemas`);
  },

  getTables(schema: string) {
    return http.get(encodeURI(`api/tables/${schema}`));
  },

  getSS() {
    return http.get(encodeURI(`api/ss`));
  },

  async query(query: string = "") {
    const res = await http.get(`${basePath}/folderTree.json`);
    const result: any[] = [];
    const search = (nodeItem: any) => {
      if (!nodeItem) return;
      const target = nodeItem.name || "";
      if (target.includes(query) || query.includes(target)) {
        result.push(nodeItem);
      }
      if (nodeItem.children) {
        nodeItem.children.forEach((item: any) => {
          search(item);
        });
      }
    };
    search(res.data);

    return result;
  },
};

export default api;
