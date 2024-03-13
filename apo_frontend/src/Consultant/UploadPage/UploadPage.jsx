import React, { useState, useEffect } from 'react';
import NavBar from '../../NavBar/NavBar';
import Footer from '../../Footer/Footer';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import './UploadPage.css';
import axios from 'axios';

const UploadPage = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [customerFiles, setCustomerFiles] = useState([]);
    const { username, customer_id } = useParams();

    const handleFileChange = (e) => {
        const files = e.target.files;
        setUploadedFiles((prevUploadedFiles) => [...prevUploadedFiles, ...files]);
    };
    useEffect(() => {
        // Fetch the file names based on customer_id
        const fetchCustomerFiles = async () => {
            try {
                const response = await axios.post('http://localhost:3001/api/get-files', { customer_id });
                setCustomerFiles(response.data.files);
                console.log(response.data.files);
            } catch (error) {
                console.error('Error fetching customer files:', error);
                // Handle error if needed
            }
        };

        fetchCustomerFiles();
    }, [customer_id]);

    const handleUploadFiles = async () => {
        try {
            // Prepare the FormData object to send files to the backend
            const formData = new FormData();
            uploadedFiles.forEach((file) => {
                formData.append('files', file);
            });
            formData.append('Customer_id', customer_id);

            // Send the files to the backend using Axios
            const response = await axios.post('http://localhost:3001/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response);

            // Display success message
            Swal.fire({
                icon: 'success',
                title: 'Files Uploaded!',
                text: 'The selected files have been uploaded successfully.',
            });

            // Clear the uploaded files state
            setUploadedFiles([]);
        } catch (error) {
            // Display error message on failure
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to upload files. Please try again.',
            });
        }
    };

    return (
        <div>
            <NavBar />

            <div className="upload-container container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="upload-card p-4">
                            <h2 className="upload-title text-center mb-4">Upload Customer Provided Files</h2>
                            <div className="custom-dropzone p-3">
                                <label htmlFor="fileInput" className="dropzone-label">
                                    <div>Drag and drop or click here to browse Excel or .csv files</div>
                                    <input type="file" id="fileInput" multiple onChange={handleFileChange} />
                                </label>
                            </div>
                            <div className="uploaded-files mt-3">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="file-item p-2">
                                        <span className="file-name">{file.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-4">
                                {uploadedFiles.length > 0 && (
                                    <button className="btn btn-primary upload-save-button" onClick={handleUploadFiles}>
                                        Upload Files
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                <div className="container uploaded-files mt-4">
                    <h2 className="upload-title text-center mb-4">Uploaded Files</h2>
                    <div className="row row-cols-1 row-cols-md-3 g-2">
                        {customerFiles.map((name, index) => (
                            <div key={index} className="col">
                                <div className="card h-100 uploaded-card">
                                    <div className="card-body">
                                        <h5 className="card-title">{name}</h5>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default UploadPage;
