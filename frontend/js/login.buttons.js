import { apiRegister, apiVerifyEmail, apiLogin } from "./login.api.js";
import { setQuery } from "./router.js";
import { openSignUp, openSignIn, openPasswordForm, closeAllForms } from "./login.forms.js";

export function initLoginButtons() {

    // SIGNUP BUTTON
    document.querySelector(".sign-up")?.addEventListener("click", () => {
        // openSignUp();
        setQuery({ form: "signup" });
    });

    // SIGNIN BUTTON
    document.querySelector(".sign-in")?.addEventListener("click", () => {
        // openSignIn();
        setQuery({ form: "signin" });
    });

    // CLOSE FORM BUTTONS
    document.querySelectorAll(".close-button img").forEach(btn => {
        btn.addEventListener("click", () => {
            closeAllForms();
            setQuery({ form: null });
        });
    });

    // 🔹 NEXT BUTTON → Verify Email
    document.getElementById("next-button")?.addEventListener("click", async () => {
        const email = document.getElementById("email1").value.trim();
        if (!email) return showPopup("Enter your email");

        await apiVerifyEmail({ email });
    });

    // 🔹 REGISTER BUTTON
    document.getElementById("register")?.addEventListener("click", async () => {
        const form = document.getElementById("registerForm");
        const json = Object.fromEntries(new FormData(form).entries());
        await apiRegister(json);
    });

    // 🔹 LOGIN BUTTON
    document.getElementById("login-button")?.addEventListener("click", async () => {
        const form = document.getElementById("passwordForm");
        const json = Object.fromEntries(new FormData(form).entries());
        json.email = localStorage.getItem("email");

        await apiLogin(json);
    });
}