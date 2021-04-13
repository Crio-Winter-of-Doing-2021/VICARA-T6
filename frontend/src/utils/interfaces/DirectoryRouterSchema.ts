interface DirectoryRouteDataSchema {
  id: string;
  fileName: string;
}

interface DirectoryRouteRequestSchema {
  reversedAncestors: DirectoryRouteDataSchema[];
}

export default DirectoryRouteRequestSchema;
