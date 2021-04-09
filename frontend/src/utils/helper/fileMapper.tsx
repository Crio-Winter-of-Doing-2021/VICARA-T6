const fileExtensionsMapper = [
  'exe',
  'css',
  'csv',
  'doc',
  'html',
  'json',
  'ppt',
  'png',
  'svg',
  'pdf',
  'mp3',
  'mp4',
  'pdf',
  'jpeg',
  'jpg',
  'txt',
  'zip',
  'xml',
  'xls',
  'js'
];

export default function fileMapper(
  extension: string | undefined,
  isDirectory: boolean
) {
  if (isDirectory) {
    return require('../../assets/FileIcons/folder.png').default;
  } else {
    for (let i = 0; i < fileExtensionsMapper.length; i++) {
      if (extension?.toLocaleLowerCase()?.includes(fileExtensionsMapper[i])) {
        return require(`../../assets/FileIcons/${fileExtensionsMapper[i]}.png`)
          .default;
      }
    }

    return require('../../assets/FileIcons/file.png').default;
  }
}
