import { useEffect, useState, memo } from 'react';
import { Document, pdfjs, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfProps {
  blob: any;
}

export const PdfComponent = memo(function Pdf(props: PdfProps) {
  const [pdfTotalPages, setPdfTotalPages] = useState(0);
  const [currentPdfPage, setNextPdfPage] = useState(1);
  const [pdfData, setPdfData] = useState('');

  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // note this flag denote mount status
    return () => {
      setMounted(false);
    }; // use effect cleanup to set flag false, if unmounted
  }, []);

  useEffect(() => {
    if (isMounted) {
      const fileReaderInstance = new FileReader();
      fileReaderInstance.readAsDataURL(props.blob);
      fileReaderInstance.onload = () => {
        const base64Pdf: any = fileReaderInstance.result;
        setPdfData(base64Pdf.toString());
      };
    }
  }, [isMounted]);

  return (
    <div className="flex justify-center items-center flex-col border-black border-2 w-min">
      <div className="flex justify-between mt-4 ml-2 w-full">
        <button
          className={`${
            currentPdfPage > 1 ? 'block' : 'invisible'
          } ml-2 text-sm mb-2 block mr-4 px-5 py-2 border-gray-500 border text-gray-500 rounded transition duration-150 hover:bg-gray-700 hover:text-white focus:outline-none`}
          onClick={() => setNextPdfPage(currentPdfPage - 1)}
        >
          Prev
        </button>
        {currentPdfPage < pdfTotalPages && (
          <button
            className="text-sm mb-2 block mr-4 px-5 py-2 border-gray-500 border text-gray-500 rounded transition duration-150 hover:bg-gray-700 hover:text-white focus:outline-none"
            onClick={() => setNextPdfPage(currentPdfPage + 1)}
          >
            Next
          </button>
        )}
      </div>
      <Document
        file={pdfData}
        onSourceSuccess={() => console.log('Document source retrieved!')}
        onLoadSuccess={({ numPages }) => setPdfTotalPages(numPages)}
        onLoadError={() => console.log('Load Error!')}
      >
        <Page scale={1.5} pageNumber={currentPdfPage} />
      </Document>
    </div>
  );
});
