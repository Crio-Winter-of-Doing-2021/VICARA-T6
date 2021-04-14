import { useEffect, useState, memo } from 'react';

interface ImageProps {
  blob: any;
  mimetype: string;
}

export const ImageComponent = memo(function Image(props: ImageProps) {
  const [imageUrl, setImageUrl] = useState('');
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
        type: props.mimetype,
        endings: 'native'
      });
      const fileReaderInstance = new FileReader();
      fileReaderInstance.readAsDataURL(blob);
      fileReaderInstance.onload = () => {
        const base64Image = fileReaderInstance.result;
        setImageUrl(JSON.stringify(base64Image));
      };
    }
  }, [isMounted]);

  return (
    <div>
      {imageUrl.length > 0 && (
        <img src={JSON.parse(imageUrl)} alt="drive-pics" />
      )}
    </div>
  );
});
