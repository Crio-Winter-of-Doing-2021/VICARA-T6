import { useRef } from 'react';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

import Axios from '../../config/axios';
import FilesSchmea from '../../utils/interfaces/FilesSchema';

interface FolderRowProps {
  file: FilesSchmea;
  setDirectory(folderID: string): void;
}
interface FolderTableProps {
  files: FilesSchmea[];
  setDirectory(folderID: string): void;
}

function downloadFile(toastId: any, id: string, name: string) {
  const notify = () => (toastId.current = toast('Downloading ' + name));

  const update = () =>
    toast.update(toastId.current, {
      render: 'Download successfull',
      type: toast.TYPE.INFO,
      autoClose: 1000
    });

  notify();

  Axios.get(`/download_file?file=${id}`, { responseType: 'blob' })
    .then((response) => new Blob([response.data], { type: 'application/png' }))
    .then((blob) => saveAs(blob, name))
    .then(() => update());
}

function FolderRow({ file, setDirectory }: FolderRowProps) {
  const { _id: id, name, directory: isDirectory, size, updatedAt } = file;
  const toastId: any = useRef(null);

  return (
    <tr>
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
        <div className="flex items-center">
          <div>
            <div className="text-sm leading-5 text-gray-800">{id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
        <div className="text-sm leading-5 text-blue-900">{name}</div>
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
        {isDirectory ? 'Directory' : 'File'}
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
        {size ?? '-'}
      </td>
      {/* <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
          <span
            aria-hidden
            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
          ></span>
          <span className="relative text-xs">active</span>
        </span>
      </td> */}
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-blue-900 text-sm leading-5">
        {updatedAt}
      </td>
      <td className="px-6 py-4 whitespace-no-wrap text-left border-b border-gray-500 text-sm leading-5">
        <button
          className="mr-4 px-5 py-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none"
          onClick={() => downloadFile(toastId, id, name)}
        >
          Download
        </button>
        {isDirectory && (
          <button
            className="px-5 py-2 border-yellow-500 border text-yellow-500 rounded transition duration-300 hover:bg-yellow-500 hover:text-white focus:outline-none"
            onClick={() => setDirectory(id)}
          >
            View Folder
          </button>
        )}
      </td>
    </tr>
  );
}

export default function FolderTable({ files, setDirectory }: FolderTableProps) {
  if (files?.length === 0) {
    return (
      <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        No files and folders
      </div>
    );
  }

  return (
    <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-8 pt-3 rounded-bl-lg rounded-br-lg">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                Size
              </th>
              {/* <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                Status
              </th> */}
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                Modified At
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {files.map((file: FilesSchmea) => (
              <FolderRow
                key={file._id}
                file={file}
                setDirectory={setDirectory}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
