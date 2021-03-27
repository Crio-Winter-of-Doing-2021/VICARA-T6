import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';
import { useRef } from 'react';

import { withRouter, useHistory } from 'react-router-dom';
import Axios from '../../config/axios';

function DragAndDrop(props: any) {
  const { refetch } = props;
  const history = useHistory();
  const ownerID = '605256109934f80db98712ea';

  const toastId: any = useRef(null);

  async function postFolders(folders: any) {
    let directoryStructure: any = {};
    const formData = new FormData();

    const parentID = history.location.pathname.replace('/', '') ?? ownerID;

    formData.append(folders, JSON.stringify(folders));

    try {
      const { data } = await Axios.post(
        `/create_directory_stucture?parent=${parentID}&owner=${ownerID}`,
        formData
      );
      directoryStructure = data.result;

      await new Promise((resolve) => setTimeout(resolve, 50));
    } catch (err) {
      console.log(err.message);
    }

    for (let i = 0; i < folders.length; i++) {
      const filePathArr = folders[i].path.split('/');
      filePathArr.pop();
      const filePath = filePathArr.join('/');
      const parentID = directoryStructure[filePath];
      const parent = parentID;

      formData.append(parent, folders[i]);
    }

    const options = {
      onUploadProgress: (progressEvent: any) => {
        const { loaded, total } = progressEvent;
        const percent = Math.floor((loaded * 100) / total);
        console.log(`${loaded}kb of ${total} | ${percent}%`);

        if (toastId.current === null) {
          toastId.current = toast(`Upload in Progress ${percent}`, {
            progress: percent
          });
        } else {
          toast.update(toastId.current, {
            progress: percent
          });
        }
      }
    };

    try {
      const { data } = await Axios.post(
        `/upload_folder?owner=${ownerID}`,
        formData,
        options
      );

      console.log(data);
      toast.done(toastId.current);
      refetch();

      await new Promise((resolve) => setTimeout(resolve, 50));
    } catch (err) {
      console.log(err.message);
    }
  }

  async function postFiles(files: any) {
    const formData = new FormData();
    const parentID = history.location.pathname.replace('/', '') ?? ownerID;

    // const notify = () => (toastId.current = toast.warn('Uploading '));

    for (let i = 0; i < files.length; i++) {
      const parent = parentID;

      formData.append(parent, files[i]);
    }

    const options = {
      onUploadProgress: (progressEvent: any) => {
        const { loaded, total } = progressEvent;
        const percent = Math.floor((loaded * 100) / total);
        console.log(`${loaded}kb of ${total} | ${percent}%`);

        if (toastId.current === null) {
          toastId.current = toast(`Upload in Progress ${percent}`, {
            progress: percent
          });
        } else {
          toast.update(toastId.current, {
            progress: percent
          });
        }
      }
    };

    try {
      const { data } = await Axios.post('/upload_file', formData, options);

      console.log(data);
      toast.done(toastId.current);
      refetch();

      await new Promise((resolve) => setTimeout(resolve, 50));
    } catch (err) {
      console.log(err.message);
    }
  }

  async function sendTheFiles(files: any) {
    // Initialize jsZip

    console.log(files);

    const listOfFolders = files.filter((e: any) => e.path !== e.name);
    const listOfFiles = files.filter((e: any) => e.path === e.name);

    if (listOfFolders.length) {
      console.log('FOLDERS FOUND : ', listOfFolders.length);
      await postFolders(listOfFolders);
      console.log('FOLDERS SENT');
    }

    if (listOfFiles.length) {
      console.log('FILES FOUND : ', listOfFiles.length);
      await postFiles(listOfFiles);
      console.log('FILES SENT');
    }
  }

  return (
    <Dropzone onDrop={(acceptedFiles) => sendTheFiles(acceptedFiles)}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div
            {...getRootProps()}
            className="border border-dashed border-black px-10 py-20 mx-8 my-5"
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
