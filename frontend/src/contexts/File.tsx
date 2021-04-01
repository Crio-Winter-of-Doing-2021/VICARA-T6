import { createContext, useContext, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

type ContextProps = {
  copiedFiles?: any;
  filesCounter?: any;
  emptyClipboard?: any;
  setFilesCounter?: any;
  changeParentFolder?: any;
  selectTheCurrentFile?: any;
  removeFileFromClipboard?: any;
  parentFolderIDofSelectedFile?: any;
};

const FileContext = createContext<ContextProps>({});

export const useFileContext = () => useContext(FileContext);

export const FileContextProvider = (props: any) => {
  const [copiedFiles, copyNewFile] = useState({});
  const [parentFolderIDofSelectedFile, setParentFolderID] = useState(null);
  const [filesCounter, setFilesCounter] = useState(0);
  const history = useHistory();

  // Changes the URL Parameter ID
  const changeParentFolder = useCallback((folderID: string) => {
    history.push('/' + folderID);
  }, []);

  const selectTheCurrentFile = (
    id: string,
    name: string,
    isDirectory: boolean,
    isSelected: boolean,
    parentID: any
  ): void => {
    const newFile = {
      [id]: {
        id,
        selected: !isSelected,
        name,
        isDirectory
      }
    };

    if (parentFolderIDofSelectedFile !== null) {
      if (parentID === parentFolderIDofSelectedFile) {
        copyNewFile({
          ...copiedFiles,
          ...newFile
        });
      }
    } else {
      copyNewFile({
        ...copiedFiles,
        ...newFile
      });
    }

    if (Object.values({ ...copiedFiles, ...newFile }).length <= 1) {
      setParentFolderID(parentID);
    }
  };

  const removeFileFromClipboard = (id: any): void => {
    const tempCopiedFiles = copiedFiles;
    delete tempCopiedFiles[id];
    copyNewFile({
      ...tempCopiedFiles
    });
  };

  const emptyClipboard = () => {
    copyNewFile({});
  };

  return (
    <FileContext.Provider
      value={{
        copiedFiles,
        filesCounter,
        setFilesCounter,
        emptyClipboard,
        changeParentFolder,
        selectTheCurrentFile,
        removeFileFromClipboard,
        parentFolderIDofSelectedFile
      }}
    >
      {props.children}
    </FileContext.Provider>
  );
};
