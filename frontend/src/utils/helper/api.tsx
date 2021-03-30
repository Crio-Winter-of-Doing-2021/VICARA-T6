import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

import Axios from '../../config/axios';

export const downloadFile = (toastId: any, id: string, name: string) => {
  toastId.current = toast('Downloading ' + name);

  const update = () =>
    toast.update(toastId.current, {
      render: 'Download successfull',
      type: toast.TYPE.INFO,
      autoClose: 1000
    });

  Axios.get(`/download_file?file=${id}`, { responseType: 'blob' })
    .then((response) => new Blob([response.data]))
    .then((blob) => saveAs(blob, name))
    .then(() => update());
};

export const viewFile = async (id: string) => {
  const response = await Axios.get(`/download_file?file=${id}`, {
    responseType: 'blob'
  });
  return response;
};

export const downloadFolder = (toastId: any, folderIds: string[]) => {
  toastId.current = toast('Downloading files');

  const update = () =>
    toast.update(toastId.current, {
      render: 'Download successfull',
      type: toast.TYPE.INFO,
      autoClose: 1000
    });

  Axios.post(
    '/download_folder',
    { folder: folderIds },
    { responseType: 'blob' }
  )
    .then((response) => new Blob([response.data]))
    .then((blob) => saveAs(blob, 'myFolder.zip'))
    .then(() => update());
};

export const deleteFile = async (toastId: any, id: string, name: string) => {
  toastId.current = toast.error('Deleting ' + name);

  const update = () =>
    toast.update(toastId.current, {
      render: 'Deletion successfull',
      type: toast.TYPE.INFO,
      autoClose: 1000
    });

  await Axios.delete('/delete_file', { data: { file: id } })
    .then((response) => console.log(response))
    .then(() => update());
};

export const deleteFolder = (toastId: any, id: string, name: string) => {
  toastId.current = toast.error('Deleting ' + name);

  const update = () =>
    toast.update(toastId.current, {
      render: 'Deletion successfull',
      type: toast.TYPE.INFO,
      autoClose: 1000
    });

  Axios.delete('/delete_folder', { data: { file: id } })
    .then((response) => console.log(response))
    .then(() => update());
};
