import React, { useEffect, useState } from 'react';
import { db, storage } from 'fbase';
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { async } from '@firebase/util';
import { ref, deleteObject } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "styles/tweet.scss";


function Tweet({tweetObj,isOwner}) {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const [nowDate, setNowDate] = useState(tweetObj.createAt);

  const onDeleteClick = async () => {
    const ok = window.confirm("삭제하시겠습니까?");
    if(ok){
      //console.log(tweetObj.id);
      //const data = await db.doc(`tweets/${tweetObj.id}`);
      const data = await deleteDoc(doc(db, "tweets", `/${tweetObj.id}`));
      //console.log(data);
      if(tweetObj.attachmentUrl !== ""){
      const deletetRef = ref(storage, tweetObj.attachmentUrl);
      await deleteObject(deletetRef);
    }
  }
}

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  }

  const onChange = e => {
    const {target:{value}} = e;
    setNewTweet(value);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
   // console.log(tweetObj.id, newTweet);
   const newTweetRef = doc(db, "tweets", `/${tweetObj.id}`);
   await updateDoc(newTweetRef, {
     text: newTweet,
     createAt: Date.now()
    });
    setEditing(false);
  }

  useEffect( () => {
    let timeStamp = tweetObj.createAt;
    const now = new Date(timeStamp);
    console.log(now);
    setNowDate(now.toUTCString()); //.toUTCString() .toDateString()
  })

  return (
    <div className="tweet">
          {editing ? ( //수정화면
           <>
             <form onSubmit={onSubmit} className="container tweetEdit">
              <input onChange={onChange} value={newTweet} required 
              className="formInput" />
              <input type="submit" value="update Tweet" className="formBtn"/>
             </form>
             <button onClick={toggleEditing} className="formBtn cancelBtn">
              Cancle
              </button>
           </>
          ) : (
            <>
            <h4>{tweetObj.text}</h4>
            {tweetObj.attachmentUrl && (
              <img src={tweetObj.attachmentUrl} width="50" height="50" />
            )}
            <span>{nowDate}</span>
              {isOwner && (
                <div className="tweet__actions">
                  <span onClick={onDeleteClick}>
                    <FontAwesomeIcon icon="fa-solid fa-trash" />
                    </span>
                    
                    <span onClick={toggleEditing}>
                      <FontAwesomeIcon icon="fa-solid fa-pencil" />
                    </span>
                    
                </div>
              )}
            </>
          )}
    </div>
  )
}

export default Tweet