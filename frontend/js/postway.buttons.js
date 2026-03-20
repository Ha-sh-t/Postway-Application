// postway.buttons.js
import { sendPost, toggleLike } from "./postway.api.js";
import { showPopup ,newPostEvent } from "../js/utils.script.js";
import { renderLikeEffect } from "./postway.render.js";

let captionInput;
let imageInput;
let postButton;
let previewContainer;
let likeButtons;

export function initPostwayButtons() {

    captionInput = document.getElementById("caption");
    imageInput = document.getElementById("imageInput");
    console.log(imageInput);
    postButton = document.getElementById("postButton");
    previewContainer = document.getElementById("previewContainer");

    /* ---------------------------
        Enable/Disable Post Button
    ----------------------------*/
    function updatePostButton() {
        postButton.disabled = !captionInput.value.trim() && imageInput.files.length === 0;
    }
    console.log("captionInput. :",captionInput);
    captionInput.addEventListener("input", updatePostButton);
    imageInput.addEventListener("change", updatePostButton);

    /* ---------------------------
        Image Preview Handler
    ----------------------------*/
    imageInput.addEventListener("change", () => {
        console.log("image previewer called..")
        previewContainer.innerHTML = "";

        if (imageInput.files.length > 0) {
            const imgURL = URL.createObjectURL(imageInput.files[0]);

            previewContainer.innerHTML = `
                <img src="${imgURL}">
            `;
        }
    });

    /* ---------------------------
        Post Button Handler
    ----------------------------*/
    postButton.addEventListener("click", async () => {
        console.log("postButton clicked . first time")
        const formData = new FormData();
        formData.append("caption", captionInput.value);

        if (imageInput.files.length > 0) {
            formData.append("postUrl", imageInput.files[0]);
        }

        const result = await sendPost(formData);

        if (result.success) {
            captionInput.value = "";
            imageInput.value = "";
            previewContainer.innerHTML = "";
            updatePostButton();
            showPopup("Post uploaded successfully!");
            window.dispatchEvent(newPostEvent);
        } else {
            showPopup(result.error || "Something went wrong");
        }
    });


}

/*-------------------------------
Like Button
---------------------------------*/

// likeButton.addEventListener('click' , (e)=>{
//     console.log(e.target);
// });


export async function initLikeButtons() {
    const likeButtons = document.querySelectorAll(".like");

    async function handleLikeClick(event) {
        const button = event.currentTarget;
        const postId = button.dataset.id; 

        console.log("Liked post:", postId);

        const res = await toggleLike(postId);
        if (res) {
            renderLikeEffect(button);
        } else {
            console.log("error in liking...!!!");
        }
    }

    likeButtons.forEach(button => {
        button.addEventListener("click", handleLikeClick);
    });
}
