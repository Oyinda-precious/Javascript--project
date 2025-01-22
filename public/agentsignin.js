import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import {
  getStorage,
  getDownloadURL,
  ref as stRef,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

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
const storage = getStorage();

const loginButton = document.getElementById("login-Btn");

function redirectToDashboard(event) {
  event.preventDefault();
  window.location.href = "agentdashboard.html";
}
loginButton.addEventListener("click", redirectToDashboard);
