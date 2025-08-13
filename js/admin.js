// js/admin.js
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is an admin
    auth.onAuthStateChanged(user => {
        if (user) {
            db.collection('users').doc(user.uid).get().then(doc => {
                if (!doc.exists || doc.data().role !== 'admin') {
                    alert('Access Denied. You are not an admin.');
                    window.location.replace('index.html');
                } else {
                    // User is an admin, load the content
                    loadExistingContent();
                }
            });
        }
    });

    const uploadForm = document.getElementById('upload-form');
    uploadForm.addEventListener('submit', handleUpload);
});

async function loadExistingContent() {
    const tableBody = document.getElementById('content-table-body');
    tableBody.innerHTML = '<tr><td colspan="4">Loading content...</td></tr>';

    const snapshot = await db.collection('content').orderBy('createdAt', 'desc').get();
    
    if (snapshot.empty) {
        tableBody.innerHTML = '<tr><td colspan="4">No content has been uploaded yet.</td></tr>';
        return;
    }

    tableBody.innerHTML = '';
    snapshot.forEach(doc => {
        const content = doc.data();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${content.title}</td>
            <td>${content.type}</td>
            <td>${content.academicYear}</td>
            <td>
                <a href="#" class="delete-btn" data-id="${doc.id}" data-filename="${content.fileName}" data-year="${content.academicYear}">Delete</a>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

function handleUpload(e) {
    e.preventDefault();
    const form = e.target;
    // (Rest of the upload logic from the previous response remains the same)
    // ... file selection, storageRef, uploadTask ...
}

async function handleDelete(e) {
    e.preventDefault();
    const docId = e.target.dataset.id;
    const fileName = e.target.dataset.filename;
    const academicYear = e.target.dataset.year;
    
    if (!confirm(`Are you sure you want to delete this item? This cannot be undone.`)) {
        return;
    }

    try {
        // 1. Delete Firestore document
        await db.collection('content').doc(docId).delete();
        
        // 2. Delete file from Storage
        const fileRef = storage.ref(`content/${academicYear}/${fileName}`);
        await fileRef.delete();
        
        alert('Content deleted successfully!');
        loadExistingContent(); // Refresh the table
    } catch (error) {
        console.error("Error deleting content:", error);
        alert('Failed to delete content. See console for details.');
    }
}
// Paste the 'handleUpload' function from the previous response here, unchanged.
function handleUpload(e) {
    e.preventDefault();

    const form = document.getElementById('upload-form');
    const contentType = form['content-type'].value;
    const title = form.title.value;
    const academicYear = form['academic-year-admin'].value;
    const description = form.description.value;
    const file = form['content-file'].files[0];
    const progressDiv = document.getElementById('upload-progress');

    if (!file) {
        alert('Please select a file to upload.');
        return;
    }
    
    progressDiv.style.display = 'block';

    const storageRef = storage.ref(`content/${academicYear}/${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressDiv.textContent = `Uploading: ${Math.round(progress)}%`;
        },
        (error) => {
            console.error("Upload failed:", error);
            alert('File upload failed!');
            progressDiv.style.display = 'none';
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                db.collection('content').add({
                    title: title,
                    description: description,
                    type: contentType,
                    academicYear: academicYear,
                    fileURL: downloadURL,
                    fileName: file.name,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    alert('Content uploaded successfully!');
                    form.reset();
                    progressDiv.style.display = 'none';
                    loadExistingContent(); // Refresh the table
                });
            });
        }
    );
}
