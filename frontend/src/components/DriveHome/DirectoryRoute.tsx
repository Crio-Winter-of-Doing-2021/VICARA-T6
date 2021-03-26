interface DirectoryRoute {
  id: string;
  name: string;
}

interface DirectoryRouterProps {
  directoryRoute: Array<DirectoryRoute>;
}

export default function DirectoryRouter({
  directoryRoute
}: DirectoryRouterProps) {
  return (
    <div className="px-6 py-4">
      {directoryRoute.map(({ id, name }) => {
        return (
          <div key={id}>
            <span>{name}</span>
            <span className="ml-2 mr-2">/</span>
          </div>
        );
      })}
    </div>
  );
}
