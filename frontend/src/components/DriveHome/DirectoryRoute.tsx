import { useEffect } from 'react';
import { useQuery } from 'react-query';

import Axios from '../../config/axios';
import { useFileContext } from '../../contexts/File';
import DirectoryRouteRequestSchema from '../../utils/interfaces/DirectoryRouterSchema';
interface DirectoryRouteResultProps {
  data?: DirectoryRouteRequestSchema;
  refetch: any;
}

interface DirectoryRouteProps {
  currentFolderID: string;
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
  currentFolderID
}: DirectoryRouteProps) {
  const { data, refetch }: DirectoryRouteResultProps = useParentDirectories(
    currentFolderID
  );

  const { changeParentFolder } = useFileContext();

  useEffect(() => {
    console.log('Directory Route: I got rendered too');
  }, []);

  useEffect(() => {
    refetch();
  }, [currentFolderID]);

  return (
    <div className="px-10 py-4 flex justify-between items-center">
      <div className="flex">
        {data?.directoryRoutes?.map(({ id, name }, index) => {
          return (
            <div key={id}>
              <button
                className="hover:bg-gray-200 px-2 py-1 rounded"
                onClick={() => changeParentFolder(id)}
              >
                <span>{name}</span>
              </button>
              {index !== data?.directoryRoutes.length - 1 && (
                <span className="ml-2 mr-2 py-1"> &gt; </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
