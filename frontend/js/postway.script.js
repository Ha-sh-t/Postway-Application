import { fetchLikes, fetchPosts, fetchUsers } from "./postway.api.js";
import { renderPosts, renderPagination } from "./postway.render.js";
import { currentPage, setPage, totalPages } from "./pagination.js";
import { loadLatestPosts } from "./postway.api.js";
    import {initPostwayButtons } from "../js/postway.buttons.js"


export async function handlePostwayURLState() {
    console.log("postway route called");

    // fetch posts when page loads
    await loadPage(1);
    attachPaginationEvents();
    initPostwayButtons();   // setup buttons + events

    // fetch again when new post is created
    // window.addEventListener("new-post-created", () => {
    //     loadLatestPosts();
    // });
}


export async function loadPage(pageNum) {
    setPage(pageNum);

    const data = await fetchPosts(pageNum);
    const users = await fetchUsers();
    const userId = localStorage.getItem("userId");//logged in userId
    const likes = await fetchLikes(userId);
    console.log("data of page 1:",data);
    if (data.success) {
        if(data.posts.length == 0) return;
         renderPosts(data.posts , users);
         renderPagination(pageNum, totalPages);
    }else{
        console.log(data.message);
    }
}

 function attachPaginationEvents() {
        console.log("attach Pagination Events...")

    document.body.addEventListener("click", async (e) => {
        // console.log("attach Pagination Events...")
        if (!e.target.classList.contains("page-btn")){return;}

        const page = Number(e.target.dataset.page);
        await loadPage(page);
    });
}

// window.addEventListener('DOMContentLoaded',handlePostwayURLState);