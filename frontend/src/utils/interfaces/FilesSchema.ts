interface FilesSchema {
  id: string;
  isDirectory: boolean;
  fileName: string;
  ownerId: string;
  parentId: string;
  fileSize?: number;
  mimetype: string;
  extension?: string;
  starred?: boolean;
  updatedAt: string;
}

export default FilesSchema;
