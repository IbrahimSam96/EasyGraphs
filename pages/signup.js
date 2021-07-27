import { useState } from 'react';
import Link from 'next/link';
import { firebaseClient } from '../FirebaseIntialization';

import GoogleButton from 'react-google-button'
import GithubButton from 'react-github-login-button'


 const SignUp = () => {

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const[loginerror, setloginerror] = useState('');
  const [show, setShow] = useState(false);

  var provider = new firebaseClient.auth.GoogleAuthProvider();
  // GITHUBCLIENT AND SECRET FOR APP AUTH
  // var clID = "ac95ec9004b3fd5e4783";
  // var clSec = "4cf4d60872cb414234dbcc0a96d5d02864534a66";
  var providerGithub = new firebaseClient.auth.GithubAuthProvider();

return (

<div className="Signup-Page" >
    
<div className="signup-box">
        
    <h2>Sign up with Email</h2>
    <form>
    <div className="user-box">
    
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        
      /> 
       <label>Email</label>
    </div>
    <div className="user-box">
 
  <input
        type={'password'}
        value={pass}
        onChange={(e) => setPass(e.target.value)}
       
      />
       <label>Password</label>
    </div>
    <a href="#" onClick={async () => {
          await firebaseClient
            .auth()
            .createUserWithEmailAndPassword(email, pass)
            .then((result) => {
              window.location.href = '/';

              var credential = result.credential;
          
              // This gives you a Google Access Token. You can use it to access the Google API.
              var token = credential.accessToken;
              // The signed-in user info.
              var user = result.user;
              // ...
              console.log(credential,token, user)
        
            }).catch((error) => {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
        
             
              setloginerror(errorMessage)
              setShow(true)
              // ...
              
            });
            
        }} 
      > 
     <span></span> 
     <span></span>
     <span></span>
     <span></span>
      Create Account
    </a>
      </form>

      </div>

<div className="Google-SignUp">

<h2>OR</h2>

<GoogleButton 
className="Google-Button"
label='Sign Up with Google'
  onClick={ async () => { 
    await  firebaseClient.auth()
    .signInWithPopup(provider)
    .then((result) => {
      window.location.href = '/';
      var credential = result.credential;
  
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
      console.log(user)

    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...

      setloginerror(errorMessage)
      setShow(true)
    });
  }}
/>

<GithubButton
className="Github-Button"
label='Sign up with Github'
  onClick={ async () => { 
    await  firebaseClient.auth()
    .signInWithPopup(providerGithub)
    .then((result) => {
      window.location.href = '/';
      var credential = result.credential;
  
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
      console.log(credential,token, user)

    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;

     
      setloginerror(errorMessage)
      setShow(true)
      // ...
      
    });
  }}
  />

 </div>

 
{ show? 

 <div className="SignuperrorMessageNotification">
    <a onClick={ () => {setShow(false)}} >X </a>
  <h2>Oh snap! You got an error!</h2>
  <p>
  {loginerror}
  </p>

</ div>
:

null
  
}
  
    

 </div>

    
  );
};

export default SignUp


