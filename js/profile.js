document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));


    if (!loggedInUser) {
        alert('로그인이 필요합니다.');
        window.location.href = 'index.html';
        return;
    }

    window.displayUserProfile = function() {
        const currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

        
        displayStandardInfo(currentUser);
        
        displayLockerInfo(currentUser);
        
        renderStreakTracker(currentUser);
    };


    function displayStandardInfo(user) {
        const userNameEl = document.getElementById('profile-user-name');
        const registrationStatusEl = document.getElementById('profile-registration-status');
        const remainingDaysEl = document.getElementById('profile-remaining-days');

        if (userNameEl) userNameEl.textContent = user.name;

        if (remainingDaysEl) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const expiryDate = new Date(user.expiresAt);
            const timeDiff = expiryDate.getTime() - today.getTime();
            const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (daysRemaining > 0) {
                registrationStatusEl.textContent = '이용 중';
                registrationStatusEl.className = 'status-active';
                remainingDaysEl.textContent = `${daysRemaining}일 남았습니다.`;
            } else {
                registrationStatusEl.textContent = '만료됨';
                registrationStatusEl.className = 'status-expired';
                remainingDaysEl.textContent = '이용 기간이 만료되었습니다.';
            }
        }
    }

    function displayLockerInfo(user) {
        const lockerStatusEl = document.getElementById('profile-locker-status');
        if (!lockerStatusEl) return;

        if (user.locker) {
            lockerStatusEl.innerHTML = `
                <p><strong>사물함 번호:</strong> ${user.locker.number}</p>
                <p class="locker-password-display">
                    <strong>비밀번호:</strong> 
                    <span id="displayed-locker-password">*****</span>
                    <img src="images/eye_icon.png" alt="비밀번호 보기/숨기기" id="toggle-locker-password" class="password-toggle-icon">
                </p>
            `;
            const toggleButton = document.getElementById('toggle-locker-password');
            const displayedPassword = document.getElementById('displayed-locker-password');
            let passwordHidden = true;

            toggleButton.addEventListener('click', () => {
                passwordHidden = !passwordHidden;
                displayedPassword.textContent = passwordHidden ? '*****' : user.locker.password;
            });
        } else {
            lockerStatusEl.innerHTML = `
                <p>등록된 사물함이 없습니다.</p>
                <button id="register-locker-btn" class="btn">사물함 등록하기</button>
            `;
            document.getElementById('register-locker-btn').addEventListener('click', () => {
                if (window.openLockerModal) window.openLockerModal();
            });
        }
    }

    let isStreakTrackerCollapsed = false;


    function renderStreakTracker(user) {
        const placeholder = document.getElementById('streak-tracker-placeholder');
        if (!placeholder) return;

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;
        const hasCheckedInToday = user.checkIns.includes(todayStr);
        const currentStreak = calculateCurrentStreak(user.checkIns);

        placeholder.innerHTML = `
            <section class="section streak-tracker ${isStreakTrackerCollapsed ? 'collapsed' : ''}">
                <div class="streak-tracker-header" id="streak-tracker-toggle">
                    <h3>나의 운동 스트릭</h3>
                    <div class="streak-header-controls">
                        <span id="streak-toggle-indicator" class="toggle-indicator">${isStreakTrackerCollapsed ? '+' : '-'}</span>
                        <button id="check-in-btn" class="btn btn-primary" ${hasCheckedInToday ? 'disabled' : ''}>
                            ${hasCheckedInToday ? '오늘 출석 완료!' : '오늘 출석하기'}
                        </button>
                    </div>
                </div>
                <div id="streak-tracker-body" class="streak-tracker-body">
                    <div class="streak-info">
                        <p>현재 <span class="streak-count">${currentStreak}</span>일 연속 출석 중!</p>
                    </div>
                    <div class="streak-calendar-container">
                        ${renderCalendar(user.checkIns)}
                    </div>
                </div>
            </section>
        `;

        document.getElementById('streak-tracker-toggle').addEventListener('click', (e) => {
            
            if (e.target.id === 'check-in-btn') return;
            
            isStreakTrackerCollapsed = !isStreakTrackerCollapsed;
            document.querySelector('.streak-tracker').classList.toggle('collapsed');
            document.getElementById('streak-toggle-indicator').textContent = isStreakTrackerCollapsed ? '+' : '-';
            
            
            sessionStorage.setItem('streakTrackerState', isStreakTrackerCollapsed ? 'collapsed' : 'expanded');
        });

        if (!hasCheckedInToday) {
            document.getElementById('check-in-btn').addEventListener('click', () => handleCheckIn(user));
        }
    }


    if (sessionStorage.getItem('streakTrackerState') === 'collapsed') {
        isStreakTrackerCollapsed = true;
    }


    function handleCheckIn(user) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;
        
        
        user.checkIns.push(todayStr);
        
        
        const newStreak = calculateCurrentStreak(user.checkIns);
        const STREAK_GOAL = 14;

        if (newStreak >= STREAK_GOAL && !user.hasReceivedStreakCoupon) {
            user.hasReceivedStreakCoupon = true;
            alert(`축하합니다! ${STREAK_GOAL}일 연속 출석을 달성하여 5% 할인 쿠폰(STREAK5)을 획득했습니다!`);
        }

        
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        
        
        renderStreakTracker(user);
    }
    
    function calculateCurrentStreak(checkIns) {
        if (checkIns.length === 0) return 0;
    
        const uniqueCheckInDates = [...new Set(checkIns)].map(dateStr => {
            const [year, month, day] = dateStr.split('-').map(Number);
            return new Date(year, month - 1, day);
        }).sort((a, b) => b - a); 
    
        let streak = 0;
        let today = new Date();
        today.setHours(0, 0, 0, 0);
    
        
        const mostRecentCheckIn = uniqueCheckInDates[0];
        const diff = today.getTime() - mostRecentCheckIn.getTime();
        const daysSinceLastCheckIn = diff / (1000 * 3600 * 24);
    
        if (daysSinceLastCheckIn > 1) {
            return 0; 
        }
    
        
        streak = 1;
        let expectedDate = new Date(mostRecentCheckIn);
        expectedDate.setDate(expectedDate.getDate() - 1);
    
        for (let i = 1; i < uniqueCheckInDates.length; i++) {
            const currentCheckIn = uniqueCheckInDates[i];
            if (currentCheckIn.getTime() === expectedDate.getTime()) {
                streak++;
                expectedDate.setDate(expectedDate.getDate() - 1); 
            } else {
                break; 
            }
        }
        return streak;
    }

    function renderCalendar(checkIns) {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const startDayOfWeek = firstDayOfMonth.getDay(); 
    
        const checkInSet = new Set(checkIns);
        
        let html = `<div class="streak-calendar-header">${year}년 ${month + 1}월</div>`;
        html += `<div class="streak-calendar">`;
        
        
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        days.forEach(day => {
            html += `<div class="calendar-day day-header">${day}</div>`;
        });
    
        
        for (let i = 0; i < startDayOfWeek; i++) {
            html += `<div class="calendar-day"></div>`;
        }
    
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            let classes = 'calendar-day';
            if (checkInSet.has(dateStr)) {
                classes += ' checked-in';
            }
            if (day === today.getDate()) {
                classes += ' today';
            }
            html += `<div class="${classes}">${day}</div>`;
        }
        html += `</div>`;
        return html;
    }

    
    window.displayUserProfile();
});