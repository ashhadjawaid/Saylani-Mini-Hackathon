import {
  auth,
  db,
  doc,
  getDoc,
  onAuthStateChanged,
  signOut,
  setDoc,
  addDoc,
  collection,
  getDocs,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  updateDoc,
  serverTimestamp,
  query,
  orderBy
} from "../firebaseConfig.js";

const logoutBtn = document.getElementById("logoutBtn");
const blogTitle = document.getElementById("blogTitle");
const blogBody = document.getElementById("blogBody");
const publishBtn = document.getElementById("publishBtn");
const editBtn = document.getElementById("editBtn");

console.log(blogTitle);
console.log(blogBody);

let currentActiveUser;
let currentLoggedInUser
let profilePicture = document.getElementById("profilePicture");
const username = document.querySelector("#username");


onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    currentLoggedInUser = uid;
    console.log(uid);
    getUserData(uid);
    // ...
  } else {
    // User is signed out
    console.log("sign out");
    window.location.href = "/index.html";
  }
});



async function getUserData(uid) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const { firstName, lastName } = docSnap.data();
      createData(firstName, lastName);
    //   placeholderNameSet(firstName, lastName);

      // leftCreateData(username, firebaseSurname, profilePicture);
      // placeholderNameSet(username, firebaseSurname, profilePicture);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  } catch (error) {
    console.log(error, "==>>error in get User Data");
  }
}


// function leftCreateData(firstName, lastName){
//   firstName = firstName.slice(0, 1).toUpperCase() + firstName.slice(1).toLowerCase();
//   lastName = lastName.slice(0, 1).toUpperCase() + lastName.slice(1).toLowerCase();
//   username.innerHTML = firstName +' '+ lastName

// }

function createData(firstName, lastName) {
  firstName =
    firstName.slice(0, 1).toUpperCase() + firstName.slice(1).toLowerCase();
  lastName =
    lastName.slice(0, 1).toUpperCase() + lastName.slice(1).toLowerCase();
  username.innerHTML = firstName + " " + lastName;
}

async function getAuthorData(authorUid) {
  // console.log(authorUid, "==>>authorUid")

  const docRef = doc(db, "users", authorUid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    // console.log("No such document!");
  }
}



const logoutHandler = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      // console.log("signout successfully")
      window.location.href = "../index.html";
    })
    .catch((error) => {
      // An error happened.
    });
};

logoutBtn.addEventListener("click", logoutHandler);

// Post Handler

