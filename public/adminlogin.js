import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBLjHFnJ71ZHuSOzkRZQOZfsvBJlk0Yrhg",
  authDomain: "real-estate-project-24ad8.firebaseapp.com",
  databaseURL: "https://real-estate-project-24ad8-default-rtdb.firebaseio.com",
  projectId: "real-estate-project-24ad8",
  storageBucket: "real-estate-project-24ad8.appspot.com",
  messagingSenderId: "721597807443",
  appId: "1:721597807443:web:3fbec0af1b3cf348da3fa6",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase();

const loginBtn = document.getElementById("loginbtn");
const username = document.getElementById("username");
const password = document.getElementById("password");

loginBtn.addEventListener("click", () => {
  if (!username.value || !password.value) {
    alert("input fields can not be empty!");
  } else {
    const loginRef = ref(database, "loginDets/");
    onValue(loginRef, (snapshot) => {
      const data = snapshot.val();
      if (
        username.value === data.username &&
        password.value === data.password
      ) {
        location.href = "admin.html";
      } else {
        alert("incorrect credentials");
      }
    });
  }
});
