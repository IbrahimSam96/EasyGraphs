import firebaseClient from "firebase/app";
import "firebase/firebase-auth";
import "firebase/firebase-firestore";

var firebaseConfig = {
  apiKey: "AIzaSyDY5tvRBx5MqMXXg1dmCAyF3u2fVwWaUys",
  authDomain: "graphx1.firebaseapp.com",
  projectId: "graphx1",
  storageBucket: "graphx1.appspot.com",
  messagingSenderId: "730329420726",
  appId: "1:730329420726:web:4ffe808bc4c9d35118a717",
  measurementId: "G-JQ7NRVTW4G"
};
// Initialize Firebase
if (typeof window !== 'undefined' && !firebaseClient.apps.length) {
  firebaseClient.initializeApp(firebaseConfig);
  firebaseClient.auth().setPersistence(firebaseClient.auth.Auth.Persistence.SESSION);
  firebaseClient.firestore();

}




export { firebaseClient };