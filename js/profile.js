document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    // 1. Auth Guard
    if (!loggedInUser) {
        alert('로그인이 필요합니다.');
        window.location.href = 'index.html';
        return;
    }

    // --- DOM Elements ---
    const userNameEl = document.getElementById('profile-user-name');
    const registrationStatusEl = document.getElementById('profile-registration-status');
    const remainingDaysEl = document.getElementById('profile-remaining-days');
    const lockerNumberEl = document.getElementById('locker-number');
    const lockerPasswordEl = document.getElementById('locker-password');
    const toggleLockerPasswordBtn = document.getElementById('toggle-locker-password');
    const registerLockerBtn = document.getElementById('register-locker-btn');

    // 2. Display User Name
    if (userNameEl) userNameEl.textContent = loggedInUser.name;

    // 3. Display Registration & Remaining Days
    if (remainingDaysEl) {
        const today = new Date();
        const expiryDate = new Date(loggedInUser.expiresAt);
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

    // 4. Display Locker Information
    const lockerStatusEl = document.getElementById('profile-locker-status');
    if (loggedInUser.locker) {
        lockerStatusEl.innerHTML = `
            <p><strong>사물함 번호:</strong> ${loggedInUser.locker.number}</p>
            <p><strong>비밀번호:</strong> *****</p>
        `;
    } else {
        lockerStatusEl.innerHTML = `<p>등록된 사물함이 없습니다.</p>`;
    }
});