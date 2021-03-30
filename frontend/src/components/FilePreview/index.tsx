import { useEffect, useState } from 'react';
import { viewFile } from '../../utils/helper/api';
import { Document, pdfjs, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function FilePreview(props: any) {
  const [imageURL] = useState('');
  const [textData] = useState('');
  const [videoSrc] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const [pdfTotalPages, setPdfTotalPages] = useState(0);
  const [currentPdfPage, setNextPdfPage] = useState(1);
  const [pdfData] = useState('');

  async function callMe() {
    const { data } = await viewFile(props?.data?._id);

    const blob = await new Blob([data], {
      type: 'application/pdf',
      endings: 'native'
    });
    // const fileReaderInstance = new FileReader();
    // fileReaderInstance.readAsDataURL(blob);
    // fileReaderInstance.onload = () => {
    //   const base64Image = fileReaderInstance.result;
    //   setImageURL(JSON.stringify(base64Image));
    // };

    // const reader = new FileReader();
    // reader.addEventListener('loadend', function () {
    //   const textualData = reader.result;
    //   setTextData(JSON.stringify(textualData).replace(/\n/g, '\r\n')); // will print out file content
    // });
    // reader.readAsText(blob);

    // const url = URL.createObjectURL(blob);
    // setVideoSrc(url);

    // const fileReaderInstance = new FileReader();
    // fileReaderInstance.readAsDataURL(blob);
    // fileReaderInstance.onload = () => {
    //   const base64Pdf: any = fileReaderInstance.result;
    //   setPdfData(base64Pdf.toString());
    // };

    const url = URL.createObjectURL(blob);
    setAudioSrc(url);
  }

  useEffect(() => {
    console.log(props.data);
    callMe();
  }, [props?.data]);

  return (
    <div>
      {imageURL.length > 0 && <img src={JSON.parse(imageURL)} />}
      {textData.length > 0 && <div>{JSON.parse(textData)}</div>}
      {videoSrc.length > 0 && (
        <video src={videoSrc} autoPlay={true} muted={true} />
      )}
      {pdfData.length > 0 && (
        <>
          <Document
            file={pdfData}
            onSourceSuccess={() => console.log('Document source retrieved!')}
            onLoadSuccess={({ numPages }) => setPdfTotalPages(numPages)}
            onLoadError={() => console.log('Load Error!')}
          >
            <Page pageNumber={currentPdfPage} />
          </Document>

          {currentPdfPage > 1 && (
            <button onClick={() => setNextPdfPage(currentPdfPage - 1)}>
              Prev
            </button>
          )}
          {currentPdfPage < pdfTotalPages && (
            <button onClick={() => setNextPdfPage(currentPdfPage + 1)}>
              Next
            </button>
          )}
        </>
      )}
      {audioSrc.length > 0 && (
        <audio controls>
          <source src={audioSrc} type="audio/ogg" />
        </audio>
      )}
    </div>
  );
}
