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
import ChatMessage from '../components/ChatMessage'
import Chat from '../components/Chat'
import Sidebar from '../components/Sidebar'

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
          <div className="flex flex-row">
            <div className="fixed">
              <Sidebar />
            </div>
            <div className='ml-72'>
              <Chat user={user} db={db} auth={auth} />
            </div>
          </div>
        </div>
      ) : (
        <SignIn auth={auth} provider={provider} />
      )}
    </div>
  )
}

export default Index
