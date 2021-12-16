import { useContext } from "react";
import { UserContext } from "../lib/context";
import { auth, googleAuthProvider } from "../lib/firebase";

export default function Enter(){
  const {user, username} = useContext(UserContext);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return(
    <main>
      {user?
        username? <SignOutButton /> : <UsernameForm />
        : <SignInButton />
      }
    </main>
  )
}

function SignInButton(){
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider)
  }

  return(
    <button className="btn-google" onClick={() => signInWithGoogle()}>
      <img src={"./google.png"}/>
      Sign in with Google
    </button>
  )
}

function SignOutButton(){
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm(){
  const {user, username} = useContext(UserContext);
  return(
    <h2>Welcome {username}</h2>
  )
}