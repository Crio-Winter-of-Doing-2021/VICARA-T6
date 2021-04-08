import { useEffect } from 'react';
import { useQuery } from 'react-query';

import { AiOutlineUnorderedList } from 'react-icons/ai';
import { BiDetail } from 'react-icons/bi';
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
    const { data } = await Axios.get(`/browse/ancestors?id=${currentFolderID}`);
    return data;
  });
}

const FolderHeader = (props: any) => {
  return (
    <>
      <button
        className="hover:bg-gray-200 px-2 py-1 rounded"
        onClick={() => props.changeParentFolder()}
      >
        <span>{props.fileName}</span>
      </button>
      {props.displayArrow && <span className="ml-2 mr-2 py-1"> &gt; </span>}
    </>
  );
};

export default function DirectoryRouter({
  currentFolderID
}: DirectoryRouteProps) {
  const { data, refetch }: DirectoryRouteResultProps = useParentDirectories(
    currentFolderID
  );

  const maxFolderLimit = 2;

  const {
    changeParentFolder,
    displayType,
    switchDisplayType
  } = useFileContext();

  useEffect(() => {
    console.log('Directory Route: I got rendered too');
  }, []);

  useEffect(() => {
    refetch();
  }, [currentFolderID]);

  return (
    <div className="px-10 py-4 flex justify-between items-center border-b border-gray-200 ml-10">
      <div className="flex">
        {data?.reversedAncestors?.map(({ id, fileName }, index) => {
          return (
            <>
              <div key={id}>
                {/* INDEX >= 0 && INDEX <= MAXFOLDERLIMIT */}
                {index < maxFolderLimit && (
                  <FolderHeader
                    id={id}
                    changeParentFolder={() => changeParentFolder(id)}
                    fileName={fileName}
                    displayArrow={data.reversedAncestors.length - 1 !== index}
                  />
                )}

                {/* INDEX > MAXFOLDERLIMIT && INDEX < TOTALFOLDERS - MAXFOLDERLIMIT */}
                {index >= maxFolderLimit &&
                  index < data?.reversedAncestors.length - maxFolderLimit && (
                    <span>.</span>
                  )}

                {index > maxFolderLimit &&
                  index === data?.reversedAncestors.length - maxFolderLimit && (
                    <span className="ml-2 mr-2 py-1"> &gt; </span>
                  )}

                {/* INDEX > TOTALFOLDERS - MAXFOLDERLIMIT */}
                {index >= maxFolderLimit &&
                  index >= data?.reversedAncestors.length - maxFolderLimit && (
                    <FolderHeader
                      id={id}
                      changeParentFolder={() => changeParentFolder(id)}
                      fileName={fileName}
                      displayArrow={data.reversedAncestors.length - 1 !== index}
                    />
                  )}
              </div>
            </>
          );
        })}
      </div>
      <div>
        <button onClick={() => switchDisplayType()} className="">
          <span className="hover:bg-gray-200 rounded-3xl cursor-pointer flex justify-center py-2 px-2">
            {displayType === 'detailed' && <BiDetail size={20} />}
            {displayType === 'list' && <AiOutlineUnorderedList size={20} />}
          </span>
        </button>
      </div>
    </div>
  );
}
