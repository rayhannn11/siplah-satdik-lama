import firebase from '@firebase/app';
import '@firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyAu4LT5yVnxihf4L5apM76Yc4q57kalcsU",
    authDomain: "chat-siplah.firebaseapp.com",
    databaseURL: "https://chat-siplah-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chat-siplah",
    storageBucket: "chat-siplah.appspot.com",
    messagingSenderId: "847474973184",
    appId: "1:847474973184:web:7293445dd4adba1cdb56e5",
    measurementId: "G-N81Y8G8V1M"
};

let fire = firebase.initializeApp(firebaseConfig)


export default fire;