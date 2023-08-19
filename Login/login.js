import {auth, app, db,  signInWithEmailAndPassword,  } from '../firebaseConfig.js'

let loginEmail = document.getElementById('loginEmail');
let loginPassword = document.getElementById('loginPassword');


// buttons
let loginBtn = document.getElementById('loginBtn');
console.log(loginBtn);



function loginHandler() {

signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    if(user){
        window.location.href ='../Dashboard/dashboard.html';
    }
    alert("user logged in")
  })
  .catch((error) => {
      const errorCode = error.code;
    const errorMessage = error.message;
    // console.log(errorMessage)
    alert("user not found")
  });
};

loginBtn.addEventListener('click',loginHandler);