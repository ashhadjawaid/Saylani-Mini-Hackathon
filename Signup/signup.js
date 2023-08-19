import{
    auth, app, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, doc, setDoc
} from '../firebaseConfig.js'

//SignUp 

let firstName = document.getElementById('firstName')
let lastName = document.getElementById('lastName')
let email = document.getElementById('email')
let password = document.getElementById('password')
let repeatPassword = document.getElementById('repeatPassword')

const SignUpBtn = document.getElementById('SignUpBtn')
console.log(SignUpBtn);

async function SignUphandler(){
    if(password.value== repeatPassword.value){
        try{
            let response = await createUserWithEmailAndPassword(auth, email.value, password.value)
            alert("User Registered")
            if(response.user){
                addData(response.user.uid)
            }
        }
        catch (error){
            let errorMessage = error.message
            console.log(errorMessage);
        }
    }
    else{
        return alert('Try to match password with the repeat password')
    }
    
}

async function addData(uid){
    try{
        let docRef = await setDoc(doc(db, "users", uid),{
            firstName:firstName.value,
            lastName:lastName.value,
            email:email.value,
            id:uid
        })

    }
    catch{e}{
        console.error("Error")
    }
}

SignUpBtn.addEventListener('click', SignUphandler)