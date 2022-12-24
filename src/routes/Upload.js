import React, { useEffect, useState } from 'react';
import { auth, storage, database } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref as storeRef, uploadBytesResumable } from "firebase/storage";
import { ref, set } from "firebase/database";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';

function Upload() {

    /* Ensure that user is logged in. */
    const [userId, setUserId] = useState('');
    const [image, setImage] = useState("");
    const [groupId, setGroupId] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            console.log("auth changed.");
            if (user) {
                setUserId(user.uid);
            } else {
                navigate("/login");
            }
        });
    }, []);

    // TODO: Add authentication check.

    function updateGroup(event) {
        setGroupId(event.target.value);
    }

    function handleChange(event) {
        setImage(event.target.files[0]);
        console.log("set file");
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!image) {
            console.log("File does not exist!");
            return;
        };

        // Upload image to storage
        const storageRef = storeRef(storage, `${userId}/${groupId}/${image.name}`);
        uploadBytesResumable(storageRef, image);

        // Add reference to image to database
        const imageName = image.name.substr(0, image.name.lastIndexOf('.')) || image.name;
        const dbPath = `${userId}/${groupId}/${imageName}`;
        set(ref(database, dbPath), {
            imgPath: image.name,
            summary: "No summary."
        });
    }

    return (
        <div className='main'>
            <h1> Upload </h1>

            <Form>
                <Row>
                    <Form.Label>Please upload an image of a section of notes.</Form.Label>
                    <Col>
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
                    </Col>
                    <Col>
                        <Form.Group className="mb-3 authRow">
                            <Form.Control
                                id="image-upload"
                                name="image"
                                type="file"
                                required
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Button variant="primary" type="submit" onClick={handleSubmit}>
                            Upload
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default Upload