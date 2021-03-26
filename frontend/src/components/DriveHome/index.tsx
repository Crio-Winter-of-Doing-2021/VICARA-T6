import { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import { withRouter, useHistory } from 'react-router-dom';

import Axios from '../../config/axios';

import DirectoryRouter from './DirectoryRoute';
import FolderTable from './FolderTable';

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

  // Get the folder ID from the URL
  const currentFolderID = history.location.pathname.replace('/', '') ?? ownerID;

  const { data, status, refetch } = useFiles({
    ownerID,
    currentFolderID
  });

  // Changes the URL Parameter ID
  const changeParentFolder = useCallback((folderID: string) => {
    history.push('/' + folderID);
  }, []);

  // Refetch when URL paramter changes
  useEffect(() => {
    refetch();
  }, [currentFolderID]);

  if (status === 'loading') {
    return <span>Loading...</span>;
  }

  return (
    <>
      <DirectoryRouter
        setDirectory={changeParentFolder}
        currentFolderID={currentFolderID}
      />
      <FolderTable setDirectory={changeParentFolder} files={data.children} />
    </>
  );
}

export default withRouter(DriveMain);
