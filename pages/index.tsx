import React, { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  query,
  limit,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import SignIn from '../components/SignIn'

const firebaseConfig = {
  apiKey: 'AIzaSyAcszJXj9_CWP0Pn3O3RKg-vEBR_TBVFMo',
  authDomain: 'chat-8e45c.firebaseapp.com',
  projectId: 'chat-8e45c',
  storageBucket: 'chat-8e45c.appspot.com',
  messagingSenderId: '477251945871',
  appId: '1:477251945871:web:46833cbb9634dc379677fa',
  measurementId: 'G-D6R2RPLMCC',
}

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const provider = new GoogleAuthProvider()
const db = getFirestore(firebaseApp)

const Index = () => {
  const [user, setUser] = useState<any>(null)

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user)
    }
  })

  console.log(user)

  return (
    <div>
      {user ? (
        <div>
          <Chat user={user} />
        </div>
      ) : (
        <SignIn auth={auth} provider={provider} />
      )}
    </div>
  )
}

const SignOut = () => {
  return (
    <div>
      <button onClick={() => auth.signOut()}>Sign out</button>
    </div>
  )
}

const Chat = ({ user }: { user: any }) => {
  const [input, setInput] = useState('')

  const messagesRef = collection(db, 'messages')

  const q = query(messagesRef, orderBy('createdAt'), limit(20))

  const [messages] = useCollectionData(q, {
    snapshotListenOptions: { includeMetadataChanges: true },
  })

  console.log(messages)

  const { uid, photoURL, displayName } = user

  // console.log(q)

  const sendMessage = async (e: any) => {
    e.preventDefault()

    await addDoc(messagesRef, {
      text: input,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
      displayName,
    })

    setInput('')
  }

  return (
    <div>
      {messages &&
        messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} user={user} />
        ))}
      <form onSubmit={sendMessage}>
        <input
          value={input}
          type="text"
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

function ChatMessage({ message, user }: { message: any; user: any }) {
  const { text, uid, photoURL } = message

  const messageClass = uid === user.uid ? 'sent' : 'received'

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={
            photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'
          }
        />
        <p>{text}</p>
      </div>
    </>
  )
}

export default Index
