// js/login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = loginForm.name.value;
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        const academicYear = loginForm['academic-year'].value;

        // Try to log in first
        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                window.location.href = 'index.html';
            })
            .catch(error => {
                // If login fails, check if it's because the user doesn't exist
                if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
                    // This is likely a registration attempt
                    if (!name) {
                        alert('Please provide your full name to register.');
                        return;
                    }
                    auth.createUserWithEmailAndPassword(email, password)
                        .then(userCredential => {
                            const user = userCredential.user;
                            return db.collection('users').doc(user.uid).set({
                                name: name,
                                email: email,
                                academicYear: academicYear,
                                role: 'student'
                            });
                        })
                        .then(() => {
                            window.location.href = 'index.html';
                        })
                        .catch(regError => {
                            alert('Registration failed: ' + regError.message);
                        });
                } else {
                    alert('Login failed: ' + error.message);
                }
            });
    });
});