import React, { useEffect, useState } from 'react';
import { database, storage } from '../firebase';
import { onValue, ref, set } from "firebase/database";
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

const ImagesView = ({ userId, groupId }) => {

    if (userId === "") {
        return <p> Loading... </p>
    }

    const [images, setImages] = useState([]);
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

    return (
        <>
            <Row xs={1} md={2} className="g-4">
                {images.map((img) => (
                    <Col>
                        <Card>
                            <Card.Img variant="top" src={img["url"]} />
                            <Card.Body>
                                <Card.Text>
                                    {img["text"]}
                                </Card.Text>
                                <Button variant="primary" onClick={() => handleShow(img)}>
                                    Edit summary
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit summary</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <img width="100%" src={imageForNewSummary} alt="note-snippet" />
                            <Form.Control as="textarea" rows={3} onChange={changeSummary}>
                                {textToEdit}
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={handleClose}>
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ImagesView