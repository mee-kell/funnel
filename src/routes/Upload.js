import React, { useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref as storeRef, getDownloadURL, uploadBytesResumable, getStorage } from "firebase/storage";
import { ref, set, onValue, getDatabase } from "firebase/database";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';

const Upload = () => {

    /* Ensure that user is logged in. */
    const [userId, setUserId] = useState('');

    const navigate = useNavigate();

    onAuthStateChanged(auth, user => {
        if (user) {
            setUserId(user.uid);
        } else {
            navigate("/login");
        }
    });

    // TODO: Add authentication check.
    
    const database = getDatabase();
    const storage = getStorage();

    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        const storageRef = storeRef(storage, `files/${file.name}`);
        const uploadImage = uploadBytesResumable(storageRef, file);

        uploadImage.on("state_changed",
            (snapshot) => {
                const progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgresspercent(progress);
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
                    setImgUrl(downloadURL)
                });
            }
        );
    }

    const [groupId, setGroupId] = useState('');
    const [images] = useState([]);

    const saveImage = (imageUrl) => {
        set(ref(database, 'group/' + userId + groupId + '/image/' + imageUrl), {
            summary: ""
        });
    }

    const groupUploadsRef = ref(database, 'group/' + userId + groupId + "/image");
    onValue(groupUploadsRef, (snapshot) => {
        snapshot.forEach((imgNode) => {
            images.push(imgNode.key);
        });                                            
    });

    return (
        <div className='main'>
            <h1> Upload </h1>

            <Form>
                <Row>
                    <Form.Label>Please upload an image of a section of notes.</Form.Label>
                    <Col>
                        <Form.Group className="mb-3 authRow" controlId="formGroup">
                            <Form.Control
                                id="group-tag"
                                name="group"
                                type="text"
                                required
                                placeholder="Topic label"
                                onChange={(e) => setGroupId(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3 authRow" controlId="formUpload">
                            <Form.Control
                                id="image-upload"
                                name="image"
                                type="file"
                                required
                                onSubmit={handleSubmit}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Button variant="primary" type="submit" onClick={saveImage}>
                            Upload
                        </Button>
                    </Col>
                </Row>
            </Form>

            {
                !imgUrl &&
                <div className='outerbar'>
                    <div className='innerbar'
                        style={{ width: `${progresspercent}%` }}>
                        {progresspercent}%
                    </div>
                </div>
            }
            {
                imgUrl &&
                <img src={imgUrl} alt='uploaded file' height={200} />
            }
            <ul>
                {images.map(url => (
                <img src={url} alt='uploaded file' height={200} />
                ))}
            </ul>
        </div>
    )
}

export default Upload