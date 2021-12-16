import Link from "next/link";
import { useContext } from "react"
import { UserContext } from "../lib/context"

export default function AdminAuth(props){
  const {username} = useContext(UserContext)
  // console.log(props.fallback);
  return username?
    props.children:
    props.fallback || <Link href="/enter">You must Sign in.</Link>
}