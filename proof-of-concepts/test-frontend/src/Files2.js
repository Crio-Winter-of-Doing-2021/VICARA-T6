import "./index.css";
import axios from "axios";
import Dropzone from "react-dropzone";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";

export default function FilesComponent() {
    const [source, setSource] = useState(null);
    const [folderID, setFolderID] = useState("605256109934f80db98712ea");
    // const [pathHashMap, setPathHashMap] = useState(null)
    const ownerID = "605256109934f80db98712ea";
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        setSource(CancelToken.source());
    }, []);

    useEffect(() => {
        async function fetchData() {
            const result = await axios.post(`http://localhost:3001/folders`, {
                ownerID,
                parentID: folderID,
            });
            setFiles(result.data);
        }

        fetchData();
    }, [folderID]);

    const changeFolder = (newID) => {
        setFolderID(newID);
    };

    async function postFolders(folders) {
        let directoryStructure = {};
        let formData = new FormData();
        formData.append(folders, JSON.stringify(folders));

        try {
            const { data } = await axios.post(
                "http://localhost:3001/create_directory",
                formData
            );
            directoryStructure = data.result;

            await new Promise((resolve) => setTimeout(resolve, 50));
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log(err.message);
            }
            console.log(err.message);
        }

        for (let i = 0; i < folders.length; i++) {
            let file_path_arr = folders[i].path.split("/");
            file_path_arr.pop();
            let file_path = file_path_arr.join("/");
            const parent_id = directoryStructure[file_path];
            const parent = parent_id;

            formData.append(parent, folders[i]);
        }

        const options = {
            cancelToken: source.token,
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                let percent = Math.floor((loaded * 100) / total);
                console.log(`${loaded}kb of ${total} | ${percent}%`);
            },
        };

        try {
            const { data } = await axios.post(
                "http://localhost:3001/upload",
                formData,
                options
            );

            console.log(data);

            await new Promise((resolve) => setTimeout(resolve, 50));
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log(err.message);
            }
            console.log(err.message);
        }
    }

    async function postFiles(files) {
        let formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            const parent_id = folderID;
            const parent = parent_id;

            formData.append(parent, files[i]);
        }

        const options = {
            cancelToken: source.token,
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                let percent = Math.floor((loaded * 100) / total);
                console.log(`${loaded}kb of ${total} | ${percent}%`);
            },
        };

        try {
            const { data } = await axios.post(
                "http://localhost:3001/upload",
                formData,
                options
            );

            console.log(data);

            await new Promise((resolve) => setTimeout(resolve, 50));
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log(err.message);
            }
            console.log(err.message);
        }
    }

    async function sendTheFiles(files) {
        //Initialize jsZip

        console.log(files);

        const listOfFolders = files.filter((e) => e.path !== e.name);
        const listOfFiles = files.filter((e) => e.path === e.name);

        if (listOfFolders.length) {
            console.log("FOLDERS FOUND : ", listOfFolders.length);
            await postFolders(listOfFolders);
            console.log("FOLDERS SENT");
        }

        if (listOfFiles.length) {
            console.log("FILES FOUND : ", listOfFiles.length);
            await postFiles(listOfFiles);
            console.log("FILES SENT");
        }
    }

    async function downloadFolder() {
        axios
            .get("http://localhost:3001/download_directory", {
                responseType: "blob",
            })
            .then((response) => new Blob([response.data]))
            .then((blob) => saveAs(blob, "file.zip"));
    }

    async function downloadFile() {
        axios
            .get("http://localhost:3001/download_file", { responseType: "blob" })
            .then(
                (response) => new Blob([response.data], { type: "application/png" })
            )
            .then((blob) => saveAs(blob, "file1.png"));
    }

    return (
        <div>
            {files.length
                ? files.map((file) => {
                    return (
                        <div key={file._id}>
                            <div>{file.name}</div>
                            {file.directory && (
                                <button onClick={() => changeFolder(file._id)}>
                                    OPEN FOLDER
                                </button>
                            )}
                        </div>
                    );
                })
                : null}

            <button onClick={() => downloadFolder()}>Download Folder</button>
            <button onClick={() => downloadFile()}>Download File</button>

            <Dropzone onDrop={(acceptedFiles) => sendTheFiles(acceptedFiles)}>
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
    );
}
