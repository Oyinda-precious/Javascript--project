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

const formatter = Intl.NumberFormat("en-NG");

const properties = document.getElementById("properties");

function renderProperties() {
  console.log("working");

  const propertyRef = ref(database, "properties");
  const loginRef = ref(database, "loginDets");

  onValue(
    propertyRef,
    (snapshot) => {
      const data = snapshot.val();
      if (data) {
        Object.values(data).forEach((value) => {
          const box = document.createElement("div");
          box.className = "box-div";
          const img = document.createElement("img");
          const imgRef = stRef(storage, value.propertyPicture);
          getDownloadURL(imgRef)
            .then((url) => {
              img.src = url;
            })
            .catch((error) => {
              console.log(error);
            });
          const bedDiv = document.createElement("div");
          const bedLink = document.createElement("a");
          bedDiv.className = "bedroom";
          bedLink.textContent = value.propertyName;
          bedDiv.appendChild(bedLink);
          const locationDiv = document.createElement("div");
          locationDiv.className = "location";
          const place = document.createElement("span");
          const icon = document.createElement("i");
          icon.className = "fa-solid fa-location-dot fa-2xs";
          place.textContent = value.location;
          place.className = "place";
          locationDiv.appendChild(icon);
          locationDiv.appendChild(place);
          const price = document.createElement("div");
          price.className = "price";
          price.textContent = `₦ ${formatter.format(value.price)}`;
          const spaceDiv = document.createElement("div");
          spaceDiv.className = "space";
          const smallLine = document.createElement("div");
          smallLine.className = "smalline";
          const smallLine2 = document.createElement("div");
          smallLine2.className = "smalline2";
          const smallLine3 = document.createElement("div");
          smallLine3.className = "smalline3";
          const iconDiv = document.createElement("div");
          iconDiv.className = "bed";
          const iconDiv2 = document.createElement("div");
          iconDiv2.className = "bed";
          const iconDiv3 = document.createElement("div");
          iconDiv3.className = "bed";
          const slIcon = document.createElement("i");
          slIcon.className = "fa-solid fa-bed";
          const slIcon2 = document.createElement("i");
          slIcon2.className = "fa-solid fa-bath";
          const slIcon3 = document.createElement("i");
          slIcon3.className = "fa-solid fa-warehouse";
          const span = document.createElement("span");
          span.textContent = value.bedroomQty;
          span.className = "two";
          const span2 = document.createElement("span");
          span2.textContent = value.bathroomQty;
          span2.className = "two";

          const span3 = document.createElement("span");
          if (value.parkingSpace === "yes") {
            span3.textContent = "Parking Space";
          } else {
            span3.textContent = "None";
          }

          span3.className = "two";

          const bottomDiv = document.createElement("div");
          bottomDiv.className = "last-box";
          const residenceDiv = document.createElement("div");
          residenceDiv.className = "residence";
          const rSpan = document.createElement("span");
          rSpan.textContent = value.propertyType;
          const mSpan = document.createElement("span");
          mSpan.textContent = "Management and Letting";
          mSpan.className = "manage";
          residenceDiv.appendChild(rSpan);
          residenceDiv.appendChild(mSpan);
          bottomDiv.appendChild(residenceDiv);

          smallLine.appendChild(iconDiv);
          smallLine.appendChild(span);
          smallLine2.appendChild(iconDiv2);
          smallLine2.appendChild(span2);
          smallLine3.appendChild(iconDiv3);
          smallLine3.appendChild(span3);
          iconDiv.appendChild(slIcon);
          iconDiv2.appendChild(slIcon2);
          iconDiv3.appendChild(slIcon3);
          spaceDiv.appendChild(smallLine);
          spaceDiv.appendChild(smallLine2);
          spaceDiv.appendChild(smallLine3);
          box.appendChild(img);
          box.appendChild(bedDiv);
          box.appendChild(locationDiv);
          box.appendChild(price);
          box.appendChild(spaceDiv);
          box.appendChild(bottomDiv);
          properties.appendChild(box);
          console.log(value);
        });
      } else {
        console.error("No data available");
      }
    },
    (error) => {
      console.error("Error fetching data:", error);
    }
  );
}

renderProperties();
