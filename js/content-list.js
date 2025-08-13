// js/content-list.js
document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            const params = new URLSearchParams(window.location.search);
            const contentType = params.get('type');
            
            if (contentType) {
                document.getElementById('content-title').textContent = contentType + 's'; // e.g., "Class Lectures"
                loadContent(user, contentType);
            } else {
                document.getElementById('content-title').textContent = 'Invalid Content Type';
            }
        }
    });
     const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut();
        });
    }
});

async function loadContent(user, contentType) {
    const container = document.getElementById('content-list-container');
    container.innerHTML = '<div class="loader"></div>';

    // Get user's academic year
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (!userDoc.exists) {
        container.innerHTML = '<p>Error: Could not find user data.</p>';
        return;
    }
    const academicYear = userDoc.data().academicYear;

    // Query Firestore for content matching the type AND the user's year (or 'all' years)
    // NOTE: Firebase may require you to create a composite index for this query.
    // The error message in the browser console will provide a direct link to create it.
    const query = db.collection('content')
                    .where('type', '==', contentType)
                    .where('academicYear', 'in', [academicYear, 'all'])
                    .orderBy('createdAt', 'desc');

    try {
        const snapshot = await query.get();
        if (snapshot.empty) {
            container.innerHTML = `<p>No ${contentType}s found for your academic year.</p>`;
            return;
        }

        container.innerHTML = ''; // Clear loader
        snapshot.forEach(doc => {
            const content = doc.data();
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
                <div class="item-info">
                    <h4>${content.title}</h4>
                    <p>${content.description || 'No description available'}</p>
                </div>
                <a href="${content.fileURL}" target="_blank" class="btn btn-primary">View</a>
            `;
            container.appendChild(item);
        });
    } catch (error) {
        console.error("Error fetching content:", error);
        container.innerHTML = `<p>Error loading content. Please check the console for details.</p><p>You might need to create a Firestore index.</p>`;
    }
}
