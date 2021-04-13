import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { VscSearchStop } from 'react-icons/vsc';
import { withRouter, useHistory } from 'react-router-dom';
import { useSearchContext } from '../../contexts/SearchFiles';
import Loader from 'react-loader-spinner';

import Axios from '../../config/axios';

import FolderTable from '../DriveHome/FolderTable';

interface SearchProps {
  searchText: string;
}

function useSearch({ searchText }: SearchProps) {
  return useQuery('search', async () => {
    if (searchText !== '') {
      const { data } = await Axios.get(`/browse/search?text=${searchText}`);
      return data;
    }
  });
}

function SearchMain() {
  const history = useHistory();

  const { searchText, setSearch } = useSearchContext();
  const { data, status, refetch } = useSearch({ searchText });

  useEffect(() => {
    const queryParams = new URLSearchParams(history.location.search);
    setSearch(queryParams.get('text'));
    refetch();
  }, [searchText]);

  if (status === 'loading') {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Loader type="Rings" color="#60a5fa" height={100} width={100} />
      </div>
    );
  }

  if (data?.searchFilesResult?.length === 0) {
    return (
      <div className="w-full flex justify-items-center items-center">
        <div className="px-10 py-40 overflow-x-auto w-full flex justify-center items-center flex-col">
          <div className="bg-gray-100 rounded-lg px-10 py-10 flex justify-center items-center flex-col text-center">
            <VscSearchStop size={60} className="mb-5" />
            <p className="mb-5">
              Search result not found, <br /> Try looking for a file you know
              exists 😁
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 w-full">
      {data?.searchFilesResult?.length > 0 && (
        <FolderTable files={data.searchFilesResult} />
      )}
    </div>
  );
}

export default withRouter(SearchMain);
