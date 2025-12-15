document.addEventListener('DOMContentLoaded', function() {

    const announcementsList = document.getElementById('announcements-list');
    if (announcementsList && typeof announcements !== 'undefined') { 
        
        
        announcements.sort((a, b) => new Date(b.date) - new Date(a.date));

        announcements.forEach(announcement => {
            const announcementElement = document.createElement('div');
            announcementElement.classList.add('announcement-item');
            
            
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

    const xmasEventLink = document.getElementById('xmas-event');
    if (xmasEventLink) {
        xmasEventLink.addEventListener('click', function(event) {
            event.preventDefault(); 
            alert('크리스마스 할인코드: X-MAS2025! 지금 등록하고 20% 할인 받으세요!');
            window.location.href = 'profile.html'; 
        });
    }


    const faqListContainer = document.querySelector('.faq-list');
    if (faqListContainer && typeof faqData !== 'undefined' && Array.isArray(faqData)) {
        
        
        faqListContainer.innerHTML = faqData.map(item => `
            <div class="faq-item">
                <div class="faq-question">Q. ${item.question}</div>
                <div class="faq-answer">${item.answer}</div>
            </div>
        `).join('');

        const faqItems = faqListContainer.querySelectorAll('.faq-item');

        
        faqListContainer.addEventListener('click', (event) => {
            const question = event.target.closest('.faq-question');
            if (!question) return;

            const wasActive = question.classList.contains('active');

            
            faqItems.forEach(item => {
                item.querySelector('.faq-question').classList.remove('active');
                item.querySelector('.faq-answer').classList.remove('active');
            });

            
            if (!wasActive) {
                const faqItem = question.closest('.faq-item');
                const answer = faqItem.querySelector('.faq-answer');

                question.classList.add('active');
                answer.classList.add('active');

                
                setTimeout(() => {
                    faqItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100); 
            }
        });

        
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
