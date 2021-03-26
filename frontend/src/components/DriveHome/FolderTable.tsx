import FilesSchmea from '../../utils/interfaces/FilesSchmea';

interface FolderRowProps {
  file: FilesSchmea;
  setDirectory(folderID: string): void;
}
interface FolderTableProps {
  files: FilesSchmea[];
  setDirectory(folderID: string): void;
}

function FolderRow({ file, setDirectory }: FolderRowProps) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
        <div className="flex items-center">
          <div>
            <div className="text-sm leading-5 text-gray-800">{file._id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
        <div className="text-sm leading-5 text-blue-900">{file.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
        {file.directory ? 'Directory' : 'File'}
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
        {file?.size ?? '-'}
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
        {file.updatedAt}
      </td>
      <td className="px-6 py-4 whitespace-no-wrap text-left border-b border-gray-500 text-sm leading-5">
        {file.directory && (
          <button
            className="px-5 py-2 border-yellow-500 border text-yellow-500 rounded transition duration-300 hover:bg-yellow-500 hover:text-white focus:outline-none"
            onClick={() => setDirectory(file._id)}
          >
            View Folder
          </button>
        )}
        {!file.directory && (
          <button className="px-5 py-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none">
            Download
          </button>
        )}
      </td>
    </tr>
  );
}

export default function FolderTable({ files, setDirectory }: FolderTableProps) {
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
