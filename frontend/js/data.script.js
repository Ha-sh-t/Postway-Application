import { showLoader } from "./utils.script"

const fetchLandingPageData = async ()=>{
    showLoader(true);
    const allPosts = await fetch('http://localhost:3000/api/posts/all',{
        method:'GET',
        headers:{'Content-Type':'application/json'},
        credentials:'include',
    });
    const currUser = await fetch('http://localhost:3000/api/users/get-details/:userId' ,{
        method:'GET',
        credentials:'include'
    })
    const otherUsers = await fetch('http://localhost:3000/api/users/get-all-details'{
        method:'GET',
        credentials:'include'
    })

    showLoader(false);
    return {allPosts , currUser , otherUsers};

    
}