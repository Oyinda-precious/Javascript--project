// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Your web app's Firebase configuration
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
const auth = getAuth();
const provider = new GoogleAuthProvider();

const theName = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-Password");
const terms = document.getElementById("terms");
const submitBtn = document.getElementById("submitBtn");
const errors = document.querySelectorAll("#err");
const inputs = document.querySelectorAll("#input-field");
const googleBtn = document.getElementById("googleBtn");
const passEyes = document.querySelectorAll("#passeye");
let showPassword = false;

const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[-'\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/;

passEyes[0].addEventListener("click", () => {
  if (!showPassword) {
    passEyes[0].src = "../icons8-hide-password-24.png";
    password.type = "text";
    showPassword = true;
  } else {
    passEyes[0].src = "../icons8-hide-password-24.png";
    password.type = "password";
    showPassword = false;
  }
});

passEyes[1].addEventListener("click", () => {
  if (!showPassword) {
    passEyes[1].src = "../icons8-hide-password-24.png";
    confirmPassword.type = "text";
    showPassword = true;
  } else {
    passEyes[1].src = "../icons8-hide-password-24.png";
    confirmPassword.type = "password";
    showPassword = false;
  }
});
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    theName.value === "" ||
    email.value === "" ||
    terms.value === "" ||
    password.value === "" ||
    confirmPassword.value === ""
  ) {
    errors.forEach((error) => {
      console.log(error);
      // error.innerHTML = "Required!!!";
      // alert("All details are Required!!!");
      Swal.fire({
        icon: "error",
        text: "All details are Required!!!",
      });
      resetButton();
      return;
    });

    inputs.forEach((input) => {
      input.style.borderColor = "red";
    });
    setTimeout(() => {
      errors.forEach((error) => {
        error.innerHTML = "";
      });
      inputs.forEach((input) => {
        input.style.borderColor = "#999";
      });
    }, 2000);
    resetButton();
    return;
  }

  // Validate Name
  if (!nameRegex.test(theName.value)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Name",
      text: "Please check your name and try again.",
    });
    resetButton();
    return;
  }
  if (!terms.checked) {
    Swal.fire({
      icon: "error",
      text: "Kindly tick the terms and conditions box.",
    });
    resetButton();
    return;
  }
  // Validate Email
  if (!emailRegex.test(email.value)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email",
      text: "Please check your email address and try again.",
    });
    resetButton();
    return;
  }

  // Check if passwords match
  if (password.value !== confirmPassword.value) {
    Swal.fire({
      icon: "error",
      title: "Password Mismatch",
      text: "Passwords do not match. Please try again.",
    });
    resetButton();
    return;
  }

  // Validate Password
  if (!passwordRegex.test(password.value)) {
    Swal.fire({
      icon: "error",
      title: "Weak Password",
      text: "Your password must include uppercase, lowercase, numbers, and special characters.",
    });
    resetButton();
    return;
  }

  // All validations passed, create the user
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);

      // Send email verification
      sendEmailVerification(user)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Signup Successful",
            text: "A verification email has been sent. Please check your email before proceeding.",
          }).then(() => {
            resetButton();
            auth.signOut(); // Log out user to enforce email verification
            sessionStorage.setItem("username", `${theName.value}`);
            location.replace("login.html"); // Redirect to login
          });
        })
        .catch((error) => {
          console.error("Error sending verification email:", error);
          Swal.fire({
            icon: "error",
            title: "Verification Email Failed",
            text: "There was an issue sending the verification email. Please try again.",
          });
          resetButton();
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      let errorMessage = "An error occurred. Please try again.";

      // Handle Firebase error codes
      if (errorCode === "auth/email-already-in-use") {
        errorMessage =
          "This email is already in use. Please try logging in instead.";
      } else if (errorCode === "auth/invalid-email") {
        errorMessage = "The email address you entered is invalid.";
      } else if (errorCode === "auth/weak-password") {
        errorMessage =
          "Your password is too weak. Please use a stronger password.";
      }

      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: errorMessage,
      });
      resetButton();
    });
});

// Helper function to reset the submit button
function resetButton() {
  submitBtn.innerHTML = "Sign up";
}

googleBtn.addEventListener("click", () => {
  // Change "provider" to the actual provider instance
  signInWithPopup(auth, provider)
    .then((result) => {
      // Get user details
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      // Show success alert with user's name
      Swal.fire({
        icon: "success", // Use success icon for better UX
        title: "Signup Successful",
        text: `Welcome ${user.displayName}!`,
      }).then(() => {
        // Redirect to landing page
        window.location.href = "Login.html";
      });

      console.log("User info:", user);
    })
    .catch((error) => {
      // Show error alert
      Swal.fire({
        icon: "error", // Use error icon for better UX
        title: "Signup Failed",
        text: error.message, // Display error message to the user
      });

      console.error("Error during Google signup:", error);
    });
});

function login() {
  const prevUrl = sessionStorage.getItem("prevUrl");
  if (prevUrl) {
    sessionStorage.removeItem("prevUrl");
  }
  window.location.href = prevUrl || "landingpage.html";
}

// googleBtn.addEventListener("click", () => {
//   signInWithPopup(auth, provider)
//     .then((result) => {
//       const user = result.user;
//       alert(`Welcome ${user.displayName}`);
//       console.log("User info:", user);
//     })
//     .catch((error) => {
//       console.error(error.code);
//       console.error(error.message);
//     });
// });
