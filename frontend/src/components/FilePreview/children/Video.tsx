import { useEffect, useState } from 'react';

interface VideoProps {
  blob: any;
}

export default function Video(props: VideoProps) {
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    const url = URL.createObjectURL(props.blob);
    setVideoSrc(url);
  }, []);

  return (
    <div>
      {videoSrc.length > 0 && (
        <video src={videoSrc} autoPlay={true} muted={true} />
      )}
    </div>
  );
}
