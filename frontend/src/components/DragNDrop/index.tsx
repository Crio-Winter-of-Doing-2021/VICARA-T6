import Dropzone, { useDropzone } from 'react-dropzone';
import { useEffect, useRef, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { BsUpload } from 'react-icons/bs';

import UploadFilesInfo from '../Modal/UploadFilesInfo';
import { useFileContext } from '../../contexts/File';
import { uploadFiles, uploadFolders } from '../../utils/helper/api';

function DragAndDrop(props: any) {
  const history = useHistory();

  const [showUploadFilesModal, setIsOpenUploadFilesModal] = useState(false);
  const { filesCounter, setFilesCounter } = useFileContext();
  const [data, setData] = useState([]);
  const toastId: any = useRef(null);
  const parentID = history.location.pathname.replace('/', '');

  useEffect(() => {
    console.log('DragNDrop: I got rendered too');
  }, []);

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true
  });

  useEffect(() => {
    sendTheFiles(acceptedFiles);
  }, [acceptedFiles]);

  async function sendTheFiles(files: any) {
    // Initialize jsZip

    const listOfFolders = files.filter((e: any) => e.path !== e.name);
    const listOfFiles = files.filter((e: any) =>
      e?.path ? e.path === e.name : true
    );

    if (listOfFolders.length) {
      console.log('FOLDERS FOUND : ', listOfFolders.length);
      const result = await uploadFolders(
        toastId,
        parentID,
        listOfFolders,
        setIsOpenUploadFilesModal
      );
      setData(result);
      setFilesCounter(filesCounter + 1);
      console.log('FOLDERS SENT');
    }

    if (listOfFiles.length) {
      console.log('FILES FOUND : ', listOfFiles.length);
      const result = await uploadFiles(
        toastId,
        parentID,
        listOfFiles,
        setIsOpenUploadFilesModal
      );
      setData(result);
      setFilesCounter(filesCounter + 1);
      console.log('FILES SENT');
    }
  }

  if (props.disabled) {
    return (
      <div>
        <div className="border-2 border-dotted bg-gray-200 opacity-100 border-black px-10 py-12 mx-8 my-5 flex justify-center items-center flex-col sm:hidden">
          <input disabled={true} />
          <p className="text-lg">Cannot upload inside a file</p>
        </div>
        <div className="hidden sm:block">
          <div className="flex justify-center items-center mx-10 mt-4">
            <button className="rounded-lg border-2 border-gray-500 hover:bg-gray-100 text-gray-500 font-bold py-2 px-4 w-full inline-flex items-center">
              <span className="ml-2">Upload Document Disabled</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sm:hidden">
        <Dropzone onDrop={(acceptedFiles) => sendTheFiles(acceptedFiles)}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div
                {...getRootProps()}
                className="border-2 border-dotted bg-white opacity-100 border-black px-10 py-10 mx-8 my-5 flex justify-center items-center flex-col"
              >
                <input {...getInputProps()} disabled={props.disabled} />
                <BsUpload size={25} className="mb-4" />
                <p className="text-lg">
                  Drag and drop files and folders here to upload them
                </p>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
      <div className="sm:block hidden">
        <div className="container flex justify-center items-center">
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className="overflow-hidden relative w-64 mt-4 mb-4 cursor-pointer">
              <button
                className="rounded-lg border-2 border-blue-500 hover:bg-blue-100 text-blue-500 font-bold py-2 px-4 w-full inline-flex items-center"
                onClick={open}
              >
                <BsUpload />
                <span className="ml-2">Upload Document</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <UploadFilesInfo
        modalIsOpen={showUploadFilesModal}
        data={data}
        setIsOpenModal={setIsOpenUploadFilesModal}
      />
    </>
  );
}
export default withRouter(DragAndDrop);
