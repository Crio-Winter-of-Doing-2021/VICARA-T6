import { useEffect, useRef, useState, memo } from 'react';
import { downloadFile, viewFile } from '../../utils/helper/api';
import { BsDownload, BsEyeSlash } from 'react-icons/bs';
import { saveAs } from 'file-saver';
import { PdfComponent } from './children/Pdf';
import { AudioComponent } from './children/Audio';
import { TextComponent } from './children/Text';
import { ImageComponent } from './children/Image';
import { VideoComponent } from './children/Video';
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

export const FilePreviewComponent = memo(function FilePreview(props: any) {
  // const [fileType, setFileT] = useState(null);
  const fileData: FilesSchmea = props.data;
  const [isLoading, setLoading] = useState(true);
  const [blob, setBlob] = useState<any>(null);
  const toastId: any = useRef(null);

  const supportedFilesArr = [
    'application/pdf',
    'audio',
    'text',
    'json',
    'image',
    'video'
  ];
  const [previewSupported, togglePreview] = useState(false);

  useEffect(() => {
    setBlob(null);
    setLoading(true);
    togglePreview(false);

    async function fetchMyAPI() {
      console.log({ props, blob });

      for (let i = 0; i < supportedFilesArr.length; i++) {
        if (props.data.mimetype.includes(supportedFilesArr[i])) {
          const { data } = await viewFile(fileData?.id);
          setBlob(data);
          togglePreview(true);
          setLoading(false);
          break;
        }
      }

      if (!previewSupported) {
        setLoading(false);
      }
    }

    console.log(props.data.mimetype);
    fetchMyAPI();
  }, [props]);

  const DownloadFile = async () => {
    if (previewSupported) {
      const blobFile = new Blob([blob]);
      saveAs(blobFile, fileData.fileName);
    } else {
      await downloadFile(toastId, fileData?.id, fileData.fileName);
    }
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
        <PdfComponent blob={blob} />
      </BasePreviewLayout>
    );
  } else if (fileData.mimetype.includes('audio')) {
    return (
      <BasePreviewLayout download={DownloadFile}>
        <AudioComponent blob={blob} metadata={fileData.mimetype} />
      </BasePreviewLayout>
    );
  } else if (
    fileData.mimetype.includes('text') ||
    fileData.mimetype.includes('json')
  ) {
    return (
      <BasePreviewLayout download={DownloadFile}>
        <TextComponent blob={blob} />
      </BasePreviewLayout>
    );
  } else if (fileData.mimetype.includes('image')) {
    return (
      <BasePreviewLayout download={DownloadFile}>
        <ImageComponent mimetype={props.data.mimetype} blob={blob} />
      </BasePreviewLayout>
    );
  } else if (fileData.mimetype.includes('video')) {
    return (
      <BasePreviewLayout download={DownloadFile}>
        <VideoComponent blob={blob} />
      </BasePreviewLayout>
    );
  }

  return (
    <div>
      <div className="px-10 py-40 overflow-x-auto flex justify-center items-center flex-col">
        <div className="bg-gray-100 rounded-lg px-10 py-10 flex justify-center items-center flex-col text-center">
          <BsEyeSlash size={60} className="mb-5" />
          <p className="mb-5">
            File Preview not supported, <br /> Don't worry you can still
            download the file
          </p>
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
});
