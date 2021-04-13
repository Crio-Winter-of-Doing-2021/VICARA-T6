import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import prettyBytes from 'pretty-bytes';

import { useFileContext } from '../../../contexts/File';
import Axios from '../../../config/axios';

function useAvailableStorage() {
  return useQuery('availableStorage', async () => {
    const { data } = await Axios.get('/browse/storage');
    return data;
  });
}

export default function AvailableStorage() {
  const [percentUsed, setPercent] = useState(0);
  const { data, refetch } = useAvailableStorage();
  const { filesCounter } = useFileContext();

  useEffect(() => {
    setPercent(
      Math.floor((data?.totalUsedSize / data?.TOTAL_ALLOTTED_SIZE) * 100)
    );
  }, [data]);

  useEffect(() => {
    refetch();
  }, [filesCounter]);

  return (
    <div>
      <div className="shadow bg-grey-light mt-2 border-gray-200 border rounded-lg mx-4 bg-white">
        {percentUsed < 50 && (
          <div
            className="bg-green-400 text-xs leading-none py-1 text-center text-white rounded-lg"
            style={{ width: `${percentUsed}%` }}
          ></div>
        )}
        {percentUsed > 50 && percentUsed < 75 && (
          <div
            className="bg-yellow-400 text-xs leading-none py-1 text-center text-white rounded-lg"
            style={{ width: `${percentUsed}%` }}
          ></div>
        )}
        {percentUsed >= 75 && (
          <div
            className="bg-red-400 text-xs leading-none py-1 text-center text-white rounded-lg"
            style={{ width: `${percentUsed}%` }}
          ></div>
        )}
      </div>
      <div className="mt-2 ml-4 text-sm text-gray-700">
        {prettyBytes(data?.totalUsedSize ?? 0)} of{' '}
        {prettyBytes(data?.TOTAL_ALLOTTED_SIZE ?? 0)} Used
      </div>
    </div>
  );
}
