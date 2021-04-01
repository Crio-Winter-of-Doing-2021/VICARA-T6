import Dropzone from 'react-dropzone';
import { useEffect, useRef } from 'react';
import { withRouter, useHistory } from 'react-router-dom';

import { useFileContext } from '../../contexts/File';
import { uploadFiles, uploadFolders } from '../../utils/helper/api';

function DragAndDrop(props: any) {
  const history = useHistory();
  const ownerID = '605256109934f80db98712ea';
  const { filesCounter, setFilesCounter } = useFileContext();

  const toastId: any = useRef(null);
  const parentID = history.location.pathname.replace('/', '') ?? ownerID;

  useEffect(() => {
    console.log('DragNDrop: I got rendered too');
  }, []);

  async function sendTheFiles(files: any) {
    // Initialize jsZip

    console.log(files);

    const listOfFolders = files.filter((e: any) => e.path !== e.name);
    const listOfFiles = files.filter((e: any) => e.path === e.name);

    if (listOfFolders.length) {
      console.log('FOLDERS FOUND : ', listOfFolders.length);
      await uploadFolders(toastId, parentID, ownerID, listOfFolders);
      setFilesCounter(filesCounter + 1);
      console.log('FOLDERS SENT');
    }

    if (listOfFiles.length) {
      console.log('FILES FOUND : ', listOfFiles.length);
      await uploadFiles(toastId, parentID, ownerID, listOfFiles);
      setFilesCounter(filesCounter + 1);
      console.log('FILES SENT');
    }
  }

  return (
    <Dropzone onDrop={(acceptedFiles) => sendTheFiles(acceptedFiles)}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div
            {...getRootProps()}
            className="border border-dashed border-black px-10 py-20 mx-8 my-5 w-80vw"
          >
            <input {...getInputProps()} />
            <p>Drag and drop some files here, or click to select files</p>
          </div>
        </section>
      )}
    </Dropzone>
  );
}
export default withRouter(DragAndDrop);
