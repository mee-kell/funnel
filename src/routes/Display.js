import React, { useEffect, useState } from 'react';
import { auth, storage, database } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getDownloadURL, ref as storeRef, uploadBytesResumable, listAll } from "firebase/storage";
import { DataSnapshot, onValue, ref, set } from "firebase/database";

import { useNavigate } from 'react-router-dom';
import { useDatabaseSnapshot } from '@react-query-firebase/database';

function Display() {

    /* Ensure that user is logged in. */
    let userId = "";
    // const [userId, setUserId] = useState('');
    const [images, setImages] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                userId = user.uid;
                getDisplay();
                console.log(images);
            } else {
                navigate("/login");
            }
        })
    }, []);

    function getDisplay() {
        const groupRef = ref(database, userId);
        onValue(groupRef, (snapshot) => {
            const userGroups = snapshot.toJSON();
            let imageData = new Set();

            console.log(userGroups);
            for (let group in userGroups) {
                console.log(userGroups[group]);
                for (let img in userGroups[group]) {
                    console.log(userGroups[group][img]);
                    imageData.add(userGroups[group][img].imgPath);
                }
            }
            console.log(imageData);
            setImages(imageData.values());
        });
    }
    

    // function displayImages(groupPath) {
    //     if (groupPath === "") {
    //         console.log("Group path invalid.");
    //         return;
    //     }

    //     console.log(groupPath);
    //     const groupRef = ref(database, groupPath);
    //     const imgSnapshot = useDatabaseSnapshot([groupPath], groupRef, {
    //         subscribe: true,
    //     });
    //     const snapshot = imgSnapshot.data;

    //     // Iterate the values in order and add an element to the array
    //     let data = [];
    //     console.log(imgSnapshot)
    //     imgSnapshot.forEach((childSnapshot) => {
    //         data.push(
    //             <img src={childSnapshot.val().imgPath} alt='img' height={200} />
    //         );
    //     });

    //     setImages(data);
    // }

    return (
        <div className='main'>
            <h1> Notes </h1>
            {images}
        </div>
    )
}

export default Display