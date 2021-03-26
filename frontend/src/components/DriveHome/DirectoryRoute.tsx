import { useEffect } from 'react';
import { useQuery } from 'react-query';
import Axios from '../../config/axios';

import DirectoryRouteRequestSchema from '../../utils/interfaces/DirectoryRouterSchema';
interface DirectoryRouteResultProps {
  data?: DirectoryRouteRequestSchema;
  refetch: any;
}

interface DirectoryRouteProps {
  currentFolderID: string;
  setDirectory(folderID: string): void;
}

function useParentDirectories(currentFolderID: string) {
  return useQuery('directoryLists', async () => {
    const { data } = await Axios.get(
      `/list_parent_directories?parent=${currentFolderID}`
    );
    return data;
  });
}

export default function DirectoryRouter({
  currentFolderID,
  setDirectory
}: DirectoryRouteProps) {
  const { data, refetch }: DirectoryRouteResultProps = useParentDirectories(
    currentFolderID
  );

  useEffect(() => {
    refetch();
  }, [currentFolderID]);

  return (
    <div className="px-10 py-4 flex">
      {data?.directoryRoutes?.map(({ id, name }, index) => {
        return (
          <>
            <button
              key={id}
              className="hover:bg-gray-200 px-2 py-1 rounded"
              onClick={() => setDirectory(id)}
            >
              <span>{name}</span>
            </button>
            {index !== data?.directoryRoutes.length - 1 && (
              <span className="ml-2 mr-2 py-1"> &gt; </span>
            )}
          </>
        );
      })}
    </div>
  );
}
