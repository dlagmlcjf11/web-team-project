document.addEventListener("DOMContentLoaded", function() {
    
    Promise.all([
        fetch('header.html').then(res => res.text()),
        fetch('footer.html').then(res => res.text()),
        fetch('login_modal.html').then(res => res.text())
    ]).then(([headerHtml, footerHtml, loginModalHtml]) => {
        
        document.body.insertAdjacentHTML('afterbegin', headerHtml);
        document.body.insertAdjacentHTML('beforeend', footerHtml);
        document.body.insertAdjacentHTML('beforeend', loginModalHtml);

        
        initializeApp();
    });

    function initializeApp() {
        
        const userIconBtn = document.getElementById('user-icon-btn');
        const userDropdown = document.getElementById('user-dropdown');
        const loginModal = document.getElementById('login-modal');
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

        if (loggedInUser) {
            
            userDropdown.innerHTML = `
                <div class="dropdown-user-name" style="text-align: right;">${loggedInUser.name} 님</div>
                <button onclick="location.href='profile.html'" style="text-align: right;">개인페이지</button>
                <button id="logout-btn" style="text-align: right;">로그아웃</button>
            `;

            userIconBtn.addEventListener('click', () => {
                userDropdown.classList.toggle('show');
            });

            document.getElementById('logout-btn').addEventListener('click', () => {
                alert('로그아웃 되었습니다.');
                sessionStorage.removeItem('loggedInUser');
                window.location.reload(); 
            });

        } else {
            
            userIconBtn.addEventListener('click', () => {
                loginModal.classList.add('show');
            });
        }

        
        if (loginModal) {
            const closeModalBtn = loginModal.querySelector('.modal-close-btn');
            const loginForm = document.getElementById('login-form-modal');
            const usernameInput = document.getElementById('modal-username');
            const passwordInput = document.getElementById('modal-password');
            const errorMessageDiv = document.getElementById('modal-error-message');

            
            closeModalBtn.addEventListener('click', () => loginModal.classList.remove('show'));
            loginModal.addEventListener('click', (event) => {
                if (event.target === loginModal) { 
                    loginModal.classList.remove('show');
                }
            });

            
            loginForm.addEventListener('submit', (event) => {
                event.preventDefault();
                
                const username = usernameInput.value;
                const password = passwordInput.value;

                
                if (typeof users === 'undefined') {
                    errorMessageDiv.textContent = '오류: 사용자 데이터를 로드할 수 없습니다.';
                    errorMessageDiv.style.display = 'block';
                    return;
                }

                const foundUser = users.find(user => user.id === username && user.pw === password);

                if (foundUser) {
                    alert(foundUser.name + '님, 환영합니다!'); 
                    sessionStorage.setItem('loggedInUser', JSON.stringify(foundUser));
                    loginModal.classList.remove('show'); 
                    window.location.href = 'profile.html'; 
                } else {
                    errorMessageDiv.textContent = '아이디 또는 비밀번호가 올바르지 않습니다.';
                    errorMessageDiv.style.display = 'block';
                    passwordInput.value = '';
                }
            });
        }

        
        window.addEventListener('click', (event) => {
            if (userIconBtn && !userIconBtn.contains(event.target) && userDropdown && userDropdown.classList.contains('show')) {
                userDropdown.classList.remove('show');
            }
        });
    }
});