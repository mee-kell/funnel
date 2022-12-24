import React, { useEffect, useState } from 'react';
import { auth, database, storage } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { onValue, ref } from "firebase/database";

import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';

function Display() {

    let userId = "";
    const [images, setImages] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                userId = user.uid;
                getImagePaths();
                console.log(images);
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
                    const path = `${userId}/${group}/${url}`;
                    console.log(path);
                    const imageRef = storageRef(storage, path);
                    const imageUrl = await getDownloadURL(imageRef);
                    console.log(imageUrl);
                    imageData.add(imageUrl);
                }
            }
            setImages(Array.from(imageData.values()));
        });
    }

    return (
        <div className='main'>
            <h1> Notes </h1>
            {images.map((url) => (
                <img src={url} alt={url}/>
            ))}
        </div>
    )
}

export default Display