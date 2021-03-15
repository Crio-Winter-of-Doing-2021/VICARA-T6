import './App.css';
import jszip from 'jszip';
import Dropzone from 'react-dropzone';
import axios from 'axios';

async function sendMeAway(files) {
  //Initialize jsZip
  // console.log(files);
  let zip = new jszip();
  console.log(files);
  let formData = new FormData()

  for (let i = 0; i < files.length; i++) {
    let fileNameArr = files[i].path.split("/").filter(e => e !== "")

    if (fileNameArr.length === 1) {
      //It's a file

    }
    else {
      //It's a folder
      console.log(fileNameArr);
      //Remove last element if it's a file
      if (fileNameArr[fileNameArr.length - 1].includes(".")) {
        fileNameArr.pop();
      }

      //Get the final strings of folders
      let stringOfFolderNames = fileNameArr.join("/");

      //Create the folders
      let foldername = zip.folder(stringOfFolderNames);

      //Add the file to the specific fodlers
      foldername.file(files[i].name, files[i]);
    }
  }

  await zip.generateAsync({
    type: 'blob'
  }).then(async content => {
    await formData.append("blob", content)

    axios
      .post("http://localhost:3001/upload", formData)
      .then((data) => {
        console.log(data)
      })
  });
}

function App() {

  return (
    <Dropzone onDrop={acceptedFiles => sendMeAway(acceptedFiles)}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        </section>
      )}
    </Dropzone>
  );
}

export default App;
