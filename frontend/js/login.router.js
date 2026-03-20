// login.router.js

import { getQueryParam, redirectTo} from "./router.js";
import { openSignUp, openSignIn, closeAllForms,openPasswordForm } from "./login.forms.js";


export function handleLoginURLState() {
    console.log("handleLogin called")
    const param = getQueryParam("form");

    switch(param) {
        case "signup": localStorage.clear();openSignUp(); break;
        case "signin": localStorage.clear();openSignIn(); break;
        case "password": openPasswordForm(); break;
        case null: localStorage.clear();
        console.log("null state calling...")
            closeAllForms();
            break;
        default:
            redirectTo("./error.html?code=404&error=Invalid URL" );
    }
}

window.addEventListener('urlChange' , handleLoginURLState);
window.addEventListener('DOMContentLoaded' , handleLoginURLState)

