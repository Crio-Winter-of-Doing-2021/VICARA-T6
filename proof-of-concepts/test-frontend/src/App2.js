import './App.css';
import Dropzone from 'react-dropzone';
import axios from 'axios';

async function sendMeAway(files) {
  //Initialize jsZip
  // let formData = new FormData()
  let formData = new FormData()

  for (let i = 0; i < files.length; i++) {
    // let fileNameArr = files[i].path.split("/").filter(e => e !== "")

    // if (fileNameArr.length === 1) {
    //It's a file


    formData.append(files[i].name, files[i])
  }

  const result = await axios
    .post("http://localhost:3001/upload", formData)
    .then((data) => {
      console.log(data)
    })

  console.log(result)

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
