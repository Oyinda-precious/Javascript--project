import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import {
  getStorage,
  uploadBytes,
  ref as stRef,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
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
const auth = getAuth();

const imgPicker = document.getElementById("imgpicker");
const image = document.getElementById("image");
const price = document.getElementById("price");
const uploadBtn = document.getElementById("uploadbtn");
const propertyName = document.getElementById("propertyname");
const propertyType = document.getElementById("propertytype");
const bedroomQty = document.getElementById("bedroomqty");
const bathroomQty = document.getElementById("bathroomqty");
const location = document.getElementById("location");
const propertycategory = document.getElementById("propertycategory");
const totalProperties = document.getElementById("total-Properties");
const agentName = document.getElementById("agentName");
let imgName;
let imgFile;

const formatter = Intl.NumberFormat("en-NG");
let userId;
function createAgentUser() {
  const newAgent = push(ref(database, "Agents/"));
  const agentRef = ref(database, "Agents");
  onValue(agentRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      Object.values(data).forEach((value) => {
        console.log(value);

        if (value.agentId === userId) {
          return;
        } else {
          const agentDetails = {
            name: sessionStorage.getItem("username"),
            agentId: userId,
          };
          set(newAgent, agentDetails)
            .then(() => {
              console.log("Agent details uploaded");
            })
            .catch((error) => {
              console.log("Error", error);
            });
        }
      });
    } else {
      const agentDetails = {
        name: sessionStorage.getItem("username"),
        agentId: userId,
      };
      set(newAgent, agentDetails)
        .then(() => {
          console.log("Agent details uploaded");
        })
        .catch((error) => {
          console.log("Error", error);
        });
    }
  });
}
onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;
    createAgentUser();
    console.log(user.uid);
  } else {
    window.location.href = "index.html";
  }
});

imgPicker.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const fileReader = new FileReader();

  imgFile = file;
  imgName = file.name;

  if (file) {
    fileReader.readAsDataURL(file);
  }

  fileReader.addEventListener("load", (e) => {
    image.src = e.target.result;
  });
});

uploadBtn.addEventListener("click", () => {
  let decision;
  if (document.getElementById("yes").checked) {
    decision = "yes";
  } else if (document.getElementById("no").checked) {
    decision = "no";
  }

  const storageRef = stRef(storage, `${imgName}`);
  uploadBytes(storageRef, imgFile).then((snapshot) => {
    console.log("Image uploaded successfully!");

    // Generate a new reference with a unique ID
    const newPropertyRef = push(ref(database, "properties/"));
    const propertyId = newPropertyRef.key; // Get the unique ID

    // Now define the property details, including the unique ID
    const propertyDetails = {
      propertyName: propertyName.value,
      propertyType: propertyType.value,
      price: price.value,
      bedroomQty: bedroomQty.value,
      bathroomQty: bathroomQty.value,
      parkingSpace: decision,
      propertyPicture: imgName,
      location: location.value,
      propertycategory: propertycategory.value,
      id: propertyId, // Assign the unique ID
      agentId: userId,
    };

    // Push property details with the unique ID
    set(newPropertyRef, propertyDetails)
      .then(() => {
        alert("Property details uploaded with ID");
        console.log("Property details uploaded with ID:", propertyId);
        // Clear form fields or give feedback as needed
      })
      .catch((error) => {
        console.error("Error uploading data:", error);
      });
  });
});
let listedProperty = 0;

function propertyCount() {
  const agentPropertyRef = ref(database, "properties");
  onValue(agentPropertyRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      Object.values(data).forEach((value) => {
        // console.log(value);
        if (value.agentId) {
          if (value.agentId === userId) {
            listedProperty++;
            console.log("property count:", value);
            console.log(userId);
          }
        }
      });
      totalProperties.innerHTML = listedProperty;
      // console.log(data);
    } else {
      console.log("no data found");
    }
  });
}
propertyCount();

