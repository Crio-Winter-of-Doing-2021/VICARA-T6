interface DirectoryRouteDataSchema {
  id: string;
  name: string;
}

interface DirectoryRouteRequestSchema {
  directoryRoutes: DirectoryRouteDataSchema[];
}

export default DirectoryRouteRequestSchema;
