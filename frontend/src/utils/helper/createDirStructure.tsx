interface filesAPIProps {
    lastModified: Date,
    name: string,
    path: string,
    size: number,
    type: string
}

export default function createDirStructure(folders: filesAPIProps[]) {
  const folderStructureArr:Array<string> = [];

  for (let i = 0; i < folders.length; i++) {
    const filePathArr = folders[i].path.split('/');
    filePathArr.pop();
    const filePathString = filePathArr.filter(filePath => filePath.length).join('/');
    folderStructureArr.push(filePathString)
  }

  console.log({ folderStructureArr });

  return folderStructureArr;
}
