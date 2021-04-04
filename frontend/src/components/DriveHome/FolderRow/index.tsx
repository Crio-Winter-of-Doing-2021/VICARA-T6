import { format } from 'date-fns';
import { useState, useRef } from 'react';
import { BsThreeDots, BsDownload } from 'react-icons/bs';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { AiOutlineShareAlt, AiOutlineStar } from 'react-icons/ai';
import { HiOutlinePencilAlt, HiEye } from 'react-icons/hi';
import { Menu, Item, Separator, useContextMenu } from 'react-contexify';
import { useMutation } from 'react-query';
import prettyBytes from 'pretty-bytes';
import 'react-contexify/dist/ReactContexify.css';

import RenameModal from '../../Modal/RenameModal';
import GenerateLinkModal from '../../Modal/GenerateLinkModal';
import Axios from '../../../config/axios';
import fileMapper from '../../../utils/helper/fileMapper';
import {
  deleteFile,
  deleteFolder,
  downloadFile,
  downloadFolder
} from '../../../utils/helper/api';
import { useFileContext } from '../../../contexts/File';
import FilesSchmea from '../../../utils/interfaces/FilesSchema';

interface FolderRowProps {
  file: FilesSchmea;
  fileSelected?: boolean;
  selectFile(id: string): void;
  fileInClipboard: boolean;
  disableSelection: boolean;
  addNewFileToCopy(
    id: string,
    name: string,
    isDirectory: boolean,
    isSelected: boolean,
    parentID: string
  ): void;
}

export default function FolderRow({
  file,
  fileSelected,
  selectFile,
  disableSelection,
  addNewFileToCopy,
  fileInClipboard
}: FolderRowProps) {
  const {
    _id: fileID,
    name,
    directory: isDirectory,
    extension,
    size,
    parent,
    updatedAt,
    starred
  } = file;
  const toastID: any = useRef(null);
  const {
    filesCounter,
    setFilesCounter,
    changeParentFolder
  } = useFileContext();

  const MENU_ID = fileID;

  const { show } = useContextMenu({
    id: MENU_ID
  });
  const [showRenameModal, setIsOpenRenameModal] = useState(false);
  const [showLinkModal, setIsOpenLinkModal] = useState(false);

  const starMutation = useMutation((fileID: any) => {
    const result = Axios.post('/starred_files', { fileID });
    setFilesCounter(filesCounter + 1);
    return result;
  });

  const displayMenu = (e: any, fileID: string) => {
    selectFile(fileID);
    show(e);
  };

  const handleDelete = (
    fileID: string,
    isDirectory: boolean,
    toastID: any,
    name: string
  ) => {
    if (fileInClipboard) {
      addNewFileToCopy(fileID, name, isDirectory, fileInClipboard, parent);
    }

    if (isDirectory) {
      deleteFolder(toastID, fileID, name);
    } else {
      deleteFile(toastID, fileID, name);
    }
  };

  const fileSize: any = size;

  return (
    <>
      <tr
        className={`${fileSelected && 'bg-yellow-50'}`}
        onDoubleClick={() => {
          !disableSelection && changeParentFolder(fileID);
        }}
        onContextMenu={(e) => displayMenu(e, fileID)}
      >
        {/* <div onContextMenu={show}> */}
        <td className="py-4 pr-0 pl-2 w-1 ml-2 border-b border-gray-200">
          <label className="flex justify-start items-start">
            <div className="bg-white border-2 rounded border-gray-200 w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
              <input
                type="checkbox"
                className="opacity-0 absolute"
                onClick={() =>
                  addNewFileToCopy(
                    fileID,
                    name,
                    isDirectory,
                    fileInClipboard,
                    parent
                  )
                }
              />
              <svg
                className={`fill-current w-3 h-3 text-blue-500 pointer-events-none ${
                  fileInClipboard ? 'block' : 'hidden'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
              </svg>
            </div>
          </label>
        </td>
        <td className="py-4 whitespace-no-wrap border-b border-gray-200">
          <div className="flex justify-start items-start">
            <img
              className="mr-3"
              height={20}
              width={20}
              src={fileMapper(extension, isDirectory)}
            />
            <div className="text-sm leading-5 text-blue-900 max-w-lg overflow-ellipsis overflow-hidden whitespace-nowrap">
              {name}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-sm leading-5">
          {(fileSize && prettyBytes(fileSize)) ?? '-'}
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
                onClick={() => downloadFolder(toastID, [fileID])}
              >
                <span className="flex items-center">
                  <BsDownload className="mr-1" />
                  Download
                </span>
              </button>
              <button
                className="mr-4 px-5 py-2 border-red-500 border text-red-500 rounded transition duration-300 hover:bg-red-700 hover:text-white focus:outline-none"
                onClick={() => handleDelete(fileID, true, toastID, name)}
              >
                <span className="flex items-center">
                  <RiDeleteBin5Line className="mr-1" />
                  Delete
                </span>
              </button>
            </>
          )}

          {!isDirectory && (
            <>
              <button
                className="mr-4 px-5 py-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none"
                onClick={() => downloadFile(toastID, fileID, name)}
              >
                <span className="flex items-center">
                  <BsDownload className="mr-1" />
                  Download
                </span>
              </button>
              <button
                className="mr-4 px-5 py-2 border-red-500 border text-red-500 rounded transition duration-300 hover:bg-red-700 hover:text-white focus:outline-none"
                onClick={() => handleDelete(fileID, false, toastID, name)}
              >
                <span className="flex items-center">
                  <RiDeleteBin5Line className="mr-1" />
                  Delete
                </span>
              </button>
            </>
          )}
          <button
            className="mr-4 px-5 py-2 border-gray-500 border text-gray-500 rounded transition duration-300 hover:bg-gray-700 hover:text-white focus:outline-none"
            onClick={(e) => displayMenu(e, fileID)}
          >
            <BsThreeDots />
          </button>
        </td>
        {/* </div> */}
      </tr>

      <Menu id={MENU_ID}>
        <>
          {disableSelection && (
            <Item disabled={true}>
              <HiEye className="mr-2" />
              Cannot View Selected Directory
            </Item>
          )}
        </>

        <>
          {!disableSelection && (
            <Item onClick={() => changeParentFolder(fileID)}>
              <HiEye className="mr-2" />
              View
            </Item>
          )}
        </>
        <Separator />
        <Item onClick={() => setIsOpenRenameModal(true)}>
          <HiOutlinePencilAlt className="mr-2" />
          Rename
        </Item>
        <Separator />
        <Item onClick={() => starMutation.mutate(fileID)}>
          <AiOutlineStar className="mr-2" />
          {starred ? 'Remove starred' : 'Add to Starred'}
        </Item>
        <Item onClick={() => setIsOpenLinkModal(true)}>
          <AiOutlineShareAlt className="mr-2" />
          Generate sharable link
        </Item>
      </Menu>

      <GenerateLinkModal
        modalIsOpen={showLinkModal}
        setIsOpenModal={setIsOpenLinkModal}
        name={name}
        id={fileID}
        isDirectory={isDirectory}
        parent={parent}
      />

      <RenameModal
        modalIsOpen={showRenameModal}
        setIsOpenModal={setIsOpenRenameModal}
        name={name}
        id={fileID}
        parent={parent}
      />
    </>
  );
}
