import { useEffect, useState } from 'react';

interface TextProps {
  blob: any;
}

export default function Text(props: TextProps) {
  const [textData, setTextData] = useState('');

  useEffect(() => {
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
  }, [props]);

  return (
    <div className="break-words w-full">
      {textData.length > 0 && <div>{JSON.parse(textData)}</div>}
    </div>
  );
}
