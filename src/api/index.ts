import http from "../common/http";

const basePath = "./mock";

const api = {
  getInfo() {
    return http.get(encodeURI(`api`));
  },

  getFolderTree(namespace: string, path: string) {
    return http.get(encodeURI(`api/${namespace}/classes/${path}`));
  },

  getDoc(namespace: string, docname: string) {
    return http.get(encodeURI(`api/${namespace}/doc/${docname}`));
  },

  search(value: string) {
    return http.get(encodeURI(`${basePath}/folderTree.json`), { query: value });
  },

  getDataSource(namespace: string) {
    return http.get(encodeURI(`api/${namespace}/dataSource`));
  },

  getSchemas(namespace: string) {
    return http.get(encodeURI(`api/${namespace}/schemas`));
  },

  getTables(namespace: string, schema: string) {
    return http.get(encodeURI(`api/${namespace}/tables/${schema}`));
  },

  getSS() {
    return http.get(encodeURI(`api/%SYS/ss`));
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
