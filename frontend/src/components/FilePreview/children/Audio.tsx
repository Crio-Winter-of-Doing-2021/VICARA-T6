import { useEffect, useState, memo } from 'react';

interface AudioProps {
  blob: any;
  metadata: string;
}

export const AudioComponent = memo(function Audio(props: AudioProps) {
  const [audioSrc, setAudioSrc] = useState('');
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
      setAudioSrc(url);
    }
  }, [isMounted]);

  return (
    <div>
      <audio controls>
        <source src={audioSrc} type={props.metadata} />
      </audio>
    </div>
  );
});
