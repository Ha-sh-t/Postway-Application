// postway.api.js
import { renderPosts  , renderLikeEffect} from "./postway.render.js";
export async function sendPost(formData) {
    try {
        console.log("send Post Data called.")
        const res = await fetch("http://localhost:3000/api/posts", {
            method: "POST",
            credentials: "include",
            body: formData
        });

        const data = await res.json();
        return data;
    } catch (err) {
        return { success: false, error: err.message };
    }
}

export async function fetchPosts(page = 1) {
    try {
        console.log("fetching posts...")
        const res = await fetch(`http://localhost:3000/api/posts/all?page=${page}`, {
            credentials: "include"
        });
        console.log("posts fetched.")
        return await res.json();
    } catch (err) {
        console.error("Fetch error:", err);
        return { success: false };
    }
}
export async function loadLatestPosts() {
    try {
        return await fetchPosts(page = 1);

    } catch (err) {
        console.error("Error loading posts:", err);
    }
}

export async function fetchUsers(){
    try{
        console.log("fetching users ...");
        const res = await fetch("http://localhost:3000/api/users/get-all-details",{
            credentials:"include"
        });
        console.log("user fetched ...");
        //res -> json
        // console.log("fetch Users :" , typeof(res))
        const data = await res.json();
        // console.log("fetchUsers :" , data.users);
        if(data.success){
            return data.users;//returning array of users : {userId , name}
        }
    }catch(err){
        console.log("Error loading posts:",err);
    }
}

export async function fetchLikes(id){
    try{
        const res = await fetch(`http://localhost:3000/api/likes/${id}`,{
            credentials:"include"
        }) //id: userId||commentId||postId
        const data = await res.json();
        if(data.success){
            return data.likes;
        }
        console.log("Failed to fetch likes " , data);
    }catch(err){
        console.log("Error while fetching :",err);
    }
}

export async function toggleLike(id) {
    try {
        const res = await fetch(`http://localhost:3000/api/likes/toggle/${id}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        console.log("toggle data : " , data);
        if (res.ok && data.success) {
            return true;
        }

        console.error("Toggle like error:", data.message || data);
        return false;

    } catch (err) {
        console.error("Network error:", err.message);
        return false;
    }
}