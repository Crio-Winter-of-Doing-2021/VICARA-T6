import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { withRouter, useHistory } from 'react-router-dom';

import Axios from '../../config/axios';
import { useFileContext } from '../../contexts/File';

import DragAndDrop from '../DragNDrop/index';
import DirectoryRouter from './DirectoryRoute';
import FolderTable from './FolderTable';
import LeftSideBar from '../LeftSideBar';
import FilePreview from '../FilePreview';
import Loader from 'react-loader-spinner';
// import RightSideBar from '../RightSideBar';

interface FileProps {
  currentFolderID: string;
}

function useFiles({ currentFolderID }: FileProps) {
  return useQuery('files', async () => {
    const { data } = await Axios.get(
      `/api/browse/directory/${currentFolderID}`
    );
    return data;
  });
}

function DriveMain() {
  const history = useHistory();

  const { filesCounter } = useFileContext();

  // Get the folder ID from the URL
  const currentFolderID = history.location.pathname.replace('/', '');

  const { data, status, refetch } = useFiles({
    currentFolderID
  });

  // Refetch when URL paramter changes
  useEffect(() => {
    refetch();
  }, [currentFolderID]);

  useEffect(() => {
    refetch();
  }, [filesCounter]);

  if (status === 'loading') {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Loader type="Rings" color="#60a5fa" height={100} width={100} />
      </div>
    );
  }

  return (
    <>
      <div className="flex">
        <LeftSideBar />
        <div>
          <DragAndDrop disabled={data?.isDirectory === false ?? false} />
          <DirectoryRouter currentFolderID={currentFolderID} />

          {(data?.children.length === 0 || data?.isDirectory) && (
            <FolderTable files={data.children} />
          )}

          {data?.isDirectory === false && <FilePreview data={data} />}
        </div>
        {/* <RightSideBar refetch={refetch} /> */}
      </div>
    </>
  );
}

export default withRouter(DriveMain);
