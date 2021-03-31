import { useEffect, useState } from 'react';

interface AudioProps {
  blob: any;
  metadata: string;
}

export default function Audio(props: AudioProps) {
  const [audioSrc, setAudioSrc] = useState('');

  useEffect(() => {
    const url = URL.createObjectURL(props.blob);
    setAudioSrc(url);
  }, []);

  return (
    <div>
      <audio controls>
        <source src={audioSrc} type={props.metadata} />
      </audio>
    </div>
  );
}
