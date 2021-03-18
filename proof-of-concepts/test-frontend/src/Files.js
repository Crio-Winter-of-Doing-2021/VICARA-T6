import './index.css'
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { useEffect, useState } from 'react';

export default function FilesComponent() {
    const [source, setSource] = useState(null)
    const [folderID, setFolderID] = useState('605256109934f80db98712ea');
    const ownerID = '605256109934f80db98712ea';
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        setSource(CancelToken.source());
    }, [])

    useEffect(() => {
        async function fetchData() {
            const result = await axios.post(`http://localhost:3001/folders`, { ownerID, parentID: folderID })
            setFiles(result.data)
        }

        fetchData();
    }, [folderID])

    const changeFolder = (newID) => {
        setFolderID(newID)
    }

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

            formData.append(folderID + path, files[i])

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

    return (
        <div>
            {
                files.length ? (
                    files.map(file => {
                        return (
                            <div key={file._id}>
                                <div>{file.name}</div>
                                {file.directory && <button onClick={() => changeFolder(file._id)}>OPEN FOLDER</button>}
                            </div>
                        )
                    })
                ) : null
            }

            <Dropzone onDrop={acceptedFiles => sendMeAway(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div {...getRootProps()} className="drop-zone">
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                    </section>
                )}
            </Dropzone>
        </div>
    )
}