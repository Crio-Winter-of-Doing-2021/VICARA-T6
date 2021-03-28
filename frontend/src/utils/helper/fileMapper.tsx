export default function fileMapper(directory: boolean) {
  if (directory) {
    return require('../../assets/FileIcons/folder.png').default;
  } else {
    return require('../../assets/FileIcons/file.png').default;
  }
}
