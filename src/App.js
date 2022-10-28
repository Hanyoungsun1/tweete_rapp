import React,{useState, useEffect} from "react";
import {authService} from 'fbase';
import { onAuthStateChanged } from "firebase/auth";
import AppRouter from "Router";

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons'
library.add(fas, faTwitter, faGoogle, faGithub)

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userObj, setUserObj] = useState(null);//로그인한 사용자 정보

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      console.log(user);
      if (user) {
        //User is signed in
        setIsLoggedIn(user);
        setUserObj(user);
        //const uid = user.uid;
        
      } else {
        // User is signed out
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, [])
  //console.log(authService.currentUser);//currentUser는 현재 로그인한 사람 확인 함수

  return (
    <>
    {init ? ( 
    <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
    ) : (
    "initializing..."
     )} 
    </>
  );
}
/*
{init ?( <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
    ) : (
    "initializing..." )} 
    <footer>&copy; {new Date().getFullYear()} Twitter app</footer>
  */

export default App;

