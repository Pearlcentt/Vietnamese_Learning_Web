document.addEventListener('DOMContentLoaded', () => {
    // --- Main Views ---
    const profileView = document.getElementById('profileView');
    const editProfileView = document.getElementById('editProfileView');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const cancelEditProfileBtn = document.getElementById('cancelEditProfileBtn');
    const editProfileForm = document.getElementById('editProfileForm');

    // --- Profile Display Elements ---
    const profileAvatarDisplay = document.getElementById('profileAvatarDisplay');
    const displayNameEl = document.getElementById('displayName');
    const usernameEl = document.getElementById('username');
    const joinedDateEl = document.getElementById('joinedDate');
    const followingCountEl = document.getElementById('followingCount');
    const followersCountEl = document.getElementById('followersCount');
    const dayStreakEl = document.getElementById('dayStreak');
    const totalXPEl = document.getElementById('totalXP');
    const currentLeagueEl = document.getElementById('currentLeague');
    const top3FinishesEl = document.getElementById('top3Finishes');

    // --- Edit Profile Form Elements ---
    const editAvatarPreview = document.getElementById('editAvatarPreview');
    const selectedAvatarUrlInput = document.getElementById('selectedAvatarUrlInput');
    const editNameInput = document.getElementById('editNameInput');
    const editUsernameInput = document.getElementById('editUsernameInput');
    const editEmailInput = document.getElementById('editEmailInput');
    const editCurrentPasswordInput = document.getElementById('editCurrentPasswordInput');
    const editNewPasswordInput = document.getElementById('editNewPasswordInput');

    // --- Avatar Modal Elements ---
    const avatarModal = document.getElementById('avatarModal');
    const openAvatarModalBtnMain = document.getElementById('openAvatarModalBtnMain');
    const openAvatarModalBtnEdit = document.getElementById('openAvatarModalBtnEdit');
    const closeAvatarModalBtn = document.getElementById('closeAvatarModalBtn');
    const avatarSelectionGrid = document.getElementById('avatarSelectionGrid');
    const confirmAvatarSelectionBtn = document.getElementById('confirmAvatarSelectionBtn');
    const avatarUploadInput = document.getElementById('avatarUpload');

    // --- Right Sidebar Elements ---
    const userFlagSidebar = document.getElementById('userFlagSidebar');
    const userLanguageSidebar = document.getElementById('userLanguageSidebar');
    const userStreakSidebar = document.getElementById('userStreakSidebar');
    const userGemsSidebar = document.getElementById('userGemsSidebar');

    const findFriendsToggle = document.getElementById('findFriendsToggle');
    const findFriendsContent = document.getElementById('findFriendsContent');
    const findFriendInput = document.getElementById('findFriendInput');
    const searchFriendBtn = document.getElementById('searchFriendBtn');
    const searchResultsUi = document.getElementById('searchResultsUi');

    const friendRequestsToggle = document.getElementById('friendRequestsToggle');
    const friendRequestsContent = document.getElementById('friendRequestsContent');
    const friendRequestTabs = document.querySelectorAll('.fr-tab-btn');
    const receivedRequestCountBadge = document.getElementById('receivedRequestCountBadge');
    const sentRequestCountBadge = document.getElementById('sentRequestCountBadge');
    const friendRequestsListUiReceived = document.getElementById('friendRequestsListUiReceived');
    const friendRequestsListUiSent = document.getElementById('friendRequestsListUiSent');
    const noFriendRequestsMessage = document.getElementById('noFriendRequestsMessage'); // Chung cho cả 2 tab

    const friendListUi = document.getElementById('friendListUi');
    const noFriendsMessage = document.getElementById('noFriendsMessage');


    // --- Mock Data (Thay thế bằng API calls) ---
    let currentUserData = {
        displayName: "bhuy",
        username: "bhuy690413",
        joinedDate: "March 2025",
        followingCount: 5,
        followersCount: 10,
        dayStreak: 1,
        totalXP: 14,
        currentLeague: "None",
        top3Finishes: 0,
        email: "buivanhuy0701@gmail.com",
        avatarUrl: "../html/images/default_avatar.png",
        languageLearning: { // Dữ liệu cho sidebar badges
            name: "VIETNAMESE",
            flag: "../html/images/vietnam.png", // Cần có ảnh này
            streak: 32, // Có thể khác dayStreak chính
            gems: 505
        },
        friends: [
            { id: 1, name: "Lisa", avatar: "../html/images/avatar1.png" },
            { id: 2, name: "Mark", avatar: "../html/images/avatar2.png" }
        ],
        friendRequests: {
            received: [
                { id: 101, name: "John", avatar: "../html/images/avatar3.png" },
                { id: 102, name: "David", avatar: "../html/images/avatar4.png" }
            ],
            sent: [
                { id: 201, name: "Rice", avatar: "../html/images/avatar5.png" }
            ]
        }
    };

    const sampleAvatars = [ // Đường dẫn đến các avatar mẫu
        "../html/images/avatar1.png", "../html/images/avatar2.png", "../html/images/avatar3.png", "../html/images/avatar4.png",
        "../html/images/avatar7.png", "../html/images/avatar5.png", "../html/images/avatar6.png"
    ];
    let currentSelectedAvatarInModal = currentUserData.avatarUrl;

    // --- Functions ---
    function loadProfileDisplayData() {
        displayNameEl.textContent = currentUserData.displayName;
        usernameEl.textContent = currentUserData.username;
        joinedDateEl.textContent = currentUserData.joinedDate;
        followingCountEl.textContent = currentUserData.followingCount;
        followersCountEl.textContent = currentUserData.followersCount;
        dayStreakEl.textContent = currentUserData.dayStreak;
        totalXPEl.textContent = currentUserData.totalXP;
        currentLeagueEl.textContent = currentUserData.currentLeague;
        top3FinishesEl.textContent = currentUserData.top3Finishes;
        profileAvatarDisplay.src = currentUserData.avatarUrl;
    }

    function loadEditFormData() {
        editNameInput.value = currentUserData.displayName;
        editUsernameInput.value = currentUserData.username;
        editEmailInput.value = currentUserData.email;
        editAvatarPreview.src = currentUserData.avatarUrl;
        selectedAvatarUrlInput.value = currentUserData.avatarUrl;
        editCurrentPasswordInput.value = "";
        editNewPasswordInput.value = "";
    }

    function loadSidebarBadges() {
        if (currentUserData.languageLearning) {
            userFlagSidebar.src = currentUserData.languageLearning.flag;
            userLanguageSidebar.textContent = currentUserData.languageLearning.name.toUpperCase();
            userStreakSidebar.textContent = currentUserData.languageLearning.streak;
            userGemsSidebar.textContent = currentUserData.languageLearning.gems;
        }
    }

    function renderFriendList() {
        friendListUi.innerHTML = '';
        if (currentUserData.friends.length === 0) {
            noFriendsMessage.style.display = 'block';
        } else {
            noFriendsMessage.style.display = 'none';
            currentUserData.friends.forEach(friend => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <img src="${friend.avatar || '../html/images/default_avatar.png'}" alt="${friend.name} Avatar">
                    <span>${friend.name}</span>
                    <button class="unfriend-btn" data-friend-id="${friend.id}" title="Unfriend"><i class="fas fa-user-minus"></i></button>
                `;
                friendListUi.appendChild(li);
            });
        }
    }

    function renderFriendRequests(type = 'received') {
        const listUi = type === 'received' ? friendRequestsListUiReceived : friendRequestsListUiSent;
        const requests = currentUserData.friendRequests[type] || [];

        listUi.innerHTML = '';
        receivedRequestCountBadge.textContent = currentUserData.friendRequests.received.length;
        sentRequestCountBadge.textContent = currentUserData.friendRequests.sent.length;

        // Hiển thị/ẩn list tương ứng
        friendRequestsListUiReceived.style.display = type === 'received' ? 'block' : 'none';
        friendRequestsListUiSent.style.display = type === 'sent' ? 'block' : 'none';


        if (requests.length === 0) {
            // Chỉ hiển thị "no requests" nếu tab hiện tại không có request
            if ((type === 'received' && friendRequestsListUiReceived.style.display === 'block') ||
                (type === 'sent' && friendRequestsListUiSent.style.display === 'block')) {
                noFriendRequestsMessage.style.display = 'block';
            }
        } else {
            noFriendRequestsMessage.style.display = 'none';
            requests.forEach(request => {
                const li = document.createElement('li');
                let actionsHtml = '';
                if (type === 'received') {
                    actionsHtml = `
                        <button class="accept-request-btn" data-request-id="${request.id}" title="Accept"><i class="fas fa-check"></i></button>
                        <button class="decline-request-btn" data-request-id="${request.id}" title="Decline"><i class="fas fa-times"></i></button>
                    `;
                } else { // sent
                    actionsHtml = `
                        <button class="cancel-request-btn" data-request-id="${request.id}" title="Cancel Request"><i class="fas fa-ban"></i></button>
                    `;
                }
                li.innerHTML = `
                    <img src="${request.avatar || '../html/images/default_avatar.png'}" alt="${request.name} Avatar">
                    <span class="fr-info-name">${request.name}</span>
                    <div class="fr-actions-btns">${actionsHtml}</div>
                `;
                listUi.appendChild(li);
            });
        }
    }


    // --- Avatar Modal Logic ---
    function populateAvatarSelectionGrid() {
        avatarSelectionGrid.innerHTML = '';
        sampleAvatars.forEach(avatarSrc => {
            const img = document.createElement('img');
            img.src = avatarSrc;
            img.alt = "Avatar option";
            img.classList.add('avatar-option');
            img.dataset.src = avatarSrc;
            if (avatarSrc === currentSelectedAvatarInModal) { // Sử dụng biến tạm để theo dõi lựa chọn trong modal
                img.classList.add('selected');
            }
            img.addEventListener('click', () => {
                avatarSelectionGrid.querySelectorAll('.avatar-option.selected').forEach(el => el.classList.remove('selected'));
                img.classList.add('selected');
                currentSelectedAvatarInModal = img.dataset.src;
            });
            avatarSelectionGrid.appendChild(img);
        });
    }

    function openAvatarModal() {
        currentSelectedAvatarInModal = currentUserData.avatarUrl; // Reset lựa chọn trong modal về avatar hiện tại
        populateAvatarSelectionGrid();
        avatarModal.style.display = 'block';
    }

    function closeAvatarModal() {
        avatarModal.style.display = 'none';
    }

    if (openAvatarModalBtnMain) openAvatarModalBtnMain.addEventListener('click', openAvatarModal);
    if (openAvatarModalBtnEdit) openAvatarModalBtnEdit.addEventListener('click', openAvatarModal);
    if (closeAvatarModalBtn) closeAvatarModalBtn.addEventListener('click', closeAvatarModal);
    window.addEventListener('click', (event) => {
        if (event.target == avatarModal) closeAvatarModal();
    });

    if (confirmAvatarSelectionBtn) {
        confirmAvatarSelectionBtn.addEventListener('click', () => {
            if (currentSelectedAvatarInModal) {
                currentUserData.avatarUrl = currentSelectedAvatarInModal;
                profileAvatarDisplay.src = currentSelectedAvatarInModal;
                editAvatarPreview.src = currentSelectedAvatarInModal;
                selectedAvatarUrlInput.value = currentSelectedAvatarInModal;
                console.log("Avatar selected (from list):", currentSelectedAvatarInModal);
                // **BACKEND INTEGRATION POINT**: Gửi `currentUserData.avatarUrl` lên server
            }
            closeAvatarModal();
        });
    }

    if (avatarUploadInput) {
        avatarUploadInput.addEventListener('change', function (event) {
            if (event.target.files && event.target.files[0]) {
                const file = event.target.files[0];
                const reader = new FileReader();
                reader.onload = function (e) {
                    const uploadedImageUrl = e.target.result;
                    currentUserData.avatarUrl = uploadedImageUrl;
                    profileAvatarDisplay.src = uploadedImageUrl;
                    editAvatarPreview.src = uploadedImageUrl;
                    selectedAvatarUrlInput.value = uploadedImageUrl;
                    console.log("Avatar uploaded (client preview):", uploadedImageUrl);
                    // **BACKEND INTEGRATION POINT**: Upload `file` lên server
                    // Sau khi server trả về URL đã lưu, cập nhật lại currentUserData.avatarUrl
                    closeAvatarModal();
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // --- Event Listeners ---
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            profileView.style.display = 'none';
            profileView.classList.remove('profile-view-active');
            editProfileView.style.display = 'block';
            loadEditFormData();
        });
    }

    if (cancelEditProfileBtn) {
        cancelEditProfileBtn.addEventListener('click', () => {
            editProfileView.style.display = 'none';
            profileView.style.display = 'block'; // Hoặc 'block' tùy theo CSS của bạn
            profileView.classList.add('profile-view-active');
        });
    }

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            currentUserData.displayName = editNameInput.value;
            currentUserData.email = editEmailInput.value;
            // currentUserData.avatarUrl đã được cập nhật qua modal hoặc selectedAvatarUrlInput
            // Logic xử lý password cần thêm (kiểm tra current, hash new)
            console.log("Saving profile:", {
                name: currentUserData.displayName,
                email: currentUserData.email,
                avatarUrl: currentUserData.avatarUrl,
                currentPassword: editCurrentPasswordInput.value, // Chỉ để log, cần xử lý thực tế
                newPassword: editNewPasswordInput.value       // Chỉ để log
            });
            // **BACKEND INTEGRATION POINT**: Gửi dữ liệu lên server
            alert('Hồ sơ đã được cập nhật (demo)!');
            loadProfileDisplayData(); // Cập nhật lại view chính
            editProfileView.style.display = 'none';
            profileView.style.display = 'block';
            profileView.classList.add('profile-view-active');
        });
    }

    function toggleCollapsible(toggleElement, contentElement) {
        if (!toggleElement || !contentElement) return;
        toggleElement.addEventListener('click', () => {
            const isActive = contentElement.style.display === 'block';
            contentElement.style.display = isActive ? 'none' : 'block';
            toggleElement.classList.toggle('active', !isActive);
            const icon = toggleElement.querySelector('.fa-chevron-right, .fa-chevron-down');
            if (icon) {
                icon.classList.toggle('fa-chevron-right', isActive);
                icon.classList.toggle('fa-chevron-down', !isActive);
            }
        });
    }
    toggleCollapsible(findFriendsToggle, findFriendsContent);
    toggleCollapsible(friendRequestsToggle, friendRequestsContent);

    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
            this.classList.toggle('fa-eye', type === 'password');
        });
    });

    if (searchFriendBtn && findFriendInput) {
        searchFriendBtn.addEventListener('click', () => {
            const searchTerm = findFriendInput.value.trim().toLowerCase();
            searchResultsUi.innerHTML = '';
            if (!searchTerm) {
                searchResultsUi.innerHTML = '<li>Enter name</li>';
                return;
            }
            console.log("Searching for:", searchTerm);
            // **BACKEND INTEGRATION POINT**: Gọi API tìm kiếm
            const mockResults = [ /* ... dữ liệu mẫu ... */]
                .filter(user => user.name.toLowerCase().includes(searchTerm));
            // ... (render mockResults như cũ) ...
            if (mockResults.length > 0) {
                mockResults.forEach(user => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <img src="${user.avatar || '../html/images/default_avatar.png'}" alt="${user.name} Avatar">
                        <span>${user.name}</span>
                        <button class="send-request-btn" data-user-id="${user.id}" title="Send Friend Request"><i class="fas fa-user-plus"></i></button>
                    `;
                    searchResultsUi.appendChild(li);
                });
            } else {
                searchResultsUi.innerHTML = '<li>Can not find that user</li>';
            }
        });
    }

    // Friend Request Tabs Listener
    friendRequestTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            friendRequestTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const tabType = this.dataset.tab;
            renderFriendRequests(tabType);
        });
    });


    // Event delegation for dynamic buttons
    document.body.addEventListener('click', function (event) {
        const unfriendBtn = event.target.closest('.unfriend-btn');
        const acceptRequestBtn = event.target.closest('.accept-request-btn');
        const declineRequestBtn = event.target.closest('.decline-request-btn');
        const cancelRequestBtn = event.target.closest('.cancel-request-btn'); // Nút mới cho sent requests
        const sendRequestBtn = event.target.closest('.send-request-btn');

        if (unfriendBtn) {
            const friendId = unfriendBtn.dataset.friendId;
            console.log('Unfriend user ID:', friendId);
            // **BACKEND**: Gửi yêu cầu hủy kết bạn
            currentUserData.friends = currentUserData.friends.filter(f => f.id != friendId);
            renderFriendList();
            alert(`Đã hủy kết bạn (demo)!`);
        }
        if (acceptRequestBtn) {
            const requestId = acceptRequestBtn.dataset.requestId;
            console.log('Accept request ID:', requestId);
            // **BACKEND**: Gửi yêu cầu chấp nhận
            const acceptedUser = currentUserData.friendRequests.received.find(r => r.id == requestId);
            if (acceptedUser) {
                currentUserData.friends.push({ ...acceptedUser, id: acceptedUser.id }); // Đảm bảo id là số
                currentUserData.friendRequests.received = currentUserData.friendRequests.received.filter(r => r.id != requestId);
            }
            renderFriendList();
            renderFriendRequests('received');
            alert(`Đã chấp nhận lời mời (demo)!`);
        }
        if (declineRequestBtn) {
            const requestId = declineRequestBtn.dataset.requestId;
            console.log('Decline request ID:', requestId);
            // **BACKEND**: Gửi yêu cầu từ chối
            currentUserData.friendRequests.received = currentUserData.friendRequests.received.filter(r => r.id != requestId);
            renderFriendRequests('received');
            alert(`Đã từ chối lời mời (demo)!`);
        }
        if (cancelRequestBtn) { // Xử lý nút cancel cho sent request
            const requestId = cancelRequestBtn.dataset.requestId;
            console.log('Cancel sent request ID:', requestId);
            // **BACKEND**: Gửi yêu cầu hủy lời mời đã gửi
            currentUserData.friendRequests.sent = currentUserData.friendRequests.sent.filter(r => r.id != requestId);
            renderFriendRequests('sent');
            alert(`Đã hủy lời mời đã gửi (demo)!`);
        }
        if (sendRequestBtn) {
            const userId = sendRequestBtn.dataset.userId;
            console.log('Send friend request to user ID:', userId);
            // **BACKEND**: Gửi lời mời kết bạn
            alert(`Đã gửi lời mời kết bạn (demo)!`);
            sendRequestBtn.disabled = true;
            sendRequestBtn.innerHTML = '<i class="fas fa-check"></i>';
        }
    });

    // --- Initial Load ---
    function initializePage() {
        loadProfileDisplayData();
        loadSidebarBadges();
        renderFriendList();
        renderFriendRequests('received'); // Mặc định hiển thị tab "Received"
        // Đảm bảo tab "Received" được active ban đầu
        document.querySelector('.fr-tab-btn[data-tab="received"]').classList.add('active');
        document.querySelector('.fr-tab-btn[data-tab="sent"]').classList.remove('active');

    }

    initializePage();
});