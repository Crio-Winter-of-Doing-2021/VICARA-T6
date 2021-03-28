import { createContext, useContext, useState } from 'react';

type ContextProps = {
  copiedFiles?: any;
  addNewFileToCopy?: any;
  emptyClipboard?: any;
  removeFileFromClipboard?: any;
};

const FileContext = createContext<ContextProps>({});

export const useFileContext = () => useContext(FileContext);

export const FileContextProvider = (props: any) => {
  const [copiedFiles, copyNewFile] = useState({});

  const addNewFileToCopy = (id: any, name: any, isDirectory: boolean): void => {
    copyNewFile({
      ...copiedFiles,
      [id]: {
        id,
        selected: true,
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
        copiedFiles,
        removeFileFromClipboard,
        emptyClipboard,
        addNewFileToCopy
      }}
    >
      {props.children}
    </FileContext.Provider>
  );
};
