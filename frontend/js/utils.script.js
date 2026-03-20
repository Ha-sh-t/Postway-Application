export const showLoader = (show) => {
    loader.style.display = show ? 'block' : 'none';
};

let popupTimer = null;

export const showPopup = (message) => {
    const popup = document.querySelector(".popup");

    popup.innerHTML = message;
    popup.style.display = "block";

    if (popupTimer) clearTimeout(popupTimer);

    popupTimer = setTimeout(() => {
        popup.innerHTML = "";
        popup.style.display = "none";
    }, 1500);
};

//url changing event listener : custom
(function() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    function dispatchUrlChange() {
        window.dispatchEvent(new Event("urlChange"));
    }

    history.pushState = function(...args) {
        const result = originalPushState.apply(this, args);
        dispatchUrlChange();
        return result;
    };

    history.replaceState = function(...args) {
        const result = originalReplaceState.apply(this, args);
        dispatchUrlChange();
        return result;
    };

    // Also detect browser back/forward
    window.addEventListener("popstate", dispatchUrlChange);
})();

export const newPostEvent = new Event('new-post-created')

//new page load event listener : custom



//close forms


