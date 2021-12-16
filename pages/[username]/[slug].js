import Link from "next/link";
import PostContent from "../../components/PostContent";
import HeartBtn from "../../components/HeartBtn";
import AdminAuth from "../../components/AdminAuth";
import styles from '../../styles/Post.module.css';
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import {useDocumentData} from "react-firebase-hooks/firestore"
import { useContext } from "react";
import { UserContext } from "../../lib/context";


export async function getStaticProps({ params }){
  const {username, slug} = params;
  const userDoc = await getUserWithUsername(username);
  // console.log(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug);
    post = postToJSON(await postRef.get());

    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 100,
  };
}

export async function getStaticPaths() {
  // Improve my using Admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup('posts').get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking',
  };
}

export default function Post({path , post : PropsPost}){
  const postRef = firestore.doc(path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || PropsPost;

  const { user: currentUser } = useContext(UserContext);

  return (
    <main className={styles.container}>
      
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AdminAuth
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartBtn postRef={postRef} />
        </AdminAuth>

        {currentUser?.uid === post.uid && (
          <Link href={`/admin/${post.slug}`}>
            <button className="btn-blue">Edit Post</button>
          </Link>
        )}
      </aside>
    </main>
  );
}