import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
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
let imgName;
let imgFile;

const formatter = Intl.NumberFormat("en-NG");

// price.addEventListener("input", () => {
//   price.value = formatter.format(price.value);
// });

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
  const propertyDetails = {
    propertyName: propertyName.value,
    propertyType: propertyType.value,
    price: price.value,
    bedroomQty: bedroomQty.value,
    bathroomQty: bathroomQty.value,
    parkingSpace: decision,
    propertyPicture: imgName,
    location: location.value,
  };

  const storageRef = stRef(storage, `${imgName}`);
  uploadBytes(storageRef, imgFile).then((snapshot) => {
    push(ref(database, "properties/"), propertyDetails).then((message) => {
      console.log("uploaded");
    });
    console.log("Uploaded a blob or file!");
  });
});
