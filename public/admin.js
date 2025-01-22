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
const numberProperties = document.getElementById("number-Properties");
let imgName;
let imgFile;

const formatter = Intl.NumberFormat("en-NG");

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
    };

    // Push property details with the unique ID
    set(newPropertyRef, propertyDetails)
      .then(() => {
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
          if (value.agentId) {
            listedProperty++;
            console.log("property count:", value);
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

let myProperty = 0;

function propertiesCount() {
  const propertyRef = ref(database, "properties");
  onValue(propertyRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      Object.values(data).forEach((value) => {
        // console.log(value);
        if (value.id) {
          if (value.id) {
            myProperty++;
            console.log("property count:", value);
          }
        }
      });
      numberProperties.innerHTML = myProperty;
      // console.log(data);
    } else {
      console.log("no data found");
    }
  });
}
propertiesCount();

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
