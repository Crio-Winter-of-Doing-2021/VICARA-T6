import { createContext, useContext, useState } from 'react';

type ContextProps = {
  copiedFiles?: any;
  disableSelection?: any;
  selectTheCurrentFile?: any;
  emptyClipboard?: any;
  filesCounter?: any;
  setFilesCounter?: any;
  removeFileFromClipboard?: any;
};

const FileContext = createContext<ContextProps>({});

export const useFileContext = () => useContext(FileContext);

export const FileContextProvider = (props: any) => {
  const [copiedFiles, copyNewFile] = useState({});
  const [disableSelection] = useState(false);
  const [filesCounter, setFilesCounter] = useState(0);

  const selectTheCurrentFile = (
    id: any,
    name: any,
    isDirectory: boolean,
    isSelected: boolean
  ): void => {
    copyNewFile({
      ...copiedFiles,
      [id]: {
        id,
        selected: !isSelected,
        name,
        isDirectory
      }
    });
  };

  const removeFileFromClipboard = (id: any): void => {
    copyNewFile({
      ...copiedFiles,
      [id]: {
        selected: false
      }
    });
  };

  const emptyClipboard = () => {
    copyNewFile({});
  };

  return (
    <FileContext.Provider
      value={{
        filesCounter,
        setFilesCounter,
        copiedFiles,
        disableSelection,
        removeFileFromClipboard,
        emptyClipboard,
        selectTheCurrentFile
      }}
    >
      {props.children}
    </FileContext.Provider>
  );
};
