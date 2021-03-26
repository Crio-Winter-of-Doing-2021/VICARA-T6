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

        let pathHashMap = {}

        console.log(files);

        for (let i = 0; i < files.length; i++) {
            // console.log({ pathHashMap })
            // let fileNameArr = files[i].path.split("/").filter(e => e !== "")
            let formData = new FormData()
            // if (fileNameArr.length === 1) {
            //It's a file
            let path = files[i].path.split("/").filter(e => e !== "").join("/");

            console.log({ path });
            let path_split_arr = path.split("/").filter(e => e !== "")
            path_split_arr.pop();

            console.log(path_split_arr)

            let absolute_path_of_folder = path_split_arr.join("/");

            for (let j = path_split_arr.length - 1; j >= 0; j--) {
                let tempPath = path_split_arr.slice(0, j + 1).join("/")
                console.log({ tempPath });
                let relative_path_of_folder = pathHashMap[tempPath];

                if (relative_path_of_folder !== undefined) {
                    console.log("FOLDER FOUND");
                    let leftOutPath = path_split_arr.slice(j + 1, path_split_arr.length).join("/");
                    path = relative_path_of_folder + "/" + (leftOutPath !== "" ? (leftOutPath + "/") : "") + files[i].name
                    console.log({ path, relative_path_of_folder, leftOutPath })
                    break;
                }
            }

            let json_obj = {
                pathHashMap,
                absolute_path_of_folder,
                path,
            }

            console.log(json_obj);

            formData.append(JSON.stringify(json_obj), files[i])

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

                let temp = data.path;
                pathHashMap = { ...pathHashMap, ...temp }

                await new Promise(resolve => setTimeout(resolve, 50));
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log(err.message);
                }
                console.log(err.message)
            }
        }

        console.log(pathHashMap);
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