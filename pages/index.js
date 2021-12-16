import Loader from '../components/Loader'
import { fromMillis, firestore, postToJSON } from '../lib/firebase'
import PostFeed from '../components/PostFeed'
import { useState } from 'react';

const LIMIT = 1;

export async function getServerSideProps(context){
  const postsQuery = firestore
    .collectionGroup('posts')
    .orderBy("createdAt", "desc")
    .where("published", '==', true)
    .limit(LIMIT)

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return{
    props: { posts }
  }
}

export default function Home({posts : PropPosts}) {
  const [posts, setPosts] = useState(PropPosts)
  const [loading, setLoading] = useState(false)
  const [ended, setEnded] = useState(false)

  const loadMorePosts = async () => {
    setLoading(true)
    const lastPost = posts[posts.length - 1]
    const cursor = typeof lastPost.createdAt === 'number' ? fromMillis(lastPost.createdAt) : lastPost.createdAt
    
    const query = firestore
      .collectionGroup('posts')
      .orderBy("createdAt", "desc")
      .where("published", '==', true)
      .startAfter(cursor)
      .limit(LIMIT)

    const newPosts = (await query.get()).docs.map(postToJSON)

    if (newPosts.length < LIMIT) {
      setEnded(true);
    }

    setPosts(posts.concat(newPosts))
    setLoading(false)
  }

  return (
    <main>
      <h1>New Feed</h1>
      <PostFeed posts={posts} />
      {!loading && !ended && <button onClick={loadMorePosts}>Load More</button>}

      {ended && 'You have reached the end!'}
    </main>
  )
}
