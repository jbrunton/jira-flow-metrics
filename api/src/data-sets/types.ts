export type DataSet = {
  id: string;
  name: string;
  jql: string;
};

export type DataSource = {
  name: string;
  type: 'filter' | 'project';
  jql: string;
};
