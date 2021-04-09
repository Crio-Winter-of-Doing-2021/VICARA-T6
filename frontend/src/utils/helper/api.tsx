import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import { IoMdClose } from 'react-icons/io';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import axios from 'axios';

import createDirStructure from './createDirStructure';
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
    Upload request completed
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
      const progress = (
        (progressEvent.loaded / progressEvent.total) *
        100
      ).toFixed(2);

      // check if we already displayed a toast
      if (toastId.current === null) {
        toast.update(toastId.current, {
          render: `Upload in Progress ${progress} %`
        });
      } else {
        toast.update(toastId.current, {
          render: `Upload in Progress ${progress} %`
        });
      }
    }
  };

  try {
    const { data: filesData } = await Axios.post(
      '/files/upload',
      formData,
      options
    );

    toast.update(toastId.current, {
      render: (
        <InfoButton setIsOpenUploadFilesModal={setIsOpenUploadFilesModal} />
      ),
      type: toast.TYPE.WARNING
    });

    return filesData;
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log(err.message);
    }

    console.log(err.message);

    toast.update(toastId.current, {
      render: 'Upload Cancelled',
      type: toast.TYPE.ERROR,
      autoClose: 1000
    });

    // await new Promise((resolve) => {
    //   setTimeout(() => toast.done(toastId.current), 1000);
    // });
  }
};

export const uploadFolders = async (
  toastId: any,
  parentId: string,
  folders: any,
  setIsOpenUploadFilesModal: any
) => {
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

  const folderStructureArr = createDirStructure(folders);

  try {
    const { data } = await Axios.post(
      '/folders/create',
      { parentId, paths: folderStructureArr },
      createDirectoryOptions
    );

    const directoryStructure = data;

    await new Promise((resolve) => setTimeout(resolve, 50));

    for (let i = 0; i < folderStructureArr.length; i++) {
      const parentID = directoryStructure[folderStructureArr[i]];
      const parent = parentID;
      formData.append(parent, folders[i]);
    }

    const uploadDirectoryOptions = {
      cancelToken: source.token,
      onUploadProgress: (progressEvent: any) => {
        const progress = (
          (progressEvent.loaded / progressEvent.total) *
          100
        ).toFixed(2);

        // check if we already displayed a toast
        if (toastId.current === null) {
          toast.update(toastId.current, {
            render: `Upload in Progress ${progress} %`
          });
        } else {
          toast.update(toastId.current, {
            render: `Upload in Progress ${progress} %`
          });
        }
      }
    };

    const { data: folderData } = await Axios.post(
      '/files/upload',
      formData,
      uploadDirectoryOptions
    );

    toast.update(toastId.current, {
      render: (
        <InfoButton setIsOpenUploadFilesModal={setIsOpenUploadFilesModal} />
      ),
      type: toast.TYPE.WARNING
    });

    return folderData;
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log(err.message);
    }

    console.log(err.message);

    toast.update(toastId.current, {
      render: 'Cancelling Upload',
      type: toast.TYPE.ERROR,
      autoClose: 1000
    });

    // await new Promise((resolve) => {
    //   setTimeout(() => toast.done(toastId.current), 1000);
    // });
  }
};

export const downloadFile = (toastId: any, id: string, name: string) => {
  // Set the initial value of toast with custom toast button
  toastId.current = toast('Downloading ' + name);

  Axios.get(`/downloads/file/${id}`, { responseType: 'blob' })
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
  const response = await Axios.get(`/downloads/file/${id}`, {
    responseType: 'blob'
  });
  return response;
};

export const downloadFolder = (toastId: any, folderIds: string[]) => {
  toastId.current = toast('Downloading files');

  console.log({ folderIds });

  Axios.post('/downloads/folder', { folder: folderIds })
    .then((response: any) => window.open(response.data.url, '_blank'))
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
  toastId.current = toast('Deleting ' + name);

  await Axios.delete(`/files/delete/${id}`)
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

export const deleteFolder = async (toastId: any, id: string, name: string) => {
  toastId.current = toast('Deleting ' + name);

  await Axios.delete(`/folders/delete/${id}`)
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
