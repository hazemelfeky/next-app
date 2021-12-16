import Link from "next/link"
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";

export default function NavBar(){
  const {user, username} = useContext(UserContext);

  return(
    <nav className="navbar">
      <ul>

        <li>
          <Link href="/" >
            <button className="btn-logo">Home</button>
          </Link>
        </li>

        {/* signed in */}
        {user && (
          <>
            <li className="push-left">
              <button className="btn" onClick={ () => auth.signOut()}>Sign Out</button>
            </li>
            <li>
              <Link href="/admin">
                <button className="btn-blue">Write Post</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user && user.photoURL} />
              </Link>
            </li>
          </>
        )}

        {/* havn't signed in yet */}
        {!user && (

            <li>
              <Link href="/enter">
                <button className="btn-blue">Join us</button>
              </Link>
            </li>

        )}
      </ul>
    </nav>
  )
}