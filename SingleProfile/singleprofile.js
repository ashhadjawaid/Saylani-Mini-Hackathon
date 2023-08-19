import { auth, db, onAuthStateChanged, getDoc, doc, storage, setDoc, ref, uploadBytesResumable, getDownloadURL, signOut, EmailAuthProvider, reauthenticateWithCredential, updatePassword, } from "../firebaseConfig.js"

const oldPasswordHtml = document.querySelector('#oldPassword')
const newPasswordHtml = document.querySelector('#newPassword')
const profilePicHtml = document.querySelector('#profilePic')
const logoutBtn = document.querySelector('#logoutBtn')
const updateBtn = document.querySelector('#updateBtn')
const profilePic = document.querySelector('#profilePic')

console.log(updateBtn);

updateBtn.addEventListener('click', editProfileHandler)

// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         const uid = user.uid;
//         getUserData(uid)
//         loggedinUserId = uid
//     } else {
//         window.location.href = '../index.html'
//     }
// });

// async function getUserData(uid) {
//     try {
//       const docRef = doc(db, "users", uid);
//       const docSnap = await getDoc(docRef);
  
//       if (docSnap.exists()) {
//         console.log("Document data:", docSnap.data());
//         const { firstName, lastName } = docSnap.data();
//         createData(firstName, lastName);
//       //   placeholderNameSet(firstName, lastName);
  
//         // leftCreateData(username, firebaseSurname, profilePicture);
//         // placeholderNameSet(username, firebaseSurname, profilePicture);
//       } else {
//         // docSnap.data() will be undefined in this case
//         console.log("No such document!");
//       }
//     } catch (error) {
//       console.log(error, "==>>error in get User Data");
//     }
//   }

//   function createData(firstName, lastName) {
//     firstName =
//       firstName.slice(0, 1).toUpperCase() + firstName.slice(1).toLowerCase();
//     lastName =
//       lastName.slice(0, 1).toUpperCase() + lastName.slice(1).toLowerCase();
//     username.innerHTML = firstName + " " + lastName;
//   }

// logoutBtn.addEventListener('click', logoutHandler())

// const logoutHandler = () => {
//     signOut(auth)
//       .then(() => {
//         // Sign-out successful.
//         // console.log("signout successfully")
//         window.location.href = "../index.html";
//       })
//       .catch((error) => {
//         // An error happened.
//       });
//   };

  async function editProfileHandler() {
    console.log(profilePic.files[0])
    changePassword()

    const file = profilePicHtml.files[0];

    if (file) {
        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: 'image/jpeg'
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, 'profileImages/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        break;
                }
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    console.log('File available at', downloadURL);
                    await setDoc(doc(db, "users", loggedinUserId), {
                        firstName: firstNameHtml.value,
                        lastName: lastNameHtml.value,
                        profilePicture: downloadURL,
                        emailAddress: loggedinUserEmail,
                    });
                });
            }
        );

    } else {
        changePassword()
        await setDoc(doc(db, "users", loggedinUserId), {
            firstName: firstNameHtml.value,
            lastName: lastNameHtml.value,
            email: loggedinUserEmail,
        });
    }
}

async function changePassword() {
    const oldPassword = oldPasswordHtml.value; // Get the value of the old password input
    const newPassword = newPasswordHtml.value;

    try {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(oldPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);

        alert("Password updated successfully.");
    } catch (error) {
        console.error("Error changing password:", error);
    }
}