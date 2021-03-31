interface FilesSchema {
  _id: string;
  directory: boolean;
  name: string;
  owner: string;
  parent: string;
  size?: number;
  type?: string;
  extension?: string;
  starred?: boolean;
  updatedAt: string;
  createdAt: string;
}

export default FilesSchema;
