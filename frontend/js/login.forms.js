export function openSignUp() {
    closeAllForms();
    document.getElementById("signUp").style.display = "block";
}

export function openSignIn() {
    closeAllForms();
    document.getElementById("signIn").style.display = "block";
}

export function openPasswordForm() {
    closeAllForms();
    document.getElementById("nextForm").style.display = "block";
}

export function closeAllForms() {

    document.querySelectorAll(".form-container")
        .forEach(box => box.style.display = "none");
}