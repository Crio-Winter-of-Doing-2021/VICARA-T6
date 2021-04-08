import { createContext, useContext, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

type ContextProps = {
  copiedFiles?: any;
  filesCounter?: any;
  displayType?: string;
  switchDisplayType?: any;
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
  const [displayType, setDisplayType] = useState('detailed');
  const [filesCounter, setFilesCounter] = useState(0);
  const history = useHistory();

  // Changes the URL Parameter ID
  const changeParentFolder = useCallback((folderID: string) => {
    history.push('/' + folderID);
  }, []);

  const switchDisplayType = () => {
    if (displayType === 'detailed') {
      setDisplayType('list');
    } else {
      setDisplayType('detailed');
    }
  };

  const selectTheCurrentFile = (
    id: string,
    fileName: string,
    isDirectory: boolean,
    isSelected: boolean,
    parentID: any
  ): void => {
    // If ID already exists remove it from object
    if (copiedFiles[id]) {
      removeFileFromClipboard(id);
    } else {
      const newFile = {
        [id]: {
          id,
          selected: !isSelected,
          fileName,
          isDirectory
        }
      };

      // If parent folder id is not null
      if (parentFolderIDofSelectedFile !== null) {
        // If it matches allow it to be added to clipboard
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
    }
  };

  const removeFileFromClipboard = (id: any): void => {
    const tempCopiedFiles = copiedFiles;
    delete tempCopiedFiles[id];
    copyNewFile({
      ...tempCopiedFiles
    });

    // If there are no selected files set parent to null
    if (Object.values(tempCopiedFiles).length === 0) {
      setParentFolderID(null);
    }
  };

  const emptyClipboard = () => {
    copyNewFile({});
    setParentFolderID(null);
  };

  return (
    <FileContext.Provider
      value={{
        copiedFiles,
        filesCounter,
        setFilesCounter,
        displayType,
        switchDisplayType,
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
