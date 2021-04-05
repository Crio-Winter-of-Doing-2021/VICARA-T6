import { useEffect, useState } from 'react';
import { viewFile } from '../../utils/helper/api';
import { BsDownload } from 'react-icons/bs';
import { saveAs } from 'file-saver';
import Pdf from './children/Pdf';
import Audio from './children/Audio';
import Text from './children/Text';
import Image from './children/Image';
import Video from './children/Video';
import Loader from 'react-loader-spinner';
import FilesSchmea from '../../utils/interfaces/FilesSchema';

const BasePreviewLayout = (props: any) => {
  return (
    <div className="flex justify-center items-center mb-10 w-80vw flex-col">
      <div className="w-5/6 flex justify-center">{props.children}</div>
      <div className="mt-4">
        <button
          className="ml-2 text-sm mb-2 block mr-4 px-5 py-2 border-green-500 border text-green-500 rounded transition duration-150 hover:bg-green-700 hover:text-white focus:outline-none"
          onClick={() => props.download()}
        >
          <span className="flex items-center">
            <BsDownload className="mr-1" />
            Download
          </span>
        </button>
      </div>
    </div>
  );
};

export default function FilePreview(props: any) {
  // const [fileType, setFileT] = useState(null);
  const fileData: FilesSchmea = props.data;
  const [isLoading, setLoading] = useState(true);
  const [blob, setBlob] = useState<any>(null);

  useEffect(() => {
    async function fetchMyAPI() {
      if (blob === null) {
        const { data } = await viewFile(fileData?.id);
        setBlob(data);
        setLoading(false);
      }
    }

    fetchMyAPI();
  }, [props]);

  const DownloadFile = () => {
    const blobFile = new Blob([blob]);
    saveAs(blobFile, fileData.fileName);
  };

  if (isLoading) {
    return (
      <div className="w-80vw h-50vh flex items-center justify-center">
        <Loader type="BallTriangle" color="#f56789" height={100} width={100} />
      </div>
    );
  }

  if (fileData.mimetype === 'application/pdf') {
    return (
      <BasePreviewLayout download={DownloadFile}>
        <Pdf blob={blob} />
      </BasePreviewLayout>
    );
  } else if (fileData.mimetype.includes('audio')) {
    return (
      <BasePreviewLayout download={DownloadFile}>
        <Audio blob={blob} metadata={fileData.mimetype} />
      </BasePreviewLayout>
    );
  } else if (
    fileData.mimetype.includes('text') ||
    fileData.mimetype.includes('json') ||
    fileData.mimetype.includes('octet-stream')
  ) {
    return (
      <BasePreviewLayout download={DownloadFile}>
        <Text blob={blob} />
      </BasePreviewLayout>
    );
  } else if (fileData.mimetype.includes('image')) {
    return (
      <BasePreviewLayout download={DownloadFile}>
        <Image blob={blob} />
      </BasePreviewLayout>
    );
  } else if (fileData.mimetype.includes('video')) {
    return (
      <BasePreviewLayout download={DownloadFile}>
        <Video blob={blob} />
      </BasePreviewLayout>
    );
  }

  return (
    <div>
      <div className="flex justify-center item-center">
        <div className="flex flex-col justify-between items-center h-36">
          File preview not supported
          <button
            className="ml-2 text-sm mb-10 block mr-4 px-5 py-2 border-green-500 border text-green-500 rounded transition duration-150 hover:bg-green-700 hover:text-white focus:outline-none "
            onClick={() => DownloadFile()}
          >
            <span className="flex items-center">
              <BsDownload className="mr-1" />
              Download
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
