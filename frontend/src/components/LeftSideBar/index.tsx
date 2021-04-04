import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { useFileContext } from '../../contexts/File';
import Axios from '../../config/axios';

import SelectedFiles from './Children/SelectedFiles';
import RecentFiles from './Children/RecentFiles';
import StarredFiles from './Children/StarredFiles';
import AvailableStorage from './Children/AvailableStorage';

function useRecentFiles() {
  return useQuery('recentfiles', async () => {
    const { data } = await Axios.get('/recent_files');
    return data;
  });
}

function useStarredFiles() {
  return useQuery('starredFiles', async () => {
    const { data } = await Axios.get('/starred_files');
    return data;
  });
}

function DropDownArrow(props: any) {
  const { isOpen }: any = props;
  return (
    <svg
      className={`w-4 h-4 transition-transform transform ${
        isOpen && 'rotate-180'
      }`}
      // :className="{ 'rotate-180': open }"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function DropDownCoponent(props: any) {
  const [isOpen, changeOpen] = useState(false);

  return (
    <div className="min-w-300">
      <a
        href="#"
        className={`flex items-center p-2 text-gray-500 transition-colors rounded-md dark:text-light hover:bg-yellow-100 dark:hover:bg-yellow-600 ${
          isOpen && 'bg-yellow-100 dark:bg-yellow-600'
        }`}
        onClick={(e) => {
          e.preventDefault();
          changeOpen(!isOpen);
        }}
        role="button"
        aria-haspopup="true"
        // :aria-expanded="(open || isActive) ? 'true' : 'false'"
      >
        <span className="" aria-hidden="true">
          <DropDownArrow isOpen={isOpen} />
        </span>
        <span className="ml-2 text-sm"> {props.heading} </span>
        <span className="ml-auto" aria-hidden="true">
          <CounterComponent color={props.color} counter={props.counter ?? 0} />
        </span>
      </a>
      <div
        role="menu"
        className={`${!isOpen && 'hidden'} pl-2`}
        aria-label={props.heading}
      >
        {props.children}
      </div>
    </div>
  );
}

const CounterComponent = (props: any) => {
  const { counter } = props;
  return (
    <span
      className={`border-${props.color}-100 border-2 bg-${props.color}-50 text-${props.color}-400 px-2 rounded-full text-sm font-semibold`}
    >
      {counter}
    </span>
  );
};

export default function LeftSideBar() {
  const [filesList, copyFiles] = useState([]);
  const { filesCounter } = useFileContext();

  const { data: recentFilesData, refetch: recentRefetch } = useRecentFiles();
  const { data: starredFilesData, refetch: starredRefetch } = useStarredFiles();

  useEffect(() => {
    recentRefetch();
    starredRefetch();
  }, [filesCounter]);

  return (
    <div>
      <aside className="flex-shrink-0 hidden w-64 bg-white border-r dark:border-blue-800 dark:bg-darker md:block" />
      <div className="flex flex-col h-full">
        <nav
          aria-label="Main"
          className="flex-1 px-2 py-4 space-y-2 overflow-y-hidden hover:overflow-y-auto"
        >
          <AvailableStorage />
          <DropDownCoponent
            heading="Starred Files"
            color="yellow"
            counter={starredFilesData?.starredFilesResult?.length}
          >
            <StarredFiles filesList={starredFilesData?.starredFilesResult} />
          </DropDownCoponent>

          <DropDownCoponent
            heading="Recent Files"
            color="blue"
            counter={recentFilesData?.recentFilesResult?.length}
          >
            <RecentFiles filesList={recentFilesData?.recentFilesResult} />
          </DropDownCoponent>

          <DropDownCoponent
            heading="Selected Files"
            color="green"
            counter={filesList.length}
          >
            <SelectedFiles copyFiles={copyFiles} filesList={filesList} />
          </DropDownCoponent>
        </nav>
      </div>
    </div>
  );
}
