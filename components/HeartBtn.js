import { useDocument } from "react-firebase-hooks/firestore"
import { auth, firestore, increment } from "../lib/firebase"

export default function HeartBtn({postRef}){

  const heartRef = postRef.collection('hearts').doc(auth.currentUser.uid)
  // useDocument returns array of [3]
  // the first one (which i took is snapshot)
  const [ heartDoc ] = useDocument(heartRef)

  const addHeart = async () => {
    const id = auth.currentUser.uid;
    const batch = firestore.batch();

    batch.update(postRef, {heartCount: increment(1)})
    batch.set(heartRef, {id})

    await batch.commit();
  }

  const removeHeart = async () => {
    const batch = firestore.batch();

    batch.update(postRef, {heartCount: increment(-1)})
    batch.delete(heartRef)

    await batch.commit();
  }

  return heartDoc?.exists ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  )
    
  
}