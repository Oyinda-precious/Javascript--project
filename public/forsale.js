import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  get,
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

const params = new URLSearchParams(window.location.search);
const buildingId = params.get("buildingId");
const locationOptions = document.getElementById("location");
const properties = document.getElementById("properties");
const sortedLocations = new Set();

const propertyRef = ref(database, "properties");

onValue(propertyRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    console.log("data:", data);
    Object.values(data).forEach((property) => {
      if (property.propertycategory.toLowerCase() !== "sale") {
        return;
      }
      const imageRef = stRef(storage, property.propertyPicture);

      getDownloadURL(imageRef).then((url) => {
        properties.innerHTML += `<div class="box-div">
            <img src="${url}" alt="" />
            <div id="bedroom" class="bedroom">
              <a id="bedlink" data-id=${property.id} href=""> ${
          property.propertyName
        }</a>
            </div>
            <div>
              <div class="price">₦${formatter.format(property.price)}</div>
            </div>
            <div id="resident-details">
              <div id="detailssss">
                <div class="thetype">Type</div>
                <div class="residentialll">${property.propertyType}</div>
              </div>
              <div id="detailssss">
                <div class="thetype">Location</div>
                <div class="residentialll">${property.location}</div>
              </div>
              <div id="detailssss">
                <div class="thetype">Contract</div>
                <div class="residentialll">${property.propertycategory}</div>
              </div>
              <div id="detailssss">
                <div class="thetype">Area</div>
                 <div class="residentialll">200</div>
              </div>
            </div>

          </div>`;
        const bedlinks = document.querySelectorAll("#bedlink");

        bedlinks.forEach((bedlink) => {
          bedlink.addEventListener("click", (e) => {
            loadBuildingDetails(e);
          });
        });
      });
      sortedLocations.add(property.location);
    });
  }
  sortedLocations.forEach((location) => {
    locationOptions.innerHTML += `<option value=${location}>${location}</option>`;
  });
});

function loadBuildingDetails(e) {
  e.preventDefault();
  const buildingId = e.target.getAttribute("data-id");

  location.href = `building.html?buildingId=${buildingId}`;
}

function formatDateTime() {
  const now = new Date();
  // Format the date as dd-mm-yyyy
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = now.getFullYear();

  // Format the time as hh:mm:ss AM/PM
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert '0' to '12' for midnight

  const formattedTime = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  const formattedDate = `${day}-${month}-${year}`;
  // Display the final result
  document.getElementById(
    "dateTimeDisplay"
  ).innerText = `Time ${formattedDate} ${formattedTime}`;
}
// Call the function to display the date and time initially
formatDateTime();

// Optional: Update the time every second
setInterval(formatDateTime, 1000);

//bed & baths button function
function changeValue(id, step) {
  const input = document.getElementById(id);
  const currentValue = parseInt(input.value) || 0;
  input.value = currentValue + step;
}

// Search functionality
const searchBtn = document.getElementById("searchBtn");
const loadingSpinner = document.getElementById("loading-spinner");
// const resultsDiv = document.getElementById("results");

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const type = document.getElementById("type").value;
  const saleType = document.getElementById("saleType").value;
  const location = document.getElementById("location").value;
  const beds = parseInt(document.getElementById("beds").value) || 0; // Parse as integer
  const baths = parseInt(document.getElementById("baths").value) || 0; // Parse as integer
  const propertyId = document.getElementById("propertyId").value;

  console.log("type: ", type);
  console.log("saleType", saleType);
  console.log("location", location);

  loadingSpinner.style.display = "block";
  properties.innerHTML = " ";
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Reference to the "properties" node in your database
    const propertiesRef = ref(database, "properties");
    const snapshot = await get(propertiesRef);
    if (snapshot.exists()) {
      const Properties = snapshot.val();
      console.log(Properties);

      const filtered = Object.values(Properties).filter((property) => {
        return (
          (!type || property.propertyType === type) &&
          (!saleType || property.propertycategory === saleType) &&
          (!location || property.location === location) &&
          (!beds || property.bedroomQty == beds) &&
          (!baths || property.bathroomQty == baths) &&
          (!propertyId || property.id === propertyId)
        );
      });
      loadingSpinner.style.display = "none";
      // Display results
      if (filtered.length > 0) {
        console.log(filtered);

        // properties.innerHTML =
        // Loop through filtered properties
        filtered.forEach((property) => {
          const imageRef = stRef(storage, property.propertyPicture);

          // Fetch the image URL asynchronously
          getDownloadURL(imageRef)
            .then((url) => {
              properties.innerHTML += `
              <div class="box-div">
                <img src="${url}" alt="" />
                <div id="bedroom" class="bedroom">
                  <a id="bedlink" data-id=${property.id} href="">${
                property.propertyName
              }</a>
                </div>
                <div>
                  <div class="price">₦${formatter.format(property.price)}</div>
                </div>
                <div id="resident-details">
                  <div id="detailssss">
                    <div class="thetype">Type</div>
                    <div class="residentialll">${property.propertyType}</div>
                  </div>
                  <div id="detailssss">
                    <div class="thetype">Location</div>
                    <div class="residentialll">${property.location}</div>
                  </div>
                  <div id="detailssss">
                    <div class="thetype">Contract</div>
                    <div class="residentialll">${
                      property.propertycategory
                    }</div>
                  </div>
                  <div id="detailssss">
                    <div class="thetype">Area</div>
                    <div class="residentialll">200</div>
                  </div>
                </div>
              </div>
            `;
              const bedlinks = document.querySelectorAll("#bedlink");

              bedlinks.forEach((bedlink) => {
                bedlink.addEventListener("click", (e) => {
                  loadBuildingDetails(e);
                });
              });
            })
            .catch((error) => {
              console.error("Error fetching image URL:", error);
            });
        });
      } else {
        properties.innerHTML = `<div style='height: 500px; width: 100%; display: flex; align-items: center; justify-content:center'>No match found</div>`;
      }
    } else {
      properties.innerHTML = "No properties found in the database.";
    }
  } catch (error) {
    console.error("Error fetching properties:", error);
    properties.innerHTML = "An error occurred while fetching data.";
  }
});
