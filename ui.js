function toggleBaseActive(base) {
    const base1 = document.getElementById('base-1');
    const base2 = document.getElementById('base-2');
    const base3 = document.getElementById('base-3');
    
    if (base === 1) {
        base1.classList.toggle('active');
    }
    if (base === 2) {
        base2.classList.toggle('active');
    }
    if (base === 3) {
        base3.classList.toggle('active');
    }
}

function updateAnnouncements(text) {
    const announcements = document.getElementById('announcements');
    announcements.textContent = text;
}