import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { withRouter, useHistory } from 'react-router-dom';
import Loader from 'react-loader-spinner';

import Axios from '../../config/axios';
import { useFileContext } from '../../contexts/File';

import ErrorPage from '../404Page';
import DragAndDrop from '../DragNDrop/index';
import DirectoryRouter from './DirectoryRoute';
import FolderTable from './FolderTable';
import LeftSideBar from '../LeftSideBar';
import FilePreview from '../FilePreview';

interface FileProps {
  currentFolderID: string;
}

function useFiles({ currentFolderID }: FileProps) {
  return useQuery(
    'files',
    async () => {
      const { data } = await Axios.get(`/browse/file/${currentFolderID}`);
      return data;
    },
    { retry: false }
  );
}

function DriveMain() {
  const history = useHistory();

  const { displayNavbar, filesCounter } = useFileContext();

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
        <div
          className={`
          ${displayNavbar ? 'block' : 'sm:translate-l-300 sm:hidden block'} 
          border-r-2 border-gray-300 bg-gray-100 bg-opacity-10`}
        >
          <LeftSideBar />
        </div>
        <div className="w-full">
          <DragAndDrop disabled={data?.isDirectory === false ?? false} />
          <DirectoryRouter currentFolderID={currentFolderID} />

          {data?.isDirectory && <FolderTable files={data.children} />}

          {data?.isDirectory === false && <FilePreview data={data} />}

          {data === undefined && <ErrorPage />}
        </div>
      </div>
    </>
  );
}

export default withRouter(DriveMain);
