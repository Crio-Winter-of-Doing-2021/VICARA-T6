import { useRef, useEffect } from 'react';
import { GiCancel } from 'react-icons/gi';
import { HiEye } from 'react-icons/hi';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import FileDisplay from './filesDisplay';
import Axios from '../../../config/axios';
import { useFileContext } from '../../../contexts/File';
import {
  deleteFile,
  deleteFolder,
  downloadFolder
} from '../../../utils/helper/api';

export default function SelectedFiles(props: any) {
  const history = useHistory();

  const {
    copiedFiles,
    emptyClipboard,
    removeFileFromClipboard,
    parentFolderIDofSelectedFile
  } = useFileContext();

  const currentFolderID =
    history.location.pathname.replace('/', '') ?? '605256109934f80db98712ea';

  const toastId: any = useRef(null);

  useEffect(() => {
    const tempFiles: any = Object.values(copiedFiles).filter(
      (e: any) => e.selected
    );
    props.copyFiles(tempFiles);
  }, [copiedFiles]);

  async function moveHere() {
    if (parentFolderIDofSelectedFile !== currentFolderID) {
      await Axios.post('/move_files', {
        parentID: currentFolderID,
        foldersList: copiedFiles
      });
    }

    emptyClipboard();
  }

  async function copyHere() {
    if (parentFolderIDofSelectedFile !== currentFolderID) {
      await Axios.post('/copy_files', {
        parentID: currentFolderID,
        foldersList: copiedFiles
      });
    }

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

  function clearSelections() {
    emptyClipboard();
  }

  return (
    <>
      {props.filesList.map(({ id, extension, name, isDirectory }, index) => {
        return (
          <FileDisplay
            key={id}
            data={{
              id,
              extension,
              name,
              isDirectory
            }}
            icon={<GiCancel size={16} />}
            callback={() => removeFileFromClipboard(id)}
          />
        );
      })}
      <br />
      {props.filesList?.length > 0 && (
        <div className="hidden">
          <button
            className="w-full text-sm mb-2 block mr-4 px-5 py-2 border-gray-500 border text-gray-500 rounded transition duration-150 hover:bg-gray-700 hover:text-white focus:outline-none"
            onClick={() => clearSelections()}
          >
            Clear Selection
          </button>
          <div className="my-3 mx-2 border-gray border" />
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
          <div className="my-3 mx-2 border-gray border" />
          <button
            className="w-full text-sm mb-2 block mr-4 px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-150 hover:bg-blue-700 hover:text-white focus:outline-none"
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
      {props.filesList?.length > 0 && (
        <div className="hidden flex justify-between">
          <button className="flex border-gray-500 text-gray-500 hover:bg-gray-700 hover:text-white border p-2 rounded-lg w-10 h-10 justify-center items-center">
            <GiCancel size={25}>Clear Selection</GiCancel>
          </button>
          <div className="flex text-green-400">
            <div className="border-green-400 border rounded-lg w-10 h-10 mx-1 flex justify-center items-center">
              <HiEye size={25} className="mx-2">
                Copy to current Folder
              </HiEye>
            </div>
            <div className="border-green-400 border rounded-lg w-10 h-10 mx-1 flex justify-center items-center">
              <GiCancel size={25} className="mx-2">
                Move to current Folder
              </GiCancel>
            </div>
          </div>
          <div className="flex text-red-400">
            <div className="border-red-400 border rounded-lg w-10 h-10 mx-1 flex justify-center items-center">
              <HiEye size={25} className="mx-2">
                Copy to current Folder
              </HiEye>
            </div>
            <div className="border-red-400 border rounded-lg w-10 h-10 mx-1 flex justify-center items-center">
              <GiCancel size={25} className="mx-2">
                Move to current Folder
              </GiCancel>
            </div>
          </div>
        </div>
      )}
      {props.filesList?.length > 0 && (
        <div>
          <button
            className="w-full text-sm mb-2 block mr-4 px-5 py-2 border-gray-500 border text-gray-500 rounded transition duration-150 hover:bg-gray-700 hover:text-white focus:outline-none"
            onClick={() => clearSelections()}
          >
            Clear Selection
          </button>
          <div className="my-3 mx-2 border-gray border" />
          <div className="grid grid-rows-2 grid-flow-col gap-4">
            <button
              className="w-full text-sm mb-2 block mr-4 px-5 py-2 border-green-500 border text-green-500 rounded transition duration-150 hover:bg-green-700 hover:text-white focus:outline-none"
              onClick={() => bulkDownload()}
            >
              Download
            </button>
            {parentFolderIDofSelectedFile !== currentFolderID && (
              <button
                className="w-full text-sm mb-2 block mr-4 px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-150 hover:bg-blue-700 hover:text-white focus:outline-none"
                onClick={() => copyHere()}
              >
                Copy Here
              </button>
            )}
            {parentFolderIDofSelectedFile === currentFolderID && (
              <button className="w-full text-sm mb-2 block mr-4 px-5 py-2 border-gray-300 border text-gray-300 rounded transition duration-150 focus:outline-none">
                Copy Here
              </button>
            )}
            <button
              className="w-full text-sm mb-2 block mr-4 px-5 py-2 border-red-500 border text-red-500 rounded transition duration-150 hover:bg-red-700 hover:text-white focus:outline-none"
              onClick={() => bulkDelete()}
            >
              Delete
            </button>
            {parentFolderIDofSelectedFile !== currentFolderID && (
              <button
                className="w-full text-sm mb-2 block mr-4 px-5 py-2 border-yellow-500 border text-yellow-500 rounded transition duration-150 hover:bg-yellow-700 hover:text-white focus:outline-none"
                onClick={() => moveHere()}
              >
                Move Here
              </button>
            )}
            {parentFolderIDofSelectedFile === currentFolderID && (
              <button className="w-full text-sm mb-2 block mr-4 px-5 py-2 border-gray-300 border text-gray-300 rounded transition duration-150 focus:outline-none">
                Move Here
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
