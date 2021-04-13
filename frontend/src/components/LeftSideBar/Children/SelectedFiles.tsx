import { useRef, useState, useEffect } from 'react';
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
  const [clipboardDisabled, disableClipboardActions] = useState(false);

  const {
    filesCounter,
    setFilesCounter,
    copiedFiles,
    emptyClipboard,
    removeFileFromClipboard,
    parentFolderIDofSelectedFile
  } = useFileContext();

  const currentFolderID = history.location.pathname.replace('/', '');

  const toastId: any = useRef(null);

  useEffect(() => {
    async function fetchFileDetails() {
      if (currentFolderID !== 'search') {
        const { data } = await Axios.get(`/browse/file/${currentFolderID}`);

        if (data?.isDirectory === false) {
          disableClipboardActions(true);
        }
      }
    }

    fetchFileDetails();
  }, [currentFolderID]);

  useEffect(() => {
    if (parentFolderIDofSelectedFile === currentFolderID) {
      disableClipboardActions(true);
    } else {
      disableClipboardActions(false);
    }
  }, [parentFolderIDofSelectedFile, currentFolderID]);

  useEffect(() => {
    const tempFiles: any = Object.values(copiedFiles).filter(
      (e: any) => e.selected
    );
    props.copyFiles(tempFiles);
  }, [copiedFiles]);

  async function moveHere() {
    if (parentFolderIDofSelectedFile !== currentFolderID) {
      toastId.current = toast('Moving files');

      const copiedFilesArr = Object.keys(copiedFiles);

      try {
        await Axios.patch('/browse/move', {
          parentId: currentFolderID,
          foldersList: copiedFilesArr
        });

        toast.update(toastId.current, {
          render: 'Move successfull',
          type: toast.TYPE.INFO,
          autoClose: 1000
        });
      } catch (error) {
        if (error.response.status === 500) {
          toast.update(toastId.current, {
            render: 'Duplicate files not moved',
            type: toast.TYPE.ERROR,
            autoClose: 1000
          });
        } else {
          toast.update(toastId.current, {
            render: error?.response?.data?.err ?? 'Move Unsuccessful',
            type: toast.TYPE.ERROR,
            autoClose: 1000
          });
        }
      }
    }

    setFilesCounter(filesCounter + 1);
    emptyClipboard();
  }

  async function copyHere() {
    if (parentFolderIDofSelectedFile !== currentFolderID) {
      toastId.current = toast('Copying files');
      try {
        await Axios.post('/downloads/copyfiles', {
          parentId: currentFolderID,
          foldersList: copiedFiles
        });
        toast.update(toastId.current, {
          render: 'Copy successfull',
          type: toast.TYPE.INFO,
          autoClose: 1000
        });
      } catch (error) {
        if (error.response.status === 500) {
          toast.update(toastId.current, {
            render: 'Duplicate files not copied',
            type: toast.TYPE.ERROR,
            autoClose: 1000
          });
        } else {
          toast.update(toastId.current, {
            render: error?.response?.data?.err ?? 'Copy Unsuccessful',
            type: toast.TYPE.ERROR,
            autoClose: 1000
          });
        }
      }
    }

    setFilesCounter(filesCounter + 1);
    emptyClipboard();
  }

  async function bulkDelete() {
    const fileList = Object.values(copiedFiles);

    for (let i = 0; i < fileList.length; i++) {
      const file: any = fileList[i];
      console.log({ file });

      if (file.isDirectory) {
        await deleteFolder(toastId, file.id, file.fileName);
      } else {
        await deleteFile(toastId, file.id, file.fileName);
      }
    }

    setFilesCounter(filesCounter + 1);
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
      {props.filesList.map(({ id, fileName, isDirectory }, index) => {
        return (
          <FileDisplay
            key={id}
            data={{
              id,
              fileName,
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
            {!clipboardDisabled && (
              <button
                className="w-full text-sm mb-2 block mr-4 px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-150 hover:bg-blue-700 hover:text-white focus:outline-none"
                onClick={() => copyHere()}
              >
                Copy Here
              </button>
            )}
            {clipboardDisabled && (
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
            {!clipboardDisabled && (
              <button
                className="w-full text-sm mb-2 block mr-4 px-5 py-2 border-yellow-500 border text-yellow-500 rounded transition duration-150 hover:bg-yellow-700 hover:text-white focus:outline-none"
                onClick={() => moveHere()}
              >
                Move Here
              </button>
            )}
            {clipboardDisabled && (
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
