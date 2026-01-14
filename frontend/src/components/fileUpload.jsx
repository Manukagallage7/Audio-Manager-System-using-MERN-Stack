import { useState } from "react";
import {mediaUpload} from "../utils/mediaUpload.jsx";

export default function FileUpload() {

    const [file, setFile] = useState(null)

    function uploadFile() {
        console.log(file)
        mediaUpload(file)
        .then((url) => {
            console.log("File uploaded successfully. Public URL:", url);
        })
        .catch((err) => {
            console.error("Error uploading file:", err);
        });
    }

    return (
        <div className="w-full flex flex-col justify-center items-center h-screen">
            <h2>File Upload Component</h2>
            <input type="file" multiple onChange={(e)=>{setFile(e.target.files[0])}} className="mt-4" />
            <button onClick={uploadFile} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Upload</button>

        </div>
    );
}