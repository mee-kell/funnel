import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAZTCPhRXaO17JxTe2LuI95bHkX2WhgySM",
    authDomain: "funnel-72c2a.firebaseapp.com",
    projectId: "funnel-72c2a",
    storageBucket: "funnel-72c2a.appspot.com",
    messagingSenderId: "943565669603",
    appId: "1:943565669603:web:03df32ab31a1bea39c71d6",
    measurementId: "G-J64TRY91GL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export default app;