const userGrid = document.getElementById('userGrid');
const viewToggleBtn = document.getElementById('viewToggleBtn');
const deleteIdInput = document.getElementById('deleteIdInput');
const deleteBtn = document.getElementById('deleteBtn');
const sortByGroupBtn = document.getElementById('sortByGroupBtn');
const sortByIdBtn = document.getElementById('sortByIdBtn');

let users = [];

const API_BASE = 'https://69a23923be843d692bd10398.mockapi.io/users_api'; 

// render function that populates userGrid using a template
function render(list) {
    if (!Array.isArray(list) || list.length === 0) {
        userGrid.textContent = 'No users loaded.';
        return;
    }

    // clear any existing content
    userGrid.innerHTML = '';

    list.forEach(user => {
        const article = document.createElement('article');
        article.className = 'user-card';
        article.dataset.id = user.id;
        article.dataset.group = user.user_group;
        article.innerHTML = `
            <h3>${user.first_name ?? ''}</h3>
            <p>first_name: ${user.first_name ?? ''}</p>
            <p>user_group: ${user.user_group ?? ''}</p>
            <p>id: ${user.id ?? ''}</p>
        `;
        userGrid.appendChild(article);
    });
}

// fetch data from API and populate users array
async function retrieveData() {
    try {
        const resp = await fetch(`${API_BASE}`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        users = await resp.json();
        console.log('users', users);
        render(users);
    } catch (err) {
        console.error('Failed to fetch users:', err);
    }
}

// run retrieval as soon as the page loads
document.addEventListener('DOMContentLoaded', retrieveData);

// view toggle button
viewToggleBtn.addEventListener('click', () => {
    if (userGrid.classList.contains('grid-view')) {
        userGrid.classList.remove('grid-view');
        userGrid.classList.add('list-view');
    } else {
        userGrid.classList.remove('list-view');
        userGrid.classList.add('grid-view');
    }
});

// sort array by user_group, then re-render
sortByGroupBtn.addEventListener('click', () => {
    users.sort((a, b) => {
        const ga = (a.user_group ?? '').toUpperCase();
        const gb = (b.user_group ?? '').toUpperCase();
        if (ga < gb) return -1;
        if (ga > gb) return 1;
        return 0;
    });
    render(users);
});

// sort array by numeric id, then re-render
sortByIdBtn.addEventListener('click', () => {
    users.sort((a, b) => Number(a.id) - Number(b.id));
    render(users);
});

// delete button: remove user from API and update local list
deleteBtn.addEventListener('click', async () => {
    const idToDelete = deleteIdInput.value.trim();
    if (!idToDelete) {
        console.error('Please enter an ID to delete.');
        return;
    }

    const numericId = Number(idToDelete);
    if (Number.isNaN(numericId)) {
        console.error('Invalid ID format.');
        return;
    }

    try {
        const resp = await fetch(`${API_BASE}/${numericId}`, { method: 'DELETE' });
        if (!resp.ok) {
            console.error(`API delete failed: ${resp.status}`);
            return;
        }
        // remove from local array and re-render
        users = users.filter(u => Number(u.id) !== numericId);
        render(users);
    } catch (err) {
        console.error('Error deleting user:', err);
    }
});
