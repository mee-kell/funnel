import React, { useState } from 'react';
import { storage, database } from '../firebase';
import { ref as storeRef, uploadBytesResumable } from "firebase/storage";
import { ref, set } from "firebase/database";

import Button from '@mui/material/Button';
import Form from 'react-bootstrap/Form';
import { Modal } from 'react-bootstrap';
import { TextField } from '@mui/material';

const Upload = ({ userId }) => {

    if (userId === "") {
        return <></>
    }

    const [show, setShow] = useState(false);
    const [uploadImage, setUploadImage] = useState("");
    const [uploadGroupId, setUploadGroupId] = useState('');

    function updateGroup(event) {
        setUploadGroupId(event.target.value);
    }

    function handleShow() {
        setShow(true);
    }

    function handleClose() {
        setShow(false);
    }

    function handleChange(event) {
        setUploadImage(event.target.files[0]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!uploadImage) {
            console.log("File does not exist!");
            return;
        };

        // Upload image to storage
        const storageRef = storeRef(storage, `${userId}/${uploadGroupId}/${uploadImage.name}`);
        uploadBytesResumable(storageRef, uploadImage);

        // Add reference to image to database
        const imageName = uploadImage.name.replace(/\./g, '');
        const dbPath = `${userId}/${uploadGroupId}/${imageName}`;
        set(ref(database, dbPath), {
            imgPath: uploadImage.name,
            summary: "No summary."
        });

        handleClose();
    }

    const uploadForm = (
        <Form>
            <Form.Group className="mb-3 authRow">
                <TextField 
                    id="group-id" 
                    label="Topic label" 
                    variant="outlined" 
                    type="text"
                    required
                    fullWidth
                    onChange={(e) => updateGroup(e)} />
            </Form.Group>
            <Form.Group className="mb-3 authRow">
                <Form.Control
                    id="image-upload"
                    name="image"
                    type="file"
                    required
                    onChange={handleChange}
                />
            </Form.Group>
            <div className="end-align">
            <Button variant="contained" type="submit" onClick={handleSubmit}>
                Upload
            </Button>
            </div>
        </Form>
    );

    return (
        <>
            <Button variant="outlined" onClick={() => handleShow()}>
                New upload
            </Button>

            <Modal className="notes-modal" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {uploadForm}
                </Modal.Body>
            </Modal>

        </>
    )
}

export default Upload