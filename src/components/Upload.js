import React, { useState } from 'react';
import { storage, database } from '../firebase';
import { ref as storeRef, uploadBytesResumable } from "firebase/storage";
import { ref, set } from "firebase/database";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Modal } from 'react-bootstrap';

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
            <Form.Label>Upload a snippet.</Form.Label>
            <Form.Group className="mb-3 authRow">
                <Form.Control
                    id="group-tag"
                    name="group"
                    type="text"
                    required
                    placeholder="Topic label"
                    onChange={(e) => updateGroup(e)}
                />
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
            <Button variant="primary" type="submit" onClick={handleSubmit}>
                Upload
            </Button>
        </Form>
    );

    return (
        <>
            <Button variant="primary" onClick={() => handleShow()}>
                New upload
            </Button>

            <Modal className="upload-modal" show={show} onHide={handleClose}>
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