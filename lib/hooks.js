import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, firestore } from "./firebase"

export const useUserData = () => {
  const [user] = useAuthState(auth)
  const [username, setUsername] = useState(null)

  useEffect( () => {
    // let unsubscribe;

    if(user){

      const userName = user.displayName.split(/\s+/g).join('').toLowerCase();
      // console.log(userName);
      const displayName = user.displayName;
      const userID = user.uid;
      const photoURL = user.photoURL;

      const usernameDoc = firestore.doc(`usernames/${userName}`);

      // check if it's first time to join
      usernameDoc.get().then( doc => {
        if(!doc.exists){
          // Commit both docs together as a batch write.
          console.log("isn't exist!");
          const userDoc = firestore.doc(`users/${userID}`);

          // batch method to add data to firebase
          const batch = firestore.batch();
          batch.set(userDoc, { username: userName, photoURL: photoURL, displayName: displayName });
          batch.set(usernameDoc, { uid: userID });
  
          const commiting = async () => await batch.commit();
          commiting();
        }
      })

      setUsername(userName);
    }else{
      setUsername(null)
    }
    // return unsubscribe
  },[user])

  return{ user, username }
}