import { useCallback, useEffect, useState } from 'react';

import FilesSchmea from '../../../utils/interfaces/FilesSchema';
import { useFileContext } from '../../../contexts/FileCopy';

import FolderRow from '../FolderRow';

interface FolderTableProps {
  files: FilesSchmea[];
  setDirectory(folderID: string): void;
}

export default function FolderTable({ files, setDirectory }: FolderTableProps) {
  if (files?.length === 0) {
    return (
      <div className="px-10 -my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-12">
        No files and folders
      </div>
    );
  }

  useEffect(() => {
    console.log('FOLDER TABLE: I GOT RENDERED');
  }, []);

  const { copiedFiles, addNewFileToCopy } = useFileContext();
  const [selectedFile, selectFile] = useState(null);

  const selectTheCurrentFile = useCallback((id) => {
    selectFile(id);
  }, []);

  return (
    <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-8 pt-3 rounded-bl-lg rounded-br-lg">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm leading-4 text-blue-500 tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm leading-4 text-blue-500 tracking-wider">
                Type
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
            {files.map((file: FilesSchmea) => {
              const fileExists: boolean =
                copiedFiles[file._id]?.selected ?? false;
              return (
                <FolderRow
                  key={file._id + file.name}
                  file={file}
                  fileSelected={selectedFile === file._id}
                  setDirectory={setDirectory}
                  selectFile={selectTheCurrentFile}
                  addNewFileToCopy={addNewFileToCopy}
                  fileInClipboard={fileExists}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
