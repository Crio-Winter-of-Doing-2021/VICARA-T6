import { useEffect, useState, memo } from 'react';

interface VideoProps {
  blob: any;
}

export const VideoComponent = memo(function Video(props: VideoProps) {
  const [videoSrc, setVideoSrc] = useState('');
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // note this flag denote mount status
    return () => {
      setMounted(false);
    }; // use effect cleanup to set flag false, if unmounted
  }, []);

  useEffect(() => {
    if (isMounted) {
      const url = URL.createObjectURL(props.blob);
      setVideoSrc(url);
    }
  }, [isMounted]);

  return (
    <div>
      {videoSrc.length > 0 && (
        <video src={videoSrc} autoPlay={true} muted={true} />
      )}
    </div>
  );
});
