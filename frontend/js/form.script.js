import { openNextForm, close } from "./login.script.js";
import { showLoader } from "./utils.script.js";
const register = document.querySelector('#register');
const loader = document.querySelector('#loader');
const popup = document.querySelector('.popup');
const nextButton = document.querySelector('#next-button');
const loginButton = document.querySelector('#login-button');




const openPopup = (message) => {
  popup.style.display = 'block';
  popup.innerHTML = message;
};

const closePopup = () => {
  setTimeout(() => {
    popup.style.display = 'none';
    popup.innerHTML = '';
  }, 2000);
};

const clickCloseButton = () => {
  const closeBtn = document.querySelector('.close-button');
  if (closeBtn) closeBtn.click();
};

/* 🔹 Register Handler */
const registerHandler = async (event) => {
  event.preventDefault();
  console.log("Register button clicked");

  const form = document.getElementById("registerForm");
  const formData = new FormData(form);
  const jsonObject = Object.fromEntries(formData.entries());

  try {
    showLoader(true);

    const res = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(jsonObject)
    });

    const data = await res.json();
    showLoader(false);

    if (res.ok) {
      clickCloseButton();
      openPopup(data.message || "Signup successful!");
      closePopup();
      openNextForm(); // 
    } else {
      openPopup(data.error || "Signup failed");
      closePopup();
    }

  } catch (error) {
    showLoader(false);
    openPopup(error.message || "Something went wrong!");
    closePopup();
    console.error('Error:', error);
  }
};

/* 🔹 Sign In Handler */
const handleSignIn = async (event) => {
  event.preventDefault();
  let form = null;
  let formData = null;

  if (event.target.id === 'login-button') {
    form = document.getElementById("passwordform");
    form.elements['email'].disabled = false;
    formData = new FormData(form);
    form.elements['email'].disabled = true;
  } else {
    form = document.getElementById("signInform");
    formData = new FormData(form);
  }

  const jsonObject = Object.fromEntries(formData.entries());

  try {
    showLoader(true);

    const res = await fetch('http://localhost:3000/api/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(jsonObject)
    });

    const data = await res.json();
    showLoader(false);

    if (res.ok) {
      if (data.success) {
        clickCloseButton();
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("name", data.user.name);
        window.location.href = '/frontend/html/postway.html';
      } else if (data.message) {
        openPopup(data.message);
        closePopup();
      } else {
        clickCloseButton();
        openPopup("Email verified.");
        closePopup();
        localStorage.setItem('email', jsonObject.email);
        openNextForm();
      }
    } else {
      openPopup(data.message || "Invalid email!");
      closePopup();
    }
  } catch (error) {
    showLoader(false);
    openPopup("Something went wrong!");
    closePopup();
    console.error(error);
  }
};

/* Next Button Handler */
const handleNextButtonClick = async (event) => {
  event.preventDefault();
  const form = document.getElementById('emailForm');
  const formData = new FormData(form);
  const jsonObject = Object.fromEntries(formData.entries());

  showLoader(true);
  try {
    const res = await fetch('http://localhost:3000/api/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(jsonObject)
    });

    const data = await res.json();
    console.log("received data from backend: " , data)
    showLoader(false);

    if (data.message && data.message.includes("Email Verified")) {
      console.log("jsonObject.email : " , jsonObject.email)
      localStorage.setItem('email', jsonObject.email);
      console.log(localStorage.getItem('email'));
      form.reset();
      close();
      openNextForm();
      return;
    }
    throw new Error(data.message);

  } catch (err) {
    showLoader(false);
    openPopup(err.message || "Something went wrong!");
    closePopup();
    console.error("Error", err);
  }
};

const handleLoginButtonClick = async (event) => {
  event.preventDefault();
  const form = document.getElementById('passwordForm');
  const formData = new FormData(form);
  const jsonObject = Object.fromEntries(formData.entries());
  jsonObject.email = localStorage.getItem("email");
      console.log("jsonObject.email : " , jsonObject.email)
      console.log("jsonObject.password : " , jsonObject.password)
  showLoader(true);
  try {
    const res = await fetch('http://localhost:3000/api/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(jsonObject)
    });

    const data = await res.json();
    console.log("received data from backend: " , data)
    showLoader(false);

    if (data.message && data.message.includes("Login successful")) {
      form.reset();
      close();
      const data = await fetchLandingPageData();
      openLandingPage(data);
      return;
    }
    throw new Error(data.message);

  } catch (err) {
    showLoader(false);
    openPopup(err.message || "Something went wrong!");
    closePopup();
    console.error("Error", err);
  }
};
/*Event Listeners */
register.addEventListener('click', registerHandler);
nextButton.addEventListener('click', handleNextButtonClick);
loginButton.addEventListener('click', handleLoginButtonClick);