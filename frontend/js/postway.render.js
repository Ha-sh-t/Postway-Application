import { initLikeButtons } from "./postway.buttons.js";


export function renderPosts(posts, users, likes) {
    const container = document.querySelector(".containerRight");
    if (!container) return;

    container.innerHTML = "";

    if (!posts || posts.length === 0) {
        container.innerHTML = `<p class="no-post">No posts yet.</p>`;
        return;
    }

    posts.forEach((post , index)=> {

        //find matching user
        const user = users.find(u => u._id == post.userId);
        console.log("rendering : among = ",users,"the only",user);
        //check if logged user liked post
        const liked = likes ?likes.some(like => like.itemId === post._id):false;

        const html = `
<div class="tweet">
    <div class="tweet-header">
        <img class="avatar" src="${user?.avatarUrl || '../media/boy.png'}">

        <div class="tweet-user">
            <span class="name">${user?.name || "User"}</span>
            <span class="username">@${user?.email}</span>
        </div>
    </div>

    <div class="tweet-content">
        <p>${post.caption}</p>
    </div>

    ${post.postUrl ? `
    <div class="tweet-media">
        <img src="${post.postUrl}">
    </div>` : ""}

    <div class="tweet-footer">
        <div class="icon comments">${post.comments}</div>

        <div id="${index}"  class="like icon  ${liked ? "liked" : "not-liked"}" data-id="${post._id}" >
            ${post.likes} 
        </div>
    </div>
</div>
`;
        container.insertAdjacentHTML("beforeend", html);
    });
    
    initLikeButtons();

}

export function renderPagination(currentPage, totalPages) {
    const footer = document.querySelector(".pagination");
    footer.innerHTML = "";

    let html = "";

    //Prev
    html += `<button class="page-btn prev" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>Prev</button>`;

    //Pages 1, 2, 3
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button 
                class="page-btn ${i === currentPage ? "active" : ""}" 
                data-page="${i}">
                ${i}
            </button>`;
    }

    // Next
    html += `<button class="page-btn next" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>Next</button>`;

    footer.innerHTML = html;
}

export function renderLikeEffect(button) {
    const classes = [...button.classList];
    const oldClass = classes.includes("liked") ? "liked" : "not-liked";
    const newClass = oldClass === "liked" ? "not-liked" : "liked";
    button.classList.replace(oldClass, newClass);
}