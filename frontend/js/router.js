import { closeAllForms } from './login.forms.js';
import { handleLoginURLState } from './login.router.js'
import {handlePostwayURLState} from './postway.script.js'

/* --------------------------------------------------------
 Patch pushState & replaceState to emit "url-change"
-----------------------------------------------------------*/
const urlChangeEvent = new Event("url-change");

(function patchHistory() {
    const originalPush = history.pushState;
    const originalReplace = history.replaceState;

    history.pushState = function (...args) {
        const x = originalPush.apply(this, args);
        window.dispatchEvent(urlChangeEvent);
        return x;
    };

    history.replaceState = function (...args) {
        const x = originalReplace.apply(this, args);
        window.dispatchEvent(urlChangeEvent);
        return x;
    };
})();


/* ----------------------------------
    Helpers
-------------------------------------*/
export function goto(path) {
    history.replaceState(null, "", path);
}

export function setQuery(params) {
    const url = new URL(location.href);

    Object.entries(params).forEach(([key, val]) => {
        if (val === null || val === undefined) {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, val);
        }
    });

    history.replaceState(null, "", url.toString());
}

export function redirectTo(url, replace = true) {
    if (replace) window.location.replace(url);
    else window.location.href = url;
}

export function getQueryParam(key) {
    return new URL(location.href).searchParams.get(key);
}

function getCurrentPath() {
    return location.pathname;
}



/* ----------------------------------
Page Restriction and Helper functions
-------------------------------------*/
export async function checkAuthentication() {
    try {
        const res = await fetch("http://localhost:3000/api/users/check-session", {
            credentials: "include"
        });
        if (!res.ok) { return false; }
        return true;

    } catch (err) {
        const msg = encodeURIComponent(err.message);
        // redirectTo(`/frontend/html/error.html?error=${msg}`);
    }
}


/* ----------------------------------
Route Handling
-------------------------------------*/
export async function isLogin(){
    const path = getCurrentPath();
    const loggedIn = await checkAuthentication();
    return loggedIn;
}



