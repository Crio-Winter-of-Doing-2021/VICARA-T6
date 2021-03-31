import { createContext, useContext, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

type ContextProps = {
  copiedFiles?: any;
  disableSelection?: any;
  selectTheCurrentFile?: any;
  emptyClipboard?: any;
  filesCounter?: any;
  setFilesCounter?: any;
  changeParentFolder?: any;
  removeFileFromClipboard?: any;
};

const FileContext = createContext<ContextProps>({});

export const useFileContext = () => useContext(FileContext);

export const FileContextProvider = (props: any) => {
  const [copiedFiles, copyNewFile] = useState({});
  const [disableSelection] = useState(false);
  const [parentFolderID, setParentFolderID] = useState(null);
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

    if (parentFolderID !== null) {
      if (parentID === parentFolderID) {
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
    // console.log(Object.values({ ...copiedFiles, ...newFile }));
    // if (Object.values({ copiedFiles, ...newFile }).length === 0) {
    //   setParentFolderID(parentID);
    // }

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
        filesCounter,
        setFilesCounter,
        copiedFiles,
        disableSelection,
        removeFileFromClipboard,
        emptyClipboard,
        selectTheCurrentFile,
        changeParentFolder
      }}
    >
      {props.children}
    </FileContext.Provider>
  );
};
