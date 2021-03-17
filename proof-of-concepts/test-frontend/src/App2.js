import './App.css';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useState, useEffect } from "react";

function App() {

  const [source, setSource] = useState(null)

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    setSource(CancelToken.source());
  }, [])

  useEffect(() => {
    console.log("SOURCE", source);
  }, [source])

  async function sendMeAway(files) {
    //Initialize jsZip
    // let formData = new FormData()

    for (let i = 0; i < files.length; i++) {
      // let fileNameArr = files[i].path.split("/").filter(e => e !== "")
      let formData = new FormData()

      // if (fileNameArr.length === 1) {
      //It's a file

      formData.append(files[i].name, files[i])

      const options = {
        cancelToken: source.token,
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor(loaded * 100 / total);
          console.log(`${loaded}kb of ${total} | ${percent}%`);
        }
      }

      try {

        const result = await axios
          .post("http://localhost:3001/upload", formData, options)
          .then((data) => {
            console.log(data)
          })

        console.log(result)

      } catch (err) {
        if (axios.isCancel(err)) {
          console.log(err.message);
        }
        console.log(err.message)
      }

    }
  }

  function cancelMeSenpai() {
    if (source) {
      console.log("CANCELLING REQUEST")
      source.cancel("REQUEST CANCELLED")
    }
  }

  return (
    <>
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
      <button onClick={() => cancelMeSenpai()}>CANCEL REQUEST</button>
    </>
  );
}

export default App;
