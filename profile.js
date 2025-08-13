// js/profile.js
document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;

    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            loadProfileData(user);
        }
    });

    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (currentUser) {
            updateProfile(currentUser);
        }
    });
     const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut();
        });
    }
});

function loadProfileData(user) {
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const yearSelect = document.getElementById('profile-year');

    emailInput.value = user.email; // Email from Auth

    // Get name and year from Firestore
    db.collection('users').doc(user.uid).get().then(doc => {
        if (doc.exists) {
            const data = doc.data();
            nameInput.value = data.name;
            yearSelect.value = data.academicYear;
        }
    });
}

function updateProfile(user) {
    const name = document.getElementById('profile-name').value;
    const academicYear = document.getElementById('profile-year').value;
    const saveButton = document.querySelector('#profile-form button');
    
    saveButton.textContent = 'Updating...';
    saveButton.disabled = true;

    db.collection('users').doc(user.uid).update({
        name: name,
        academicYear: academicYear
    }).then(() => {
        alert('Profile updated successfully!');
        saveButton.textContent = 'Update Profile';
        saveButton.disabled = false;
    }).catch(error => {
        alert('Error updating profile: ' + error.message);
        saveButton.textContent = 'Update Profile';
        saveButton.disabled = false;
    });
}