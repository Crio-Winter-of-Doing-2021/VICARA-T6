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
  const [isLoading, setLoading] = useState(true);
  const [blob, setBlob] = useState<any>(null);

  useEffect(() => {
    async function fetchMyAPI() {
      if (blob === null) {
        const { data } = await viewFile(props?.data?._id);
        setBlob(data);
        setLoading(false);
      }
    }

    fetchMyAPI();
  }, [props]);

  const DownloadFile = () => {
    const blobFile = new Blob([blob]);
    saveAs(blobFile, props.data.name);
  };

  if (isLoading) {
    return (
      <div className="w-80vw h-50vh flex items-center justify-center">
        <Loader type="BallTriangle" color="#f56789" height={100} width={100} />
      </div>
    );
  }

  if (props.data.type === 'application/pdf') {
    return (
      <BasePreviewLayout download={DownloadFile}>
        <Pdf blob={blob} />
      </BasePreviewLayout>
    );
  } else if (props.data.type.includes('audio')) {
    return (
      <BasePreviewLayout download={DownloadFile}>
        <Audio blob={blob} metadata={props?.data?.type} />
      </BasePreviewLayout>
    );
  } else if (
    props.data.type.includes('text') ||
    props.data.type.includes('json') ||
    props.data.type.includes('octet-stream')
  ) {
    return (
      <BasePreviewLayout download={DownloadFile}>
        <Text blob={blob} />
      </BasePreviewLayout>
    );
  } else if (props.data.type.includes('image')) {
    return (
      <BasePreviewLayout download={DownloadFile}>
        <Image blob={blob} />
      </BasePreviewLayout>
    );
  } else if (props.data.type.includes('video')) {
    return (
      <BasePreviewLayout download={DownloadFile}>
        <Video blob={blob} />
      </BasePreviewLayout>
    );
  }

  return <div>Hello</div>;
}