// function checkAgentName() {
//   const agentRef = ref(database, "Agents");
//   onValue(agentRef, (snapshot) => {
//     const data = snapshot.val();
//     if (data) {
//       Object.values(data).forEach((agent) => {
//         if (agent.agentId === userId) {
//           agentName.innerHTML = `Welcome ${agent.name}!`;
//           return;
//         }
//         console.log("no agent found");
//       });
//     } else {
//       console.log("no data");
//     }
//   });
// }
// checkAgentName();

function checkAgentName() {
  // Reference to the Agents in the database
  const agentRef = ref(database, "Agents");

  onValue(agentRef, (snapshot) => {
    const data = snapshot.val();

    if (data) {
      let agentFound = false; // To ensure we check if the agent is found
      Object.values(data).forEach((agent) => {
        // Check if the agentId matches the userId
        if (agent.agentId === userId) {
          if (agent.name) {
            // Ensure the DOM element reference exists
            if (agentName) {
              agentName.innerHTML = `Welcome ${agent.name}!`;
            } else {
              console.error("agentName element not found in DOM.");
            }
          } else {
            console.error("Agent name exist in the database.");
          }
          agentFound = true;
          return; // Exit loop after finding the matching agent
        }
      });

      if (!agentFound) {
        console.log("No agent found with the given userId.");
      }
    } else {
      console.log("No data available in the database.");
    }
  });
}

checkAgentName();

// document.addEventListener("DOMContentLoaded", () => {
//   const signoutButton = document.getElementById("signOut");

//   // Add click event listener to the button
//   signoutButton.addEventListener("click", () => {
//     signOut(auth)
//       .then(() => {
//
//         // alert("Sign-out successful.");
//         window.location.href = "index.html"; // Redirect to index.html
//       })
//       .catch((error) => {
//         console.log("An error occurred", error);
//       });
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const signOutButton = document.getElementById("signOut"); // Replace with your button's ID
  console.log("Sign out button element:", signOutButton);

  if (signOutButton) {
    signOutButton.addEventListener("click", (event) => {
      // Prevent any other default behavior (like form submission or page redirect)
      event.preventDefault();
      Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to sign out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, sign out",
        cancelButtonText: "No, stay logged in",
      })
        .then((result) => {
          console.log("Result from Swal:", result);

          if (result.isConfirmed) {
            // Step 2: Perform sign-out logic (e.g., clearing session, logging out)
            console.log("User confirmed sign out");
            performSignOut();

            // Step 3: Notify the user of a successful sign-out
            Swal.fire({
              title: "Signed Out",
              text: "You have been signed out successfully.",
              icon: "success",
              confirmButtonText: "OK",
            });
            window.location.href = "index.html";
          } else {
            // Optional: Handle when user clicks "No"
            console.log("User canceled sign out");
            Swal.fire({
              title: "Cancelled",
              text: "You are still logged in.",
              icon: "info",
              confirmButtonText: "OK",
            });
          }
        })
        .catch((error) => {
          console.error("Error with Swal.fire:", error);
        });
    });
  } else {
    console.error("Sign out button not found in the DOM");
  }

  // Function to handle the actual sign-out logic
  function performSignOut() {
    console.log("User signed out - performSignOut() called");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Get all menu items and sections
  const menuItems = document.querySelectorAll("#sidebar li");
  const sections = document.querySelectorAll(".content-section");

  // Add click event listeners to each menu item
  menuItems.forEach((menuItem) => {
    menuItem.addEventListener("click", () => {
      // Remove 'active' class from all menu items
      menuItems.forEach((item) => item.classList.remove("active"));

      // Add 'active' class to the clicked menu item
      menuItem.classList.add("active");

      // Hide all sections
      sections.forEach((section) => section.classList.remove("active"));

      // Show the section corresponding to the clicked menu item
      const sectionId = menuItem.id.replace("Menu", "");
      document.getElementById(sectionId).classList.add("active");
    });
  });
});
