// login page 
const signIn_button = document.getElementsByClassName('sign-in')[0];
const signUp_button = document.getElementsByClassName('sign-up')[0];
const close_button = document.querySelectorAll('.close-button');


//event handlers ------

// Save original references before overwriting
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function (state, title, url) {
    const urlChange = new Event('urlChange');
    const result = originalPushState.apply(this, arguments);
    window.dispatchEvent(urlChange);
    return result;
};

history.replaceState = function (state, title, url) {
    const urlChange = new Event('urlChange');
    const result = originalReplaceState.apply(this, arguments);
    window.dispatchEvent(urlChange);
    return result;
};

const handleSignInButtonClick = () => {
    console.log("signin button clicked")
    history.replaceState(null, '', '?form=signin');
}
const handleSignUpButtonClick = () => {
    history.replaceState(null, '', '?form=signup');
}

//form handlers--
const openSignUpform = (event) => {
    if (event) event.preventDefault();
    document.querySelector('.overlay').style.display = 'block';
    const form = document.querySelector('#signUp');
    form.style.display = 'flex';

}

const openSignInform = (event) => {
    if (event) event.preventDefault();//prevent default behavior i.e auto submission
    document.querySelector('.overlay').style.display = 'block';
    const form = document.querySelector('#signIn');
    form.style.display = 'flex';

}

export const openNextForm = () => {
    document.querySelector('.overlay').style.display = 'block';
    const formContainer = document.querySelector('#nextForm');
    const form = document.querySelector('#passwordForm')
    form.elements['email'].value = localStorage.getItem('email');
    console.log(localStorage.getItem('email'))
    form.elements['email'].disabled = true
    formContainer.style.display = 'flex';

}


export const close = () => {
    document.querySelector('.overlay').style.display = 'none';
    const forms = document.getElementsByClassName('form-container');
    Array.from(forms).forEach(formContainer => {
        const id = formContainer.dataset.formid;
        // document.getElementById(id).reset();
        // console.log(formContainer)

        formContainer.style.display = 'none';
    });
    // localStorage.clear()
    history.pushState(null, '', '/frontend/html/login.html')


};




// Adding event listeners

signIn_button.addEventListener("click", handleSignInButtonClick);
signUp_button.addEventListener("click", handleSignUpButtonClick);
close_button.forEach(button => { button.addEventListener('click', close); })
document.querySelector('.overlay').addEventListener('click', close);



//handling page loading

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('form') === 'signin') {
        openSignInform()
    }
    else if (params.get('form') === 'signup') {
        openSignUpform()
    }
    else {
        close()

    }
});

window.addEventListener('urlChange', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('form') === 'signin') {
        openSignInform();
    }
    else if (params.get('form') === 'signup') {
        openSignUpform();
    }
    else {
        console.log(params);
        

    }
})

//backward - forward buttons
window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    console.log(window.location.href);

    if (params.get('form') === 'signin') {
        console.log("signin popstate called");
        close()
        openSignInform();
    }
    else if (params.get('form') === 'signup') {
        console.log("signup popstate called");
        close()
        openSignUpform()
    }
    else {
        console.log("close called ")
        close()
    }
})