async function postHandler(){
  console.log(currentLoggedInUser)
    
      try {
        const response = await addDoc(collection(db, "blogs"), {
          blogBody: blogBody.value,
          authorId: currentLoggedInUser,
          time: serverTimestamp(),
          blogTitle: blogTitle.value
         
        });
    
        // console.log(response.id)
        getPosts();
      blogBody.value = "";
      blogTitle.value = "";
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

publishBtn.addEventListener('click',postHandler)

const postDiv = document.querySelector('.blogContainer')

// Get Post Data 
async function getPosts() {
  postDiv.innerHTML = "";
  const postsCollectionRef = collection(db, "blogs");
  const sortedQuery = query(postsCollectionRef, orderBy("time", "desc"));

  const querySnapshot = await getDocs(sortedQuery);
  querySnapshot.forEach(async (doc) => {
    
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    let postId = doc.id;
    const { authorId, blogBody, blogTitle, time } = doc.data();
    // console.log(doc.id ,"=====> post Id " )
  

    let { firstName, lastName } = await getAuthorData(authorId);
    firstName =
      firstName.slice(0, 1).toUpperCase() + firstName.slice(1).toLowerCase();
    lastName =
      lastName.slice(0, 1).toUpperCase() + lastName.slice(1).toLowerCase();

    // console.log(authorDetails)
    let setTime = new Date(time.seconds * 1000);
    // console.log(setTime.toString().split('GMT')[0]);
    let dateTime = setTime.toString().split("GMT")[0];

    var div1 = document.createElement("div");
    div1.setAttribute("class", "blogContainer");
    div1.innerHTML = `<div class="singleBlog">
    <div class="blogProfile">
      <img id="profilePicture" src="/download.jpeg" alt="" />
      <div class="blogProfileDetail">
        <h4>${blogTitle}</h4>
        <p${username.value}</p>
        <p>${dateTime}</p>
      </div>
    </div>
    <div class="blog">
      ${blogBody}
    </div>
    <div class="buttons">
    <div class="deletebutton">
      <button>Delete</button>
    </div>
    <div class="editbutton">
        <button id="editBtn">Edit</button>
    </div>
    </div>
  </div>`;

    postDiv.appendChild(div1);

    // placeholderName.value = "";
  });
}



// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         // User is signed in, see docs for a list of available properties
//         // https://firebase.google.com/docs/reference/js/auth.user
//         const uid = user.uid;
//         // console.log(uid)
//         getUserData(uid)
//         currentLoggedInUser = uid
//         // ...
//     } else {
//         // User is signed out
//         // ...
//         // console.log("sign out")
//         window.location.href = '../index.html'
//     }
// });

// async function getUserData(uid) {
//     try {
//         const docRef = doc(db, "users", uid);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//             // console.log("Document data:", docSnap.data());
//             const { firstName: firstNameFromDB, lastName: lastNameFromDB} = docSnap.data()
//             firstName.value = lastNameFromDB
//             lastName.value = firstNameFromDB
//         } else {
//             // docSnap.data() will be undefined in this case
//             console.log("No such document!");
//         }
//     } catch (error) {
//         console.log(error, "==>>error in get User Data")
//     }
// }

// let ppOfLoggedInUser;

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/auth.user
//     const uid = user.uid;
//     console.log(uid);
//     getUserData(uid);
//     currentLoggedInUser = uid;
//     // ...
//   } else {
//     // User is signed out
//     console.log("sign out");
//     window.location.href = "../index.html";
//   }
// });

//   Get docc

// async function getUserData(uid) {
//   try {
//     const docRef = doc(db, "users", uid);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       console.log("Document data;", docSnap.data());
//       const { firstName, lastName, email } = docSnap.data();

//       ppOfLoggedInUser = profilePicture;

//       createData(firstName, lastName);
//       // placeHolderNameSet(firstName, lastName, email);
//     } else {
//       console.log("No Such Document");
//     }
//   } catch (error) {
//     console.log(error, "error in getting userData");
//   }
// }


// async function getAuthorData(authorUid) {
//   // console.log(authorUid, "==>>authorUid")

//   const docRef = doc(db, "users", authorUid);
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     // console.log("Document data:", docSnap.data());
//     return docSnap.data();
//   } else {
//     // docSnap.data() will be undefined in this case
//     // console.log("No such document!"); }
//   }
// }


publishBtn.addEventListener("click", postHandler);

//Edit Functionality//

// editBtn.addEventListener("click", editProfileHandler);

function editProfileHandler() {
  console.log(blogTitle.value, blogBody.value, "edit button working properly");
}

// window.addEventListener("load", () => {
//   getPosts();
// });

//Post Handler//
// async function postHandler() {
//   try {
//     const response = await addDoc(collection(db, "Blogs"), {
//       blogBody: blogTitle.value,
//       blogTitle: blogBody.value,
//       uid: currentLoggedInUser,
//     });
//     // console.log(response.id)
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// }

// const postElement = document.createElement("div");
// postElement.setAttribute("class", "blogs");
// let contenT = `<div class="singleBlog"> -->
//         <!-- <div class="blogProfile">
//           <img id="profilePicture" src="/download.jpeg" alt="" />
//           <div class="blogProfileDetail">
//             <h4>Blog Name</h4>
//             <p>${username}</p>
//           </div>
//         </div>
//         <div class="blog">
//           Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias,
//           culpa! Et ratione id perferendis, odio ea dolore modi est libero
//           debitis aliquid ipsum exercitationem assumenda, amet quis expedita
//           impedit cupiditate ab accusantium eligendi rerum minima nesciunt.
//           Explicabo deleniti illum aliquid tempora sapiente, impedit obcaecati
//           eligendi fugiat adipisci pariatur. Obcaecati tenetur, nisi quisquam
//           praesentium fuga nihil quae ea totam iste dicta.
//         </div>
//         <div class="buttons">
//         <div class="deletebutton">
//           <button>Delete</button>
//         </div>
//         <div class="editbutton">
//             <button id="editBtn">Edit</button>
//         </div>
//         </div>
//       </div>`;
