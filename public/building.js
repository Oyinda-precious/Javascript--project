import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import {
  getStorage,
  getDownloadURL,
  ref as stRef,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

document.addEventListener("DOMContentLoaded", () => {
  emailjs.init("t-QCPrKVDxtKioB44");
});

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
const buildingDets = document.getElementById("building-dets");
let imgUrl;

const buildingRef = ref(database, `properties/${buildingId}`);

onValue(buildingRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    const imageRef = stRef(storage, data.propertyPicture);
    getDownloadURL(imageRef).then((url) => {
      buildingDets.innerHTML = `
        <div>
        <div id="favorite">
         <div>
        <i class="fa-solid fa-heart"></i>
        <a href="">Favorite Properties</a>
        </div>
        <div>
        <i class="fa-solid fa-code-compare"></i>
        <a href="">Compare Properties</a>
        </div>
        </div>
           <nav>
      <div class="header">
        <div class="mainn">
          <div class="logodiv">
            <img src="../trustee prime logo.jpg" alt="" />
            <div class="prime-logoword">
              <div class="briefword">Estate Surveyors & Valuers</div>
            </div>
          </div>
          <div>
            <div id="phone-iconn"><i class="fa-solid fa-phone-volume"></i></div>
          </div>
          <div id="call-days">
            <div id="numberssss">(08025153814)</div>
            <div id="callussss">Call Us Monday To Friday</div>
          </div>
        </div>
      </div>
    </nav>           
            <div>
           <div>
           <div id="property-color">
           <div id="propertyyyyyssss">Property Name: ${data.propertyName}</div>
           </div>
            
             <div id="the-details" >                 
               <div>
              <div id="eachname">Agency</div>
              <div id="eachNameTwo">Oluyole Ibadan Branch</div>
              </div>
             <div>
             <div id="eachname"> Location </div>
             <div id="eachNameTwo"> ${data.location}</div>
            </div>
            <div>
            <div id="eachname"> Contract </div>
            <div id="eachNameTwo"> ${data.propertycategory}</div>
            </div>
            <div>
            <div id="eachname">Price</div>
            <div id="eachNameTwo">₦${formatter.format(data.price)}</div>
             </div>
            </div>
           
          
        </div>
        </div>
           
        <div id="image-details">
       
        <div id="separate">
       
          <img id="estateimage" src='${url}'/>
          
            <p id="confirmationMessage"></p>
          <div id="form">
          <div id="information">Enquiry Form</div>
          <div>
           <form id="enquiry-form">
          <label for="name">FULL NAME</label>
          <input type="text" id="name" name="name" required />

          <label for="email">E-MAIL</label>
          <input type="email" id="email" name="email" required />

          <label for="mobile">MOBILE NUMBER</label>
          <input type="tel" id="mobile" name="mobile" required />

          <label for="subject">SUBJECT</label>
          <input type="text" id="subject" name="subject" required />

          <label for="message">MESSAGE</label>
          <textarea id="message" name="message" rows="4" required></textarea>

          <button type="submit" id="submit-btn">Submit</button>
          </form>
           
          </div>
          <div id="contactt">
          <div id="contact-div">
             <div>Contact</div>
             <div>
             <a href=""  id="envelopee"><i class="fa-solid fa-envelope"></i></a>
             
             </div>   
          </div>
           <div id="phone-contact">
           <i class="fa-solid fa-phone-volume"></i>
         <div>08025153814</div>  
         </div>
           
          </div>
          </div>
          
        </div>
         <div id="whole-properties">
            <div id="attributes">Property Attributes</div>
             <div id="property-detailsss">
        <div>Office ID</div>
        <div id="sub-details">LTT|OYO|369|537|2</div>
      </div>
      <div id="property-detailsss">
        <div>Price</div>
        
        <div id="sub-details">N${data.price} </div>
      </div>
      <div id="property-detailsss">
        <div>Location</div>
        <div id="sub-details">${data.location}</div>
      </div>
      <div id="property-detailsss">
        <div>Status</div>
        <div id="sub-details">Available</div>
      </div>
      <div id="property-detailsss">
        <div>Bedroom</div>
        <div id="sub-details">${data.bedroomQty}</div>
      </div>
      <div id="property-detailsss">
        <div>Bathroom</div>
        <div id="sub-details">${data.bathroomQty}</div>
      </div>
          </div>
            
           </div>
           
    `;
      document
        .getElementById("enquiry-form")
        .addEventListener("submit", function (event) {
          event.preventDefault();
          // these IDs from the previous steps
          emailjs.sendForm("service_00dusdh", "template_bksiatp", this).then(
            () => {
              document.getElementById("confirmationMessage").textContent =
                alert("Thank you for your inquiry!");
              console.log("SUCCESS!");
            },

            (error) => {
              document.getElementById("confirmationMessage").textContent =
                alert("Failed to send your inquiry.");
              console.log("FAILED...", error);
            }
          );
          const userEmail = this.querySelector("input[name='email']").value; // Get user's email
          const userName = this.querySelector("input[name='name']").value; // Get user's name

          // var templateParams = {
          //   name: "James",
          //   notes: "Check this out!",
          // };

          emailjs
            .send("service_00dusdh", "template_qg35f8g", {
              name: userName,
              email: userEmail, // Use the user's email to send the response
            })
            .then(
              (response) => {
                console.log("SUCCESS!", response.status, response.text);
                alert(
                  "Thank you for your inquiry! A confirmation email has been sent to your inbox."
                );
                document.getElementById("enquiry-form").reset();
              },
              // Clear the form fields

              (error) => {
                console.log("FAILED...", error);
                alert("Failed to send a confirmation email to the user.");
              }
            );
        });
    });
  }
});

