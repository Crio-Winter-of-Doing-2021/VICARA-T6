import Dropzone from 'react-dropzone';
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

  async function sendTheFiles(files: any) {
    // Initialize jsZip
    const condition = true;
    console.log(files);

    const listOfFolders = files.filter((e: any) => e.path !== e.name);
    const listOfFiles = files.filter((e: any) => e.path === e.name);

    if (condition) {
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
  }

  if (props.disabled) {
    return (
      <div>
        <div className="border-2 border-dotted bg-gray-200 opacity-100 border-black px-10 py-12 mx-8 my-5 w-80vw flex justify-center items-center flex-col">
          <input disabled={true} />
          <p className="text-lg">Cannot upload inside a file</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Dropzone onDrop={(acceptedFiles) => sendTheFiles(acceptedFiles)}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div
              {...getRootProps()}
              className="border-2 border-dotted bg-white opacity-100 border-black px-10 py-10 mx-8 my-5 w-80vw flex justify-center items-center flex-col"
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

      <UploadFilesInfo
        modalIsOpen={showUploadFilesModal}
        data={data}
        setIsOpenModal={setIsOpenUploadFilesModal}
      />
    </>
  );
}
export default withRouter(DragAndDrop);
