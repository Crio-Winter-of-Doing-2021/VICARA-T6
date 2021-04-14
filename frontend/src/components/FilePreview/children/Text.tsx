import { useEffect, useState, memo } from 'react';

interface TextProps {
  blob: any;
}

export const TextComponent = memo(function Text(props: TextProps) {
  const [textData, setTextData] = useState('');
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // note this flag denote mount status
    return () => {
      setMounted(false);
    }; // use effect cleanup to set flag false, if unmounted
  }, []);

  useEffect(() => {
    if (isMounted) {
      const blob = new Blob([props.blob], {
        type: 'text/plain',
        endings: 'native'
      });
      const reader = new FileReader();
      reader.addEventListener('loadend', function () {
        const textualData = reader.result;
        setTextData(JSON.stringify(textualData).replace(/\n/g, '\r\n')); // will print out file content
      });
      reader.readAsText(blob);
    }
  }, [isMounted]);

  return (
    <div className="break-words w-full">
      {textData.length > 0 && <div>{JSON.parse(textData)}</div>}
    </div>
  );
});
