import { useEffect, useState } from 'react';

interface ImageProps {
  blob: any;
  mimetype: string;
}

export default function Image(props: ImageProps) {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    console.log({ props });
    const blob = new Blob([props.blob], {
      type: props.mimetype,
      endings: 'native'
    });
    const fileReaderInstance = new FileReader();
    fileReaderInstance.readAsDataURL(blob);
    fileReaderInstance.onload = () => {
      const base64Image = fileReaderInstance.result;
      setImageUrl(JSON.stringify(base64Image));
    };
  }, [props]);

  return <div>{imageUrl.length > 0 && <img src={JSON.parse(imageUrl)} />}</div>;
}
