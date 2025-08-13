// js/script.js
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut();
        });
    }

    auth.onAuthStateChanged(user => {
        if (user) {
            loadUserData(user);
            loadLatestContent();
        }
    });
});

function loadUserData(user) {
    db.collection('users').doc(user.uid).get().then(doc => {
        if (doc.exists) {
            const userData = doc.data();
            document.getElementById('welcome-message').textContent = `Welcome Back, ${userData.name}!`;
            document.getElementById('year-display').textContent = `${userData.academicYear}${getYearSuffix(userData.academicYear)} Year`;
        }
    });
}

function getYearSuffix(year) {
    if (year == 1) return 'st';
    if (year == 2) return 'nd';
    if (year == 3) return 'rd';
    return 'th';
}

async function loadLatestContent() {
    const noticeList = document.getElementById('notice-list');
    noticeList.innerHTML = '<li>Loading...</li>';
    
    // Fetch latest 5 items (notices or any other type) for all years
    const query = db.collection('content').orderBy('createdAt', 'desc').limit(5);
    
    try {
        const snapshot = await query.get();
        if (snapshot.empty) {
            noticeList.innerHTML = '<li>No recent updates found.</li>';
            return;
        }
        
        noticeList.innerHTML = ''; // Clear loader
        snapshot.forEach(doc => {
            const content = doc.data();
            const item = document.createElement('li');
            item.innerHTML = `
                <a href="${content.fileURL}" target="_blank">
                    <strong>[${content.type}] ${content.title}</strong>
                    <p>${content.description}</p>
                    <span class="date">${content.createdAt.toDate().toLocaleDateString()}</span>
                </a>
            `;
            noticeList.appendChild(item);
        });
    } catch (error) {
        console.error("Error loading latest content:", error);
        noticeList.innerHTML = '<li>Error loading content.</li>';
    }
}