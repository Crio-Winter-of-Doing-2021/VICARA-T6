import { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import { GiCancel } from 'react-icons/gi';
import { HiEye } from 'react-icons/hi';

import { useFileContext } from '../../contexts/File';
import fileMapper from '../../utils/helper/fileMapper';
import Axios from '../../config/axios';
import { toast } from 'react-toastify';
import {
  deleteFile,
  deleteFolder,
  downloadFolder
} from '../../utils/helper/api';

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
    <div className="min-w-225">
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
  const {
    filesCounter,
    copiedFiles,
    removeFileFromClipboard,
    emptyClipboard
  } = useFileContext();
  const history = useHistory();
  const currentFolderID =
    history.location.pathname.replace('/', '') ?? '605256109934f80db98712ea';

  const toastId: any = useRef(null);

  useEffect(() => {
    const tempFiles: any = Object.values(copiedFiles).filter(
      (e: any) => e.selected
    );
    copyFiles(tempFiles);
  }, [copiedFiles]);

  async function moveHere() {
    await Axios.post('/move_files', {
      parentID: currentFolderID,
      foldersList: copiedFiles
    });

    emptyClipboard();
  }

  async function copyHere() {
    await Axios.post('/copy_files', {
      parentID: currentFolderID,
      foldersList: copiedFiles
    });

    emptyClipboard();
  }

  async function bulkDelete() {
    const fileList = Object.values(copiedFiles);

    for (let i = 0; i < fileList.length; i++) {
      const file: any = fileList[i];

      if (file.isDirectory) {
        await deleteFolder(toastId, file.id, file.name);
      } else {
        await deleteFile(toastId, file.id, file.name);
      }

      if (toastId.current == null) {
        toast.update(toastId.current, {
          render: 'Deletion successfull',
          type: toast.TYPE.INFO,
          autoClose: 1000
        });
      }
    }

    emptyClipboard();
  }

  async function bulkDownload() {
    const filesList = Object.keys(copiedFiles);

    await downloadFolder(toastId, filesList);

    emptyClipboard();
  }

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
          <DropDownCoponent
            heading="Starred Files"
            color="yellow"
            counter={starredFilesData?.starredFilesResult?.length}
          >
            {starredFilesData?.starredFilesResult?.map((file: any) => {
              const { id, extension, directory: isDirectory, name } = file;
              return (
                <div
                  key={id}
                  className="space-y-2 px-2 flex justify-between relative border-b border-t py-3 border-gray-200"
                  aria-label="Dashboards"
                >
                  <span
                    className="hover:bg-gray-200 rounded-3xl cursor-pointer py-2 px-2 absolute right-1"
                    onClick={() => removeFileFromClipboard(id)}
                  >
                    <HiEye size={16} />
                  </span>
                  <div className="flex">
                    <img
                      className="mr-3"
                      height={20}
                      width={20}
                      src={fileMapper(extension, isDirectory)}
                    />
                    <div className="text-sm leading-5 text-blue-900 max-w-125 overflow-ellipsis overflow-hidden whitespace-nowrap">
                      {name}
                    </div>
                  </div>
                </div>
              );
            })}
          </DropDownCoponent>

          <DropDownCoponent
            heading="Recent Files"
            color="blue"
            counter={recentFilesData?.recentFilesResult?.length}
          >
            {recentFilesData?.recentFilesResult?.map((file: any) => {
              const { id, extension, directory: isDirectory, name } = file;
              return (
                <div
                  key={id}
                  className="space-y-2 px-2 flex justify-between relative border-b border-t py-3 border-gray-200"
                  aria-label="Dashboards"
                >
                  <span
                    className="hover:bg-gray-200 rounded-3xl cursor-pointer py-2 px-2 absolute right-1"
                    onClick={() => removeFileFromClipboard(id)}
                  >
                    <HiEye size={16} />
                  </span>
                  <div className="flex">
                    <img
                      className="mr-3"
                      height={20}
                      width={20}
                      src={fileMapper(extension, isDirectory)}
                    />
                    <div className="text-sm leading-5 text-blue-900 max-w-125 overflow-ellipsis overflow-hidden whitespace-nowrap">
                      {name}
                    </div>
                  </div>
                </div>
              );
            })}
          </DropDownCoponent>

          <DropDownCoponent
            heading="Selected Files"
            color="green"
            counter={filesList.length}
          >
            <>
              {filesList.map(({ id, extension, name, isDirectory }, index) => {
                return (
                  <div
                    key={id}
                    className="space-y-2 px-2 flex justify-between relative border-b border-t py-3 border-gray-200"
                    aria-label="Dashboards"
                  >
                    <span
                      className="hover:bg-gray-200 rounded-3xl cursor-pointer py-2 px-2 absolute right-1"
                      onClick={() => removeFileFromClipboard(id)}
                    >
                      <GiCancel size={16} />
                    </span>
                    <div className="flex">
                      <img
                        className="mr-3"
                        height={20}
                        width={20}
                        src={fileMapper(extension, isDirectory)}
                      />
                      <div className="text-sm leading-5 text-blue-900 max-w-125 overflow-ellipsis overflow-hidden whitespace-nowrap">
                        {name}
                      </div>
                    </div>
                  </div>
                );
              })}
              <br />
              {filesList?.length > 0 && (
                <div>
                  <button
                    className="w-full text-sm mb-2 block mr-4 px-5 py-2 border-green-500 border text-green-500 rounded transition duration-150 hover:bg-green-700 hover:text-white focus:outline-none"
                    onClick={() => bulkDownload()}
                  >
                    Bulk Download
                  </button>
                  <button
                    className="w-full text-sm mb-2 block mr-4 px-5 py-2 border-red-500 border text-red-500 rounded transition duration-150 hover:bg-red-700 hover:text-white focus:outline-none"
                    onClick={() => bulkDelete()}
                  >
                    Bulk Delete
                  </button>
                  <button
                    className="w-full text-sm mb-2 block mr-4 px-5 py-2 border-gray-500 border text-gray-500 rounded transition duration-150 hover:bg-gray-700 hover:text-white focus:outline-none"
                    onClick={() => copyHere()}
                  >
                    Copy to current Folder
                  </button>
                  <button
                    className="w-full text-sm mb-2 block mr-4 px-5 py-2 border-yellow-500 border text-yellow-500 rounded transition duration-150 hover:bg-yellow-700 hover:text-white focus:outline-none"
                    onClick={() => moveHere()}
                  >
                    Move to current Folder
                  </button>
                </div>
              )}
            </>
          </DropDownCoponent>
        </nav>
      </div>
    </div>
  );
}

// #################################################
//  <div className="flex-shrink-0 px-2 py-4 space-y-2">
//             <button
//               //   @click="openSettingsPanel"
//               type="button"
//               className="flex items-center justify-center w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-700 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
//             >
//               <span aria-hidden="true">
//                 <svg
//                   className="w-4 h-4 mr-2"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
//                   />
//                 </svg>
//               </span>
//               <span>Customize</span>
//             </button>
//           </div>
