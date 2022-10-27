import React, { useEffect, useState } from 'react';
import {authService,db} from 'fbase';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc , query , where, orderBy, getDocs, onSnapshot} from "firebase/firestore";
import Tweet from 'components/Tweet';
import { updateProfile } from "firebase/auth";
import { async } from '@firebase/util';

function Profiles({userObj}) {
  const [tweets, setTweets] = useState([]);
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => {
    authService.signOut();
    navigate('/'); //홈으로 이동 즉 리다이렉트 기능이다.
  }

  const getMyTweets = async () => {
    const q = query(collection(db, "tweets"),
                    where("createId", "==" , userObj.uid),
                    orderBy("createAt","desc"))
    const querySnapshot = await getDocs(q);
    const newArray = [];
    querySnapshot.forEach((doc) => {
      newArray.push({...doc.data(), id:doc.id });
    });
    setTweets(newArray);
  }

  useEffect(() => { 
    getMyTweets();
  },[]);

  const onChange = e => {
    const {target: {value}} =e;
    setNewDisplayName(value);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if(userObj.displayName != newDisplayName){
      await updateProfile(userObj, {displayName: newDisplayName, photoURL:""});
  }
}

  return (
    <>
    <form onSubmit={onSubmit}>
      <input type="text" placeholder='Display name'
        onChange={onChange} value={newDisplayName} />
      <input type="submit" value="Update Profile" />
    </form>
    <button onClick={onLogOutClick}>Log Out</button>
    <div>
      {tweets.map(tweet => (
        <Tweet 
          key={tweet.Id}
          tweetObj={tweet}
          isOwner={tweet.createId === userObj.uid}
        />
      ))}
    </div>
    </>
  )
}

export default Profiles