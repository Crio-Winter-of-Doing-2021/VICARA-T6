import './App.css';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useState, useEffect } from "react";
import './index.css';
import Files from './Files2'

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
    console.log(files.length);

    for (let i = 0; i < files.length; i++) {
      // let fileNameArr = files[i].path.split("/").filter(e => e !== "")
      let formData = new FormData()
      // if (fileNameArr.length === 1) {
      //It's a file
      const { path } = files[i];
      console.log(path)

      // try {
      //   const result = await axios
      //     .post("http://localhost:3001/upload", JSON.stringify({ name, path, size }))
      //     .then((data) => {
      //       console.log(data)
      //     })

      //   console.log(result)

      // } catch (err) {
      //   console.log(err)
      // }

      formData.append(path, files[i])

      const options = {
        cancelToken: source.token,
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor(loaded * 100 / total);
          // console.log(`${loaded}kb of ${total} | ${percent}%`);
        }
      }

      try {
        const result = await axios
          .post("http://localhost:3001/upload", formData, options)
          .then((data) => {
            // console.log(data)
          })

        // console.log(result)
        await new Promise(resolve => setTimeout(resolve, 100));


      } catch (err) {
        if (axios.isCancel(err)) {
          console.log(err.message);
        }
        console.log(err.message)
      }

    }
  }

  function cancelTheRequest() {
    if (source) {
      console.log("CANCELLING REQUEST")
      source.cancel("REQUEST CANCELLED")
    }
  }

  return (
    <>
      <Files />
      {/* <Dropzone onDrop={acceptedFiles => sendMeAway(acceptedFiles)}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()} className="drop-zone">
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone> */}
      <button onClick={() => cancelTheRequest()}>CANCEL REQUEST</button>
    </>
  );
}

export default App;
