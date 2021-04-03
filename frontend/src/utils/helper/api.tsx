import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import { IoMdClose } from 'react-icons/io';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import axios from 'axios';

import Axios from '../../config/axios';

interface toastProps {
  source: any;
}

const cancelTheRequest = (source) => {
  if (source) {
    console.log('CANCELLING REQUEST');
    source.cancel('REQUEST CANCELLED');
  }
};

const CloseButton = ({ source }: toastProps) => (
  <span onClick={() => cancelTheRequest(source)}>
    <IoMdClose />
  </span>
);

const InfoButton = (props: any) => (
  <div className="flex justify-between">
    Upload Successful
    <AiOutlineInfoCircle
      className="ml-2"
      size={20}
      onClick={() => props.setIsOpenUploadFilesModal(true)}
    />
  </div>
);

export const uploadFiles = async (
  toastId: any,
  parentID: string,
  files: any,
  setIsOpenUploadFilesModal: any
) => {
  // Define the form data
  const formData = new FormData();

  // Define the source for axios requests
  const source = axios.CancelToken.source();

  // Set the initial value of toast with custom toast button
  toastId.current = toast('Upload in Progress', {
    closeButton: <CloseButton source={source} />
  });

  // Traverse the list of files
  for (let i = 0; i < files.length; i++) {
    const parent = parentID;
    formData.append(parent, files[i]);
  }

  // Define the options for axios request
  const options = {
    cancelToken: source.token,
    onUploadProgress: (progressEvent: any) => {
      const progress = progressEvent.loaded / progressEvent.total;

      // check if we already displayed a toast
      if (toastId.current === null) {
        toastId.current = toast('Upload in Progress', {
          progress: progress
        });
      } else {
        toast.update(toastId.current, {
          progress: progress
        });
      }
    }
  };

  try {
    const { data } = await Axios.post('/upload_file', formData, options);
    console.log(data);

    toast.update(toastId.current, {
      render: (
        <InfoButton setIsOpenUploadFilesModal={setIsOpenUploadFilesModal} />
      ),
      type: toast.TYPE.INFO
    });

    return await new Promise((resolve) => setTimeout(resolve, 50));
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log(err.message);
    }

    console.log(err.message);

    toast.update(toastId.current, {
      render: 'Cancelling Upload',
      type: toast.TYPE.ERROR
    });

    await new Promise((resolve) => {
      setTimeout(() => toast.done(toastId.current), 1000);
    });
  }
};

export const uploadFolders = async (
  toastId: any,
  parentID: string,
  folders: any
) => {
  let directoryStructure: any = {};
  const formData = new FormData();

  // Define the source for axios requests
  const source = axios.CancelToken.source();

  // Set the initial value of toast with custom toast button
  toastId.current = toast('Upload in Progress', {
    closeButton: <CloseButton source={source} />
  });

  const createDirectoryOptions = {
    cancelToken: source.token
  };

  try {
    const { data } = await Axios.post(
      `/create_directory_stucture?parent=${parentID}`,
      { folders },
      createDirectoryOptions
    );
    directoryStructure = data.result;

    await new Promise((resolve) => setTimeout(resolve, 50));

    for (let i = 0; i < folders.length; i++) {
      const filePathArr = folders[i].path.split('/');
      filePathArr.pop();
      const filePath = filePathArr.join('/');
      const parentID = directoryStructure[filePath];
      const parent = parentID;

      formData.append(parent, folders[i]);
    }

    const uploadDirectoryOptions = {
      cancelToken: source.token,
      onUploadProgress: (progressEvent: any) => {
        const progress = progressEvent.loaded / progressEvent.total;

        // check if we already displayed a toast
        if (toastId.current === null) {
          toastId.current = toast('Upload in Progress', {
            progress: progress
          });
        } else {
          toast.update(toastId.current, {
            progress: progress
          });
        }
      }
    };

    const { data: folderData } = await Axios.post(
      '/upload_file',
      formData,
      uploadDirectoryOptions
    );

    console.log(folderData);

    // check if we already displayed a toast
    if (toastId.current === null) {
      toastId.current = toast('Upload successfull');
    } else {
      toast.update(toastId.current, {
        render: 'Upload successfull',
        type: toast.TYPE.INFO,
        autoClose: 1000
      });
    }

    return await new Promise((resolve) => setTimeout(resolve, 50));
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log(err.message);
    }

    console.log(err.message);

    toast.update(toastId.current, {
      render: 'Cancelling Upload',
      type: toast.TYPE.ERROR
    });

    await new Promise((resolve) => {
      setTimeout(() => toast.done(toastId.current), 1000);
    });
  }
};

export const downloadFile = (toastId: any, id: string, name: string) => {
  // Set the initial value of toast with custom toast button
  toastId.current = toast('Downloading ' + name);

  Axios.get(`/download_file?file=${id}`, { responseType: 'blob' })
    .then((response) => new Blob([response.data]))
    .then((blob) => saveAs(blob, name))
    .then(() => {
      toast.update(toastId.current, {
        render: 'Download successfull',
        type: toast.TYPE.INFO,
        autoClose: 1000
      });
    })
    .catch(() => {
      toast.update(toastId.current, {
        render: 'Download unsuccessfull',
        type: toast.TYPE.ERROR,
        autoClose: 1000
      });
    });
};

export const viewFile = async (id: string) => {
  const response = await Axios.get(`/download_file?file=${id}`, {
    responseType: 'blob'
  });
  return response;
};

export const downloadFolder = (toastId: any, folderIds: string[]) => {
  toastId.current = toast('Downloading files');

  Axios.post('/download_folder', { folder: folderIds })
    .then((response: any) => (window.location.href = response.data.url))
    .then(() => {
      toast.update(toastId.current, {
        render: 'Download successfull',
        type: toast.TYPE.INFO,
        autoClose: 1000
      });
    })
    .catch(() => {
      toast.update(toastId.current, {
        render: 'Download unsuccessfull',
        type: toast.TYPE.ERROR,
        autoClose: 1000
      });
    });
};

export const deleteFile = async (toastId: any, id: string, name: string) => {
  toastId.current = toast.error('Deleting ' + name);

  await Axios.delete('/delete_file', { data: { file: id } })
    .then((response) => console.log(response))
    .then(() => {
      toast.update(toastId.current, {
        render: 'Deletion successfull',
        type: toast.TYPE.INFO,
        autoClose: 1000
      });
    })
    .catch(() => {
      toast.update(toastId.current, {
        render: 'Deletion unsuccessfull',
        type: toast.TYPE.ERROR,
        autoClose: 1000
      });
    });
};

export const deleteFolder = (toastId: any, id: string, name: string) => {
  toastId.current = toast.error('Deleting ' + name);

  Axios.delete('/delete_folder', { data: { file: id } })
    .then((response) => console.log(response))
    .then(() => {
      toast.update(toastId.current, {
        render: 'Deletion successfull',
        type: toast.TYPE.INFO,
        autoClose: 1000
      });
    })
    .catch(() => {
      toast.update(toastId.current, {
        render: 'Deletion unsuccessfull',
        type: toast.TYPE.ERROR,
        autoClose: 1000
      });
    });
};
