import { useContext, useState } from "react";
import AdminAuth from "../../components/AdminAuth";
import { UserContext } from "../../lib/context";
import { firestore, serverTimestamp } from "../../lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import PostFeed from "../../components/PostFeed";
import { useRouter } from "next/router";
import kebabCase from 'lodash.kebabcase';
import styles from '../../styles/Admin.module.css';
import toast, { Toaster } from 'react-hot-toast';

export default function Admin(){
  return (
    <main>
      <AdminAuth>
        <Toaster/>
        <PostList />
        <CreateNewPost />
      </AdminAuth>
    </main>
  )
}

const PostList = () => {
  const {user} = useContext(UserContext)
  const ref = firestore.collection('users').doc(user.uid).collection('posts');
  const query = ref.orderBy('createdAt');
  const [ querySnapshot ] = useCollection(query);

  console.log(querySnapshot);
  const posts = querySnapshot?.docs.map( doc => doc.data())
  return(
    <>
      <h2>Posts</h2>
      <PostFeed posts={posts} admin />
    </>
  )

}

const CreateNewPost = () => {
  const route = useRouter()
  const [title, setTitle] = useState("");
  const {user, username} = useContext(UserContext);

  // works with url
  const slug = encodeURI(kebabCase(title))

  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) =>{
    e.preventDefault();
    const {uid} = user;

    const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug);

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await ref.set(data);

    // console.log("done");

    toast.success('Post created!');

    // Imperative navigation after doc is set
    route.push(`/admin/${slug}`);

  }

  return(
    <form onSubmit={createPost}>
      <input 
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p><strong>Slug: </strong> {slug}</p>
      
      <button type="submit" disabled={!isValid} className="btn-green">
        Create Post
      </button>
    </form>
  )

}