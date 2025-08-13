// js/auth-guard.js
const loader = document.getElementById('loader');

auth.onAuthStateChanged(user => {
    const currentPage = window.location.pathname.split('/').pop();

    if (user) {
        // User is logged in
        if (currentPage === 'login.html') {
            // If on login page, redirect to dashboard
            window.location.replace('index.html');
        } else {
            // User is logged in and on a protected page, hide loader
            if(loader) loader.style.display = 'none';
        }
    } else {
        // User is not logged in
        if (currentPage !== 'login.html') {
            // If not on login page, redirect there
            window.location.replace('login.html');
        } else {
            // User is on the login page, hide loader
            if(loader) loader.style.display = 'none';
        }
    }
});
