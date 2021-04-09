import { useCallback, useEffect, useState } from 'react';
import { BsArrowDown } from 'react-icons/bs';
import { VscFolderOpened } from 'react-icons/vsc';

import FilesSchmea from '../../../utils/interfaces/FilesSchema';
import { useFileContext } from '../../../contexts/File';
import FolderRow from '../FolderRow';

interface FolderTableProps {
  files: FilesSchmea[];
}

export default function FolderTable({ files }: FolderTableProps) {
  useEffect(() => {
    console.log('FOLDER TABLE: I GOT RENDERED');
  }, []);

  const { copiedFiles, selectTheCurrentFile, displayType } = useFileContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [sortAscending, setOrderOfFields] = useState(true);

  const setTheClickedFileAsSelected = useCallback((id) => {
    setSelectedFile(id);
  }, []);

  if (files?.length === 0) {
    return (
      <div className="px-10 py-40 overflow-x-auto flex justify-center items-center flex-col">
        <div className="bg-gray-100 rounded-lg px-10 py-20 flex justify-center items-center flex-col">
          <VscFolderOpened size={60} className="mb-5" />
          No files present in this folder
        </div>
      </div>
    );
  }

  if (displayType === 'list') {
    return (
      <div className="-my-2 py-2 overflow-x-auto sm:px-2">
        <div className="align-middle inline-block w-full overflow-hidden bg-white shadow-dashboard px-2 pt-3 rounded-bl-lg rounded-br-lg">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm leading-4 text-blue-500 tracking-wider 2xl:w-6/12">
                  <span className="flex justify-between">
                    Name
                    <span
                      className={`hover:bg-gray-200 rounded-3xl cursor-pointer py-2 px-2 right-1 transform duration-200 ${
                        sortAscending ? 'rotate-0' : 'rotate-180'
                      }`}
                      onClick={() => setOrderOfFields(!sortAscending)}
                    >
                      <BsArrowDown />
                    </span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {files
                .sort((a: any, b: any) => {
                  // Sort files
                  if (sortAscending) {
                    return a.fileName > b.fileName ? 1 : -1;
                  } else {
                    return a.fileName < b.fileName ? 1 : -1;
                  }
                })
                .sort((a: any, b: any) => b.isDirectory - a.isDirectory) // Sort directories
                .map((file: FilesSchmea) => {
                  const fileExists: boolean =
                    copiedFiles[file.id]?.selected ?? false;

                  return (
                    <FolderRow
                      key={file.id + file.fileName}
                      file={file}
                      fileSelected={selectedFile === file.id}
                      selectFile={setTheClickedFileAsSelected}
                      addNewFileToCopy={selectTheCurrentFile}
                      fileInClipboard={fileExists}
                      disableSelection={fileExists && file.isDirectory}
                    />
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="-my-2 py-2 overflow-x-auto lg:-mx-8 lg:px-8 sm:hidden">
      <div className="align-middle inline-block w-full overflow-hidden bg-white shadow-dashboard px-8 pt-3 rounded-bl-lg rounded-br-lg">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm leading-4 text-blue-500 tracking-wider"></th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm leading-4 text-blue-500 tracking-wider 2xl:w-6/12">
                <span className="flex justify-between">
                  Name
                  <span
                    className={`hover:bg-gray-200 rounded-3xl cursor-pointer py-2 px-2 right-1 transform duration-200 ${
                      sortAscending ? 'rotate-0' : 'rotate-180'
                    }`}
                    onClick={() => setOrderOfFields(!sortAscending)}
                  >
                    <BsArrowDown />
                  </span>
                </span>
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm leading-4 text-blue-500 tracking-wider">
                Size
              </th>
              {/* <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm leading-4 text-blue-500 tracking-wider">
                Status
              </th> */}
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm leading-4 text-blue-500 tracking-wider">
                Modified At
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm leading-4 text-blue-500 tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {files
              .sort((a: any, b: any) => {
                // Sort files
                if (sortAscending) {
                  return a.fileName > b.fileName ? 1 : -1;
                } else {
                  return a.fileName < b.fileName ? 1 : -1;
                }
              })
              .sort((a: any, b: any) => b.isDirectory - a.isDirectory) // Sort directories
              .map((file: FilesSchmea) => {
                const fileExists: boolean =
                  copiedFiles[file.id]?.selected ?? false;

                return (
                  <FolderRow
                    key={file.id + file.fileName}
                    file={file}
                    fileSelected={selectedFile === file.id}
                    selectFile={setTheClickedFileAsSelected}
                    addNewFileToCopy={selectTheCurrentFile}
                    fileInClipboard={fileExists}
                    disableSelection={fileExists && file.isDirectory}
                  />
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
