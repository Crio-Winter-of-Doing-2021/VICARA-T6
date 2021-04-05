import { HiEye } from 'react-icons/hi';

import { useFileContext } from '../../../contexts/File';
import FileDisplay from './filesDisplay';

export default function StarredFiles(props: any) {
  const { changeParentFolder } = useFileContext();

  return (
    <>
      {props?.filesList?.map((file: any) => {
        const { id, isDirectory, fileName } = file;

        return (
          <FileDisplay
            key={id}
            data={{
              id,
              fileName,
              isDirectory
            }}
            icon={<HiEye size={16} />}
            callback={() => changeParentFolder(id)}
          />
        );
      })}
    </>
  );
}