// emailjs.init("t-QCPrKVDxtKioB44");

// const submitForm = (e) => {
//   e.preventDefault();

//   const name = document.getElementById("name").value;
//   const email = document.getElementById("email").value;
//   const mobile = document.getElementById("mobile").value;
//   const subject = document.getElementById("subject").value;
//   const message = document.getElementById("message").value;

//   const inquiryRef = push(ref(database, "inquiries"));
//   const inquiryId = inquiryRef.key;

//   // Save inquiry details to Firebase
//   set(inquiryRef, {
//     id: inquiryId,
//     name,
//     email,
//     mobile,
//     subject,
//     message,
//     status: "Pending",
//   });

//   // Send Email to Admin using EmailJS
//   const templateParams = {
//     name: name, // User's name
//     from_email: email, // Sender's email
//     mobile: mobile,
//     subject: subject,
//     message: message,
//   };

//   emailjs
//     .send("service_00dusdh", "template_bksiatp", templateParams)
//     .then(() => {
//       document.getElementById("confirmationMessage").textContent = alert(
//         "Thank you for your inquiry!"
//       );
//     })
//     .catch((error) => {
//       console.error("Error sending email:", error);
//       document.getElementById("confirmationMessage").textContent = alert(
//         "Failed to send your inquiry."
//       );
//     });

//   // Clear the form
//   // document
//   //   .getElementById("enquiry-form")
//   //   .reset()
//   //   .catch((error) => {
//   //     console.error("Error saving inquiry to Firebase:", error);
//   //   });
// };

// const submitForm = async (e) => {
//   e.preventDefault();

//   const fullName = document.getElementById("name").value;
//   const email = document.getElementById("email").value;
//   const phone = document.getElementById("mobile").value;
//   const subject = document.getElementById("subject").value;
//   const message = document.getElementById("message").value;

//   if (!fullName || !email || !phone || !subject || !message) {
//     alert("fill all inputs");

//     return;
//   }

//   const templateParams = {
//     fullName: fullName,
//     email: email,
//     phone: phone,
//     subject: subject,
//     message: message,
//   };

//   try {
//     // Send email
//     const response = await emailjs.send(
//       "service_00dusdh",
//       "template_bksiatp",
//       templateParams
//     );
//     console.log("Email sent successfully:", response);
//     alert("email sent");
//     document.getElementById("confirmationMessage").textContent =
//       "Thank you for your inquiry!";

//     // Show message to the user
//     document.getElementById("inquiryMessage").textContent =
//       "Thank you for your inquiry! We will get back to you shortly.";
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };
