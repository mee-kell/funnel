import React, { useEffect, useState } from 'react';
import { database, storage } from '../firebase';
import { onValue, ref, remove, set } from "firebase/database";
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { Card, Col, Modal, Row } from 'react-bootstrap';

import Form from 'react-bootstrap/Form';
import CompileView from './CompileView';

import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { CircularProgress, TextField } from '@mui/material';

const ImagesView = ({ userId, groupId, images, setImages }) => {

    if (userId === "" || images === []) {
        return <></>
    }

    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const [editSummaryPath, setEditSummaryPath] = useState('');
    const [imageForNewSummary, setImageForNewSummary] = useState('');
    const [textToEdit, setTextToEdit] = useState('');
    const [editSummaryText, setEditSummaryText] = useState('');

    useEffect(() => {

        const userDbRef = ref(database, userId);
        /* Get all images for selected user group. */
        onValue(userDbRef, async (snapshot) => {
            let imageData = new Set();
            const userGroups = snapshot.toJSON();
            setLoading(true);
            for (let group in userGroups) {
                if (group !== groupId) {
                    continue;
                }
                for (let img in userGroups[group]) {
                    const url = userGroups[group][img].imgPath;
                    const summary = userGroups[group][img].summary;
                    const summaryPath = `${userId}/${group}/${img}/summary`;
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

            setImages(Array.from(imageData.values()));
            setLoading(false);
        });

    }, [groupId]);

    const changeSummary = (e) => {
        e.preventDefault();
        setEditSummaryText(e.target.value);
    }

    const handleShow = (image) => {
        setShow(true);
        setEditSummaryPath(image["path"]);
        setTextToEdit(image["text"]);
        setImageForNewSummary(image["url"]);
    }

    const handleClose = () => {
        // Update new summary to database.
        if (editSummaryText !== "") {
            set(ref(database, editSummaryPath), editSummaryText);
        }

        setShow(false);
        setEditSummaryPath('');
        setTextToEdit('');
        setImageForNewSummary('');
    }

    const handleDelete = () => {
        const imageNodePath = editSummaryPath.replace("/summary", '');
        remove(ref(database, imageNodePath));

        setShow(false);
        setEditSummaryPath('');
        setTextToEdit('');
        setImageForNewSummary('');
    }

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

                {images.map((img) => (
                    <Col>
                        <Card>
                            <Card.Img variant="top" src={img["url"]} />
                            <Card.Body>
                                <Card.Text>
                                    {img["text"]}
                                </Card.Text>
                                <Col className="end-align">
                                <IconButton color="primary" aria-label="edit summary" component="label" onClick={() => handleShow(img)}>
                                    <EditIcon />
                                </IconButton>
                                </Col>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal className="notes-modal" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit summary</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <img width="100%" src={imageForNewSummary} alt="note-snippet" />
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
                                onChange={changeSummary}/>
                        </Form.Group>

                        <Row>
                            <Col>
                                <Button variant="outlined" color="error" type="submit" onClick={handleDelete}>
                                    Delete
                                </Button>
                            </Col>
                            <Col className="end-align">
                                <Button variant="contained" disableElevation type="submit" onClick={handleClose}>
                                    Save
                                </Button>
                            </Col>
                        </Row>

                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ImagesView