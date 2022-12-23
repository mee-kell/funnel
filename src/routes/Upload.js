import React, { useEffect, useState } from 'react';
import { auth, storage, database } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getDownloadURL, ref as storeRef, uploadBytesResumable, listAll } from "firebase/storage";
import { DataSnapshot, onValue, ref, set } from "firebase/database";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import { useDatabaseSnapshot } from '@react-query-firebase/database';

function Upload() {

    /* Ensure that user is logged in. */
    const [userId, setUserId] = useState('');

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

    const [image, setImage] = useState("");
    const [groupPath, setGroupPath] = useState("");
    const [groupId, setGroupId] = useState('');

    function updateGroup(event) {
        setGroupId(event.target.value);
        setGroupPath(`${userId}${groupId}`);
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

        const imageName = image.name.substr(0, image.name.lastIndexOf('.')) || image.name;
        const dbPath = `${userId}${groupId}/${imageName}`;

        // Upload image to storage
        const storageRef = storeRef(storage, dbPath);
        uploadBytesResumable(storageRef, image);

        // Add reference to image to database
        set(ref(database, dbPath), {
            imgPath: image.name,
            summary: ""
        });
    }

    // Read uploaded image urls from database
    // const images = new Set();
    // const [imgUrls, setImgUrls] = useState([]);

    // useEffect(() => {
    //     const groupRef = ref(database, `${userId}${groupId}/`);
    //     onValue(groupRef, (snapshot) => {
    //         snapshot.forEach((child) => {
    //             images.add(child.val());
    //         })
    //         console.log(images);
    //         setImgUrls(images.values());
    //         console.log(imgUrls);
    //     });
    // }, []);

    function displayImages() {
        if (groupPath === "") {
            return;
        }

        let images = [];

        console.log(groupPath);
        // const groupRef = ref(database, `${userId}${groupId}`);
        const groupRef = ref(database, groupPath);
        const imgSnapshot = useDatabaseSnapshot([groupPath], groupRef);
        const snapshot = imgSnapshot.data;

        // Iterate the values in order and add an element to the array
        snapshot.forEach((childSnapshot) => {
            images.push(
                <img src={childSnapshot.val().imgPath} alt='img' height={200} />
            );
        });  
        
        return images;
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

            {displayImages()}
        </div>
    )
}

export default Upload