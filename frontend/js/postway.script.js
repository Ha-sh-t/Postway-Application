const userId = document.getElementById('userId');
const handlePageLoading = async ()=>{
    console.log("handlePageLoading called")
    try{
        const url = window.location.href;
        console.log(url)
        if(url.includes("postway.html")){
            const res = await fetch('http://localhost:3000/api/post/all/1' ,{
                method:'GET',
                credentials:'include'
            })
            if(!res.ok){
                console.log(localStorage.getItem('user'))
                console.log("need to redirect");
                const error = await res.json();
                throw new Error(error)
            }
            console.log(userId.children[0]);
            userId.children[1].innerHTML = localStorage.getItem('name');
            const data = await res.json();
            console.log("data : ",data);
        }
    }
    catch(err){
        console.error(err)
    }

}


//page loading
window.addEventListener('DOMContentLoaded',handlePageLoading);