import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import AdminAuth from "../../components/AdminAuth";
import { UserContext } from "../../lib/context";
import { firestore, serverTimestamp } from "../../lib/firebase";
import styles from "../../styles/Admin.module.css"
import ReactMarkdown from "react-markdown"
import ImageUploader from "../../components/ImageUploader";

export default function Slug(){
  return (
    <main>
      <AdminAuth>
        <PostManger />
      </AdminAuth>
    </main>
  )
}

const PostManger = () => {
  const [ preview, setPreview ] = useState(false);
  const {user} = useContext(UserContext)
  console.log(user);
  const router = useRouter()
  const {slug} = router.query
  const postRef = firestore.collection('users').doc(user.uid).collection('posts').doc(slug);
  const [post] = useDocumentData(postRef)
  // console.log(post);

  return(
    <main className={styles.container}>
      <Toaster />
      {post && (
        <>
          <section>
            <h2>{post.title}</h2>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>
          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview? 'Edit':'Preview'}</button>
            <Link href={`/${user.username}/${slug}`}>
              <button className="btn-blue">
                Live View
              </button>
            </Link>
          </aside>
        </>
      )}
    </main>
  )
}

const PostForm = ({postRef, defaultValues, preview}) => {
  const { register, handleSubmit, reset, watch, formState } = useForm({ defaultValues, mode: 'onChange' });

  const {isDirty, isValid, errors} = formState;

  const updataPost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp()
    })

    reset({ content, published })

    toast.success("post updated!")
  }

  // console.log(watch('content'));

  return(
    <form onSubmit={handleSubmit(updataPost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <textarea
          {...register("content",{
            maxLength: { value: 20000, message: 'content is too long' },
            minLength: { value: 10, message: 'content is too short' },
            required: { value: true, message: 'content is required' },
          })}
        ></textarea>

        {errors.content && <p>{errors.content.message}</p>}

        <fieldset>
          {/* ref={register} here are simular to (value and onChange) */}
          {/* but it's updated in latest upadate of react-hook-form  */}
          {/* <input className={styles.checkbox} name="published" type="checkbox" ref={register} />  */}
          <label><input className={styles.checkbox} type="checkbox" {...register("published")} />
          Published</label>
        </fieldset>

        <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
      </div>
    </form>
  )
}