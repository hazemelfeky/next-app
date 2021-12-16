import { useContext, useEffect, useState } from "react";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { UserContext } from "../../lib/context";
import { auth, getUsernameWithID, getUserWithUsername, postToJSON } from "../../lib/firebase";

export async function getServerSideProps({ query }){
  // query refrence to url 
  const {username} = query;

  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5);
    posts = (await postsQuery.get()).docs.map(postToJSON);
  }

  // this return props to all components in this branch
  return{
    props: { user, posts }
  }
}

// user sent here is the profile owner
export default function UserProfilePage({ user: PropUser, posts }){

  const {user} = useContext(UserContext)
  let admin = false;
  // checking if user in his profile by it's photoURL :D
  // it must be with id but i didn't :D :D 
  if(user){
    admin = PropUser.photoURL == user.photoURL
    console.log("admin", admin);
  }
  
  // const username = getUsernameWithID()

  return (
    <main>
      <UserProfile user={PropUser} />
      {/* only published posts => line 26 */}
      <PostFeed posts={posts} admin={admin} />
    </main>
  )
}