import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBLjHFnJ71ZHuSOzkRZQOZfsvBJlk0Yrhg",
  authDomain: "real-estate-project-24ad8.firebaseapp.com",
  databaseURL: "https://real-estate-project-24ad8-default-rtdb.firebaseio.com",
  projectId: "real-estate-project-24ad8",
  storageBucket: "real-estate-project-24ad8.appspot.com",
  messagingSenderId: "721597807443",
  appId: "1:721597807443:web:801e3405f3c986b9da3fa6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const email = document.getElementById("email");
const password = document.getElementById("passwordd");
const submitBtn = document.getElementById("login-Btn");

submitBtn.addEventListener("click", () => {
  if (!email.value || !password.value) {
    Swal.fire({
      icon: "error",
      text: "Email and password are required",
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    Swal.fire({
      icon: "error",
      text: "Invalid email format",
    });
    return;
  }

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      if (user.emailVerified) {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome back, ${userCredential.user.email}`,
        }).then(() => {
          window.location.href = "agentdashboard.html";
        });
      } else {
        Swal.fire({
          icon: "error",
          text: "Please verify email before you login.",
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        text: error.message,
      });

      if (error) {
        Swal.fire({
          icon: "error",
          text: "No user found with this email.",
        });
      } else if (error === "auth/user-not-found") {
        // === "auth/user-not-found"
        Swal.fire({
          icon: "error",
          text: "Incorrect password. Please try again.",
        });
      } else {
        Swal.fire({
          icon: "error",
          text: "An error occurred. Please try again.",
        });
      }
    });
});

// Login with Google
// googleBtn.addEventListener("click", () => {
//   signInWithPopup(auth, provider)
//     .then((result) => {
//       const user = result.user;

//       showSuccess(`Welcome ${user.displayName}!`).then(() => {
//         window.location.href = "landingpage.html";
//       });
//     })
//     .catch((error) => {
//       showError("An error occurred during Google login. Please try again.");
//       console.error("Error during Google login:", error);
//     });
// });
