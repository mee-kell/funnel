import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import Upload from '../components/Upload';
import SelectView from '../components/SelectView';
import ImagesView from '../components/ImagesView';
import { Col, Row } from 'react-bootstrap';

function Display() {

    const [userId, setUserId] = useState("");
    const [groupId, setGroupId] = useState(() => {
        // getting stored value
        const saved = localStorage.getItem("groupId");
        return saved || "";
    });

    const navigate = useNavigate();
    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                setUserId(user.uid);
                console.log(userId);
            } else {
                navigate("/login");
            }
        });
    }, []);

    /* Save the selected group upon refresh. */
    useEffect(() => {
        localStorage.setItem("groupId", groupId);
    }, [groupId]);

    const updateGroupId = (id) => {
        setGroupId(id);
    }

    return (
        <div className='main'>
            <Row>
                <Col><h1>Notes</h1></Col>
                <Col className="end-align"><Upload userId={userId} /></Col>
            </Row>
            
            <SelectView userId={userId} updateGroupId={updateGroupId} />
            <br />
            <ImagesView userId={userId} groupId={groupId} />
        </div>
    )
}

export default Display