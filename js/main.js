document.addEventListener('DOMContentLoaded', function() {
    // Populate announcements on announcements.html
    const announcementsList = document.getElementById('announcements-list');
    if (announcementsList && typeof announcements !== 'undefined') { // Check if announcements array exists
        
        // Sort announcements by date in descending order (newest first)
        announcements.sort((a, b) => new Date(b.date) - new Date(a.date));

        announcements.forEach(announcement => {
            const announcementElement = document.createElement('div');
            announcementElement.classList.add('announcement-item');
            
            // Add ID for direct linking from main page
            if (announcement.id) {
                announcementElement.id = announcement.id;
            }
            announcementElement.innerHTML = `
                <h3>${announcement.title}</h3>
                <p class="announcement-date">${announcement.date}</p>
                <p>${announcement.content}</p>
            `;
            announcementsList.appendChild(announcementElement);
        });
    }

    // Handle X-mas event click on index.html
    const xmasEventLink = document.getElementById('xmas-event');
    if (xmasEventLink) {
        xmasEventLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            alert('크리스마스 할인코드: X-MAS2025! 지금 등록하고 20% 할인 받으세요!');
            window.location.href = 'profile.html'; // Redirect to registration/profile page
        });
    }
});
