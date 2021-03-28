import { format } from 'date-fns';
import { useRef } from 'react';

import fileMapper from '../../../utils/helper/fileMapper';

import {
  deleteFile,
  deleteFolder,
  downloadFile,
  downloadFolder
} from '../../../utils/helper/api';
import FilesSchmea from '../../../utils/interfaces/FilesSchema';

interface FolderRowProps {
  file: FilesSchmea;
  fileSelected?: boolean;
  selectFile(id: string): void;
  fileInClipboard: boolean;
  setDirectory(folderID: string): void;
  addNewFileToCopy(id: string, name: string, isDirectory: boolean): void;
}

export default function FolderRow({
  file,
  fileSelected,
  selectFile,
  setDirectory,
  addNewFileToCopy,
  fileInClipboard
}: FolderRowProps) {
  const { _id: fileID, name, directory: isDirectory, size, updatedAt } = file;
  const toastID: any = useRef(null);

  return (
    <tr
      className={`${fileSelected && 'bg-yellow-50'}`}
      onClick={() => selectFile(fileID)}
      onDoubleClick={() => setDirectory(fileID)}
    >
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
        <div className="flex">
          <img
            className="mr-3"
            height={20}
            width={20}
            src={fileMapper(isDirectory)}
          />
          <div className="text-sm leading-5 text-blue-900">{name}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-sm leading-5">
        {isDirectory ? 'Directory' : 'File'}
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-sm leading-5">
        {size ?? '-'}
      </td>
      {/* <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-sm leading-5">
          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
            ></span>
            <span className="relative text-xs">active</span>
          </span>
        </td> */}
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-blue-900 text-sm leading-5">
        {format(new Date(updatedAt), 'LLL d, yyy  h:mm a')}
      </td>
      <td className="px-6 py-4 whitespace-no-wrap text-left border-b border-gray-200 text-sm leading-5">
        {isDirectory && (
          <>
            <button
              className="mr-4 px-5 py-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none"
              onClick={() => downloadFolder(toastID, fileID, name)}
            >
              Download
            </button>
            <button
              className={`mr-4 px-5 py-2 border-blue-500 border rounded transition duration-300 ${
                fileInClipboard
                  ? 'bg-blue-700 hover:bg-white hover:text-blue-500 text-white'
                  : 'hover:bg-blue-700 hover:text-white text-blue-500'
              } focus:outline-none`}
              onClick={() => addNewFileToCopy(fileID, name, isDirectory)}
            >
              {fileInClipboard ? 'Copied' : 'Copy'}
            </button>
            <button
              className="mr-4 px-5 py-2 border-red-500 border text-red-500 rounded transition duration-300 hover:bg-red-700 hover:text-white focus:outline-none"
              onClick={() => deleteFolder(toastID, fileID, name)}
            >
              Delete
            </button>
          </>
        )}

        {!isDirectory && (
          <>
            <button
              className="mr-4 px-5 py-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none"
              onClick={() => downloadFile(toastID, fileID, name)}
            >
              Download
            </button>
            <button
              className={`mr-4 px-5 py-2 border-blue-500 border rounded transition duration-300 ${
                fileInClipboard
                  ? 'bg-blue-700 hover:bg-white hover:text-blue-500 text-white'
                  : 'hover:bg-blue-700 hover:text-white text-blue-500'
              } focus:outline-none`}
              onClick={() => addNewFileToCopy(fileID, name, isDirectory)}
            >
              {fileInClipboard ? 'Copied' : 'Copy'}
            </button>
            <button
              className="mr-4 px-5 py-2 border-red-500 border text-red-500 rounded transition duration-300 hover:bg-red-700 hover:text-white focus:outline-none"
              onClick={() => deleteFile(toastID, fileID, name)}
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
