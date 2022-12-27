import React, { useEffect, useState } from 'react';
import { database, storage } from '../firebase';
import { onValue, ref, remove, set } from "firebase/database";
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import CompileView from './CompileView';

import { Card, Col, Modal, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { CircularProgress, TextField } from '@mui/material';

const ImagesView = ({ userId, groupId, images, setImages }) => {

    // Display nothing if user or images have not been retrieved.
    if (userId === "" || images === []) {
        return <></>
    }

    // State of optional displays
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    // State of snippets to edit
    const [editSummaryPath, setEditSummaryPath] = useState('');
    const [imageForNewSummary, setImageForNewSummary] = useState('');
    const [textToEdit, setTextToEdit] = useState('');
    const [editSummaryText, setEditSummaryText] = useState('');

    // Return an array of all images in a group.
    const getImagesArray = async (userGroups) => {
        let imageData = new Set();
        for (let group in userGroups) {
            if (group !== groupId) {
                continue;
            }
            for (let img in userGroups[group]) {
                const summary = userGroups[group][img].summary;
                const summaryPath = `${userId}/${group}/${img}/summary`;

                const url = userGroups[group][img].imgPath;
                const path = `${userId}/${group}/${url}`;

                const imageRef = storageRef(storage, path);
                const imageUrl = await getDownloadURL(imageRef);

                imageData.add({
                    url: imageUrl,
                    text: summary,
                    path: summaryPath
                });
            }
        }
        return Array.from(imageData.values())
    }

    // Update display for images of user group when selected.
    useEffect(() => {
        const userDbRef = ref(database, userId);
        onValue(userDbRef, async (snapshot) => {
            const userGroups = snapshot.toJSON();
            setLoading(true);
            const imageData = await getImagesArray(userGroups);
            setImages(imageData);
            setLoading(false);
        });
    }, [groupId]);

    // Save new summary state.
    const changeSummary = (e) => {
        e.preventDefault();
        setEditSummaryText(e.target.value);
    }

    // Open modal for editing snippet summary.
    const handleShow = (image) => {
        setShow(true);
        setEditSummaryPath(image["path"]);
        setTextToEdit(image["text"]);
        setImageForNewSummary(image["url"]);
    }

    // Save new summary to database if updated.
    const handleClose = () => {
        if (editSummaryText !== "") {
            set(ref(database, editSummaryPath), editSummaryText);
        }
        setShow(false);
        setEditSummaryPath('');
        setTextToEdit('');
        setImageForNewSummary('');
    }

    // Delete snippet.
    const handleDelete = () => {
        const imageNodePath = editSummaryPath.replace("/summary", '');
        remove(ref(database, imageNodePath));
        setShow(false);
        setEditSummaryPath('');
        setTextToEdit('');
        setImageForNewSummary('');
    }

    // Render information for a saved snippet
    const displaySnippet = (img) => {
        return (
            <Col>
                <Card>
                    <Card.Img variant="top" src={img["url"]} />
                    <Card.Body>
                        <Card.Text>
                            {img["text"]}
                        </Card.Text>
                        <Col className="end-align">
                            <IconButton 
                                color="primary" 
                                aria-label="edit summary" 
                                component="label" 
                                onClick={() => handleShow(img)}>
                                <EditIcon />
                            </IconButton>
                        </Col>
                    </Card.Body>
                </Card>
            </Col>
        )
    }

    // Modal for editing summary
    const editModal = (
        <Modal className="notes-modal" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit summary</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <img width="100%"
                            src={imageForNewSummary}
                            alt="note-snippet" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <TextField
                            id="outlined-multiline-static"
                            label="Summary"
                            multiline
                            fullWidth
                            rows={3}
                            maxLength={300}
                            defaultValue={textToEdit}
                            onChange={changeSummary} />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Button
                                variant="outlined"
                                color="error"
                                type="submit"
                                onClick={handleDelete}>
                                Delete
                            </Button>
                        </Col>
                        <Col className="end-align">
                            <Button
                                variant="contained"
                                disableElevation
                                type="submit"
                                onClick={handleClose}>
                                Save
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    )

    return (
        <>
            <Row className="padding-above">
                <CompileView groupId={groupId} images={images} />
            </Row>
            <br />
            <Row xs={1} md={2} className="g-4">
                {loading === true &&
                    <div className="center">
                        <CircularProgress />
                    </div>}
                {images.map((img) => displaySnippet(img))}
            </Row>
            {editModal}
        </>
    )
}

export default ImagesView