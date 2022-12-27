import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import Upload from '../components/Upload';
import SelectView from '../components/SelectView';
import ImagesView from '../components/ImagesView';

import CircularProgress from '@mui/material/CircularProgress';
import { Col, Row } from 'react-bootstrap';

function Display() {

    const [userId, setUserId] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    // Group ID is cached and should be restored upon reload.
    const [groupId, setGroupId] = useState(() => {
        const saved = localStorage.getItem("groupId");
        return saved || "";
    });

    // Authenticate user upon loading.
    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                setUserId(user.uid);
                setLoading(false);
            } else {
                const navigate = useNavigate();
                navigate("/login");
            }
        });
    }, []);

    // Preserve the selected group ID during refresh.
    useEffect(() => {
        localStorage.setItem("groupId", groupId);
    }, [groupId]);

    const updateGroupId = (id) => {
        setGroupId(id);
    }

    return (
        <div className='main'>
            <Row>
                <Col><h1>funnel</h1></Col>
                <Col className="end-align"><Upload userId={userId} /></Col>
            </Row>

            {loading === true &&
                <div className="center">
                <CircularProgress />
                </div>}

            {loading === false &&
                <>
                    <SelectView 
                        userId={userId} 
                        groupId={groupId} 
                        updateGroupId={updateGroupId} 
                        setImages={setImages} />
                    <ImagesView 
                        userId={userId} 
                        groupId={groupId} 
                        images={images} 
                        setImages={setImages}/>
                </>
            }
        </div>
    )
}

export default Display