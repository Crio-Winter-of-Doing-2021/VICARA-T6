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
  ownerID: string;
  currentFolderID: string;
}

function useFiles({ ownerID, currentFolderID }: FileProps) {
  return useQuery('files', async () => {
    const { data } = await Axios.get(
      `/list_directory?owner=${ownerID}&parent=${currentFolderID}`
    );
    return data;
  });
}

function DriveMain() {
  const history = useHistory();
  const ownerID = '605256109934f80db98712ea';

  const { filesCounter } = useFileContext();

  // Get the folder ID from the URL
  const currentFolderID = history.location.pathname.replace('/', '') ?? ownerID;

  const { data, status, refetch } = useFiles({
    ownerID,
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
          <DragAndDrop />
          <DirectoryRouter currentFolderID={currentFolderID} />

          {(data?.currentFolderData === null ||
            data?.currentFolderData?.directory) && (
            <FolderTable files={data.children} />
          )}

          {data?.currentFolderData?.directory === false && (
            <FilePreview data={data?.currentFolderData} />
          )}
        </div>
        {/* <RightSideBar refetch={refetch} /> */}
      </div>
    </>
  );
}

export default withRouter(DriveMain);
