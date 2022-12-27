import React, { useEffect, useState } from 'react';
import { database } from '../firebase';
import { onValue, ref } from "firebase/database";

import Form from 'react-bootstrap/Form';

const SelectView = ({ userId, updateGroupId, setImages }) => {

    if (userId === "") {
        return <></>
    }

    /* Fetch a list of all user groups on loading. */
    const [groups, setGroups] = useState([]);
    useEffect(() => {
        let groupsList = new Set();
        const userDbRef = ref(database, userId);
        onValue(userDbRef, (snapshot) => {
            const userGroups = snapshot.toJSON();
            for (let group in userGroups) {
                groupsList.add(group);
            }
            setGroups(Array.from(groupsList.values()));
        });
    }, []);

    const updateGroup = (e) => {
        setImages([]);
        updateGroupId(e.target.value);
    }

    function renderOption(name) {
        const saved = localStorage.getItem("groupId");
        if (name === saved) {
            return <option selected value={name}>{name}</option>
        }
        return <option value={name}>{name}</option>
    }

    return (
        <Form>
            <Form.Select aria-label="group-tag" onChange={updateGroup}>
                <option>Select group</option>
                {groups.map(name => renderOption(name))}
            </Form.Select>
        </Form>
    )
}

export default SelectView