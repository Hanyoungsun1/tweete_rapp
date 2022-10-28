import React, { useEffect, useState } from 'react';
import {authService,db} from 'fbase';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc , query , where, orderBy, getDocs, onSnapshot} from "firebase/firestore";
import Tweet from 'components/Tweet';
import { updateProfile } from "firebase/auth";
import { async } from '@firebase/util';
import "styles/profiles.scss";

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
    <div className="container">
    <form onSubmit={onSubmit} className="profileForm">
      <input type="text" placeholder="Display name"
        onChange={onChange} value={newDisplayName} 
        autoFocus className="formInput" />
      <input type="submit" value="Update Profile" 
      className="formBtn" style={{marginTop: 10,}}/>
    </form>
    <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
      Log Out
      </span>
    </div>
  )
}
/*</div>{tweets.map(tweet => (
        <Tweet 
          key={tweet.Id}
          tweetObj={tweet}
          isOwner={tweet.createId === userObj.uid}
        />))}
*/ 
export default Profiles