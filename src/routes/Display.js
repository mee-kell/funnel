import React, { useEffect, useState } from 'react';
import { auth, database, storage } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { onValue, ref, set } from "firebase/database";

import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

function Display() {

    const [loading, setLoading] = useState(true);

    let userId = "";
    const [images, setImages] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, async user => {
            if (user) {
                userId = user.uid;
                await getImagePaths();
                setLoading(false);
            } else {
                navigate("/login");
            }
        })
    }, []);

    async function getImagePaths() {
        const groupRef = ref(database, userId);
        onValue(groupRef, async (snapshot) => {
            const userGroups = snapshot.toJSON();
            let imageData = new Set();

            for (let group in userGroups) {
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
    }

    const [show, setShow] = useState(false);
    const [editSummaryPath, setEditSummaryPath] = useState('');
    const [textToEdit, setTextToEdit] = useState('');
    const [editSummaryText, setEditSummaryText] = useState('');

    const changeSummary = (e) => {
        e.preventDefault();
        setEditSummaryText(e.target.value);
    }

    const handleClose = (e) => {
        e.preventDefault();

        // Update new summary to database.
        set(ref(database, editSummaryPath), editSummaryText);

        setShow(false);
        setEditSummaryPath('');
    }

    const handleShow = (image) => {
        setShow(true);
        setEditSummaryPath(image["path"]);
        setTextToEdit(image["text"]);
    }

    if (loading) {
        return (<div className='main'><p>Loading</p></div>)
    }

    return (
        <div className='main'>
            <h1> Notes </h1>
            <Row xs={1} md={3} className="g-4">
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
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>New summary</Form.Label>
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
        </div>
    )
}

export default Display