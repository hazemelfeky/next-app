import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyARIJg9cXA32kDfgXIyIYAqzXUS59rZgPU",
  authDomain: "next-app-2f3d6.firebaseapp.com",
  projectId: "next-app-2f3d6",
  storageBucket: "next-app-2f3d6.appspot.com",
  messagingSenderId: "1033270197351",
  appId: "1:1033270197351:web:c2527a12c32fa00cca28c2"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Auth exports
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

// Firestore exports
export const firestore = firebase.firestore();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const increment = firebase.firestore.FieldValue.increment;
export const fromMillis = firebase.firestore.Timestamp.fromMillis;


// Storage exports
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

// takes:   the username => from the query
// returns: user data
export async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users');
  const query = usersRef.where('username', '==', username).limit(1);
  const userDoc = (await query.get()).docs[0]; ///////////take care of this exprition
  return userDoc;
}

export async function getUsernameWithID(id) {
  const usersRef = firestore.collection('users').doc(id);
  const userDoc = (await usersRef.get()) ; 
  return userDoc;
}

//Converts a firestore document to JSON
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}