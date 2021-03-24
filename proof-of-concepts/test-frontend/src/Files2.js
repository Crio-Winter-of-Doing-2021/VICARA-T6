import './index.css'
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { useEffect, useState } from 'react';

export default function FilesComponent() {
    const [source, setSource] = useState(null)
    const [folderID, setFolderID] = useState('605256109934f80db98712ea');
    // const [pathHashMap, setPathHashMap] = useState(null)
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

    async function sendTheFiles(files) {
        //Initialize jsZip
        let directoryStructure = {}

        // console.log(files);

        let formData = new FormData()
        formData.append(files, JSON.stringify(files))

        try {
            const { data } = await axios.post("http://localhost:3001/create_directory", formData)
            directoryStructure = data.result;

            await new Promise(resolve => setTimeout(resolve, 50));
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log(err.message);
            }
            console.log(err.message)
        }

        for (let i = 0; i < files.length; i++) {
            let file_path_arr = files[i].path.split("/")
            file_path_arr.pop()
            let file_path = file_path_arr.join("/")
            const parent_id = directoryStructure[file_path]
            const parent = parent_id;

            formData.append(parent, files[i])
        }

        const options = {
            cancelToken: source.token,
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                let percent = Math.floor(loaded * 100 / total);
                // console.log(`${loaded}kb of ${total} | ${percent}%`);
            }
        }

        try {
            const { data } = await axios.post("http://localhost:3001/upload", formData, options)

            console.log(data);

            await new Promise(resolve => setTimeout(resolve, 50));
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log(err.message);
            }
            console.log(err.message)
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

            <Dropzone onDrop={acceptedFiles => sendTheFiles(acceptedFiles)}>
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