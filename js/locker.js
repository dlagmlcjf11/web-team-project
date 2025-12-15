document.addEventListener('DOMContentLoaded', () => {
    const modalPlaceholder = document.getElementById('modal-placeholder');
    let selectedLockerNumber = null; // State to hold the selected locker
    const LOCKER_DATA_KEY = 'gymLockerData'; // Consistent key

    // --- Modal Control ---
    window.openLockerModal = () => {
        const modal = document.getElementById('locker-modal');
        const overlay = document.getElementById('locker-modal-overlay');
        if (modal && overlay) {
            renderLockerGrid();
            modal.classList.add('active');
            overlay.classList.add('active');
        }
    };

    const closeLockerModal = () => {
        const modal = document.getElementById('locker-modal');
        const overlay = document.getElementById('locker-modal-overlay');
        const passwordInput = document.getElementById('locker-password');
        const submitButton = document.querySelector('#locker-registration-form button[type="submit"]');
        const errorMessage = document.getElementById('locker-error-message');

        if (modal && overlay) {
            modal.classList.remove('active');
            overlay.classList.remove('active');
            selectedLockerNumber = null;
            if(passwordInput) {
                passwordInput.value = '';
                passwordInput.disabled = true;
            }
            if(submitButton) submitButton.disabled = true;
            if(errorMessage) errorMessage.textContent = '';
        }
    };

    // --- UI Rendering and Event Handling ---
    fetch('locker_modal.html')
        .then(response => response.text())
        .then(html => {
            modalPlaceholder.innerHTML = html;
            document.getElementById('locker-modal-close').addEventListener('click', closeLockerModal);
            document.getElementById('locker-modal-overlay').addEventListener('click', closeLockerModal);
            document.getElementById('locker-registration-form').addEventListener('submit', handleLockerRegistration);
            document.getElementById('locker-grid-container').addEventListener('click', handleLockerSelection);
        })
        .catch(error => console.error('Error loading locker modal:', error));

    function renderLockerGrid() {
        const gridContainer = document.getElementById('locker-grid-container');
        const storedData = JSON.parse(localStorage.getItem(LOCKER_DATA_KEY));
        const currentLockers = storedData ? storedData.lockers : [];

        if (!gridContainer || !currentLockers) return;
        
        gridContainer.innerHTML = '';

        const groupedLockers = currentLockers.reduce((acc, locker) => {
            const prefix = locker.number.charAt(0);
            if (!acc[prefix]) acc[prefix] = [];
            acc[prefix].push(locker);
            return acc;
        }, {});

        Object.keys(groupedLockers).sort().forEach(prefix => {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('locker-row');
            
            groupedLockers[prefix].forEach(locker => {
                const lockerDiv = document.createElement('div');
                lockerDiv.classList.add('locker-box');
                lockerDiv.textContent = locker.number;
                lockerDiv.dataset.lockerNumber = locker.number;

                if (locker.isAvailable) {
                    lockerDiv.classList.add('available');
                } else {
                    lockerDiv.classList.add('unavailable');
                }
                rowDiv.appendChild(lockerDiv);
            });
            gridContainer.appendChild(rowDiv);
        });
    }

    function handleLockerSelection(event) {
        const target = event.target;
        if (!target.classList.contains('available')) return;

        const lockerNumber = target.dataset.lockerNumber;
        const previouslySelected = document.querySelector('.locker-box.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }

        target.classList.add('selected');
        selectedLockerNumber = lockerNumber;

        document.getElementById('locker-password').disabled = false;
        document.querySelector('#locker-registration-form button[type="submit"]').disabled = false;
        document.getElementById('locker-password').focus();
    }

    // --- Registration Logic ---
    function handleLockerRegistration(event) {
        event.preventDefault();
        const passwordInput = document.getElementById('locker-password');
        const errorMessage = document.getElementById('locker-error-message');
        errorMessage.textContent = '';

        if (!selectedLockerNumber) {
            errorMessage.textContent = '먼저 사물함을 선택해주세요.';
            return;
        }
        
        const password = passwordInput.value;
        if (!/^\d{4}$/.test(password)) {
            errorMessage.textContent = '비밀번호는 4자리 숫자로 입력해야 합니다.';
            return;
        }

        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        const storedData = JSON.parse(localStorage.getItem(LOCKER_DATA_KEY));
        const lockerToUpdate = storedData.lockers.find(l => l.number === selectedLockerNumber);

        if (loggedInUser && lockerToUpdate && lockerToUpdate.isAvailable) {
            loggedInUser.locker = { number: selectedLockerNumber, password: password };
            sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

            lockerToUpdate.isAvailable = false;
            localStorage.setItem(LOCKER_DATA_KEY, JSON.stringify(storedData));

            alert(`사물함 ${selectedLockerNumber}번이 등록되었습니다.`);
            closeLockerModal();
            if (window.displayUserProfile) {
                window.displayUserProfile();
            } else {
                window.location.reload();
            }
        } else {
            errorMessage.textContent = '해당 사물함은 방금 다른 사용자가 등록했습니다. 다른 사물함을 선택해주세요.';
            renderLockerGrid();
        }
    }
});





