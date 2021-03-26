import { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import { withRouter, useHistory } from 'react-router-dom';

import Axios from '../../config/axios';

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

  console.log(process.env.REACT_APP_BACKEND_URL);

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
      <FolderTable setDirectory={changeParentFolder} files={data} />
    </>
  );
}

export default withRouter(DriveMain);
