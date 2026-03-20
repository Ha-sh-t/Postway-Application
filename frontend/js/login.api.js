// login.api.js
import { setQuery, redirectTo } from "./router.js";
import { showLoader, showPopup } from "./utils.script.js";
import { openPasswordForm, openSignIn, openSignUp } from "./login.forms.js";

/* ------------------------------------------
   API: SIGNUP (Register a new account)
--------------------------------------------*/
export async function apiRegister(json) {
    try {
        showLoader(true);

        const res = await fetch("http://localhost:3000/api/users/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(json)
        });

        const data = await res.json();
        showLoader(false);

        if (data.success) {
            showPopup("Registration successful!");
            setQuery({ form: "signin" });
            openSignIn();
            return { ok: true };
        }

        showPopup(data.message || "Signup failed");
        return { ok: false };

    } catch (err) {
        showLoader(false);
        showPopup(err.message);
        return { ok: false };
    }
}

/* ------------------------------------------
   API: VERIFY EMAIL (Next button)
--------------------------------------------*/
export async function apiVerifyEmail(json) {
    try {
        showLoader(true);

        const res = await fetch("http://localhost:3000/api/users/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(json)
        });

        const data = await res.json();
        console.log("verify email : " , data);
        showLoader(false);

        if (data.message?.includes("Email Verified")) {
            showPopup("Email is verified");
            localStorage.setItem("email", json.email);
            // openPasswordForm();
            setQuery({ form: "password" });
            return { ok: true };
        }

        showPopup(data.message || "Invalid Email");
        return { ok: false };

    } catch (err) {
        showLoader(false);
        showPopup(err.message);
        return { ok: false };
    }
}

/* ------------------------------------------
   API: LOGIN (Password submit)
--------------------------------------------*/
export async function apiLogin(json) {
    try {
        showLoader(true);

        const res = await fetch("http://localhost:3000/api/users/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(json)
        });

        const data = await res.json();
        showLoader(false);

        if (data.message?.includes("Login successful")) {
            // SESSION CREATED ✔️
            localStorage.setItem("name", data.user.name);
            localStorage.setItem("email", data.user.email);
            localStorage.setItem("userId" , data.user._id);
            redirectTo("/frontend/html/postway.html"); // landing
            return { ok: true };
        }

        showPopup(data.message || "Login failed");
        return { ok: false };

    } catch (err) {
        showLoader(false);
        showPopup(err.message);
        return { ok: false };
    }
}