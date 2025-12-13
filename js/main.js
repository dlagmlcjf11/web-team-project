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

    // Dynamic FAQ Generation
    const faqListContainer = document.querySelector('.faq-list');
    if (faqListContainer && typeof faqData !== 'undefined' && Array.isArray(faqData)) {
        
        // Generate FAQ HTML
        faqListContainer.innerHTML = faqData.map(item => `
            <div class="faq-item">
                <div class="faq-question">Q. ${item.question}</div>
                <div class="faq-answer">${item.answer}</div>
            </div>
        `).join('');

        const faqItems = faqListContainer.querySelectorAll('.faq-item');

        // Accordion functionality using event delegation
        faqListContainer.addEventListener('click', (event) => {
            const question = event.target.closest('.faq-question');
            if (!question) return;

            const wasActive = question.classList.contains('active');

            // Close all items
            faqItems.forEach(item => {
                item.querySelector('.faq-question').classList.remove('active');
                item.querySelector('.faq-answer').classList.remove('active');
            });

            // If it wasn't active before, open it and scroll
            if (!wasActive) {
                const faqItem = question.closest('.faq-item');
                const answer = faqItem.querySelector('.faq-answer');

                question.classList.add('active');
                answer.classList.add('active');

                // Smooth scroll to the item
                setTimeout(() => {
                    faqItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100); // Timeout to allow the element to start opening
            }
        });

        // Search functionality
        const faqSearch = document.getElementById('faq-search');
        if (faqSearch) {
            faqSearch.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();

                faqItems.forEach(item => {
                    const questionText = item.querySelector('.faq-question').textContent.toLowerCase();
                    if (questionText.includes(searchTerm)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }
    }
});
