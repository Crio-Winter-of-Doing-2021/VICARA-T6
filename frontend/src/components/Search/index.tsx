import { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import { withRouter, useHistory } from 'react-router-dom';
import { useSearchContext } from '../../contexts/SearchFiles';

import Axios from '../../config/axios';

import FolderTable from '../DriveHome/FolderTable';

interface SearchProps {
  searchText: string;
}

function useSearch({ searchText }: SearchProps) {
  return useQuery('search', async () => {
    if (searchText !== '') {
      const { data } = await Axios.get(`/search_files?text=${searchText}`);
      return data;
    }
  });
}

function SearchMain() {
  const history = useHistory();

  const { searchText, setSearch } = useSearchContext();
  const { data, refetch } = useSearch({ searchText });

  useEffect(() => {
    const queryParams = new URLSearchParams(history.location.search);
    setSearch(queryParams.get('text'));
    refetch();
  }, [searchText]);

  // Changes the URL Parameter ID
  const changeParentFolder = useCallback((folderID: string) => {
    history.push('/' + folderID);
    refetch();
  }, []);

  if (status === 'loading') {
    return <span>Loading...</span>;
  }

  if (data?.searchFilesResult?.length === 0) {
    return <div className="mt-4 ml-2">No results to display</div>;
  }

  return (
    <div className="mt-2">
      {data?.searchFilesResult?.length > 0 && (
        <FolderTable
          setDirectory={changeParentFolder}
          files={data.searchFilesResult}
        />
      )}
    </div>
  );
}

export default withRouter(SearchMain);
