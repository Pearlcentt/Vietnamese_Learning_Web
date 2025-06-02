document.addEventListener('DOMContentLoaded', () => {
    const currentUserData = window.serverData.currentUser;
    const viewOnly = window.serverData.viewOnly;
    // ... (các biến khác giữ nguyên) ...
    const userEditFormInitialData = window.serverData.userEditForm;
    const sampleAvatars = window.serverData.sampleAvatars;
    const defaultAvatarUrl = window.serverData.defaultAvatarUrl; // Đây là URL mặc định, không phải trường DTO
    const csrfToken = window.serverData.csrfToken;
    const csrfHeaderName = window.serverData.csrfHeaderName;
    const backendUrls = window.serverData.urls;

    // --- Elements ---
    const profileAvatarDisplay = document.getElementById('profileAvatarDisplay');
    const displayNameEl = document.getElementById('displayName');
    const usernameEl = document.getElementById('username');
    const joinedDateEl = document.getElementById('joinedDate');
    const followingCountEl = document.getElementById('followingCount');
    const followersCountEl = document.getElementById('followersCount');
    const dayStreakEl = document.getElementById('dayStreak');
    const totalXPEl = document.getElementById('totalXP'); // HTML ID, dùng cho gems
    const currentLeagueEl = document.getElementById('currentLeague');
    const top3FinishesEl = document.getElementById('top3Finishes');

    const editProfileView = document.getElementById('editProfileView');
    const profileView = document.getElementById('profileView');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const cancelEditProfileBtn = document.getElementById('cancelEditProfileBtn');
    const editProfileForm = document.getElementById('editProfileForm');
    const editAvatarPreview = document.getElementById('editAvatarPreview');
    const selectedAvatarUrlInput = document.getElementById('selectedAvatarUrlInput'); // Input này lưu URL avatar đã chọn/upload
    const editNameInput = document.getElementById('editNameInput');
    const editEmailInput = document.getElementById('editEmailInput');
    const editCurrentPasswordInput = document.getElementById('editCurrentPasswordInput');
    const editNewPasswordInput = document.getElementById('editNewPasswordInput');

    const avatarModal = document.getElementById('avatarModal');
    const openAvatarModalBtnEdit = document.getElementById('openAvatarModalBtnEdit');
    const closeAvatarModalBtn = document.getElementById('closeAvatarModalBtn');
    const avatarSelectionGrid = document.getElementById('avatarSelectionGrid');
    const confirmAvatarSelectionBtn = document.getElementById('confirmAvatarSelectionBtn');
    const avatarUploadInput = document.getElementById('avatarUpload');
    const avatarUploadLabel = document.querySelector('.upload-link');

    const friendListUi = document.getElementById('friendListUi');
    const noFriendsMessage = document.getElementById('noFriendsMessage');
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
    const noFriendRequestsMessage = document.getElementById('noFriendRequestsMessage');

    // SỬA Ở ĐÂY: currentSelectedAvatarInModal khởi tạo từ currentUserData.avatar
    let currentSelectedAvatarInModal = currentUserData ? (currentUserData.avatar || defaultAvatarUrl) : defaultAvatarUrl;

    async function makeApiCall(url, method = 'GET', body = null, isFormData = false) {
        // ... (giữ nguyên hàm makeApiCall)
        const headers = {};
        if (csrfToken && csrfHeaderName) {
            headers[csrfHeaderName] = csrfToken;
        }

        const options = {
            method: method,
            headers: headers
        };

        if (body) {
            if (isFormData) {
                options.body = body;
            } else {
                if (!(body instanceof FormData)) {
                    headers['Content-Type'] = 'application/json';
                    options.body = JSON.stringify(body);
                } else {
                    options.body = body;
                }
            }
        }

        try {
            const response = await fetch(url, options);
            const contentType = response.headers.get("content-type");
            let responseData;

            if (contentType && contentType.includes("application/json")) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }

            if (!response.ok) {
                console.error('API Error:', response.status, responseData);
                const errorMessage = (typeof responseData === 'object' && responseData.message) ? responseData.message : (responseData || `HTTP error! status: ${response.status}`);
                throw new Error(errorMessage);
            }
            return responseData;
        } catch (error) {
            console.error('Fetch error:', error);
            alert(error.message || 'An error occurred. Please try again.');
            throw error;
        }
    }

    function formatJoinedDate(dateString) {
        if (!dateString) return "Unknown Date";
        try {
            const date = new Date(dateString); // LocalDate sẽ được JS Date parse đúng
            return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        } catch (e) {
            return dateString;
        }
    }

    function loadProfileDisplayData() {
        if (!currentUserData) return;
        // SỬA Ở ĐÂY: Sử dụng currentUserData.name, currentUserData.avatar
        if (displayNameEl) displayNameEl.textContent = currentUserData.name || 'User Name';
        if (usernameEl) usernameEl.textContent = currentUserData.username || 'username123';
        if (joinedDateEl) joinedDateEl.textContent = formatJoinedDate(currentUserData.dateCreated);

        if (followingCountEl) followingCountEl.textContent = currentUserData.friends ? currentUserData.friends.length : 0;
        if (followersCountEl) followersCountEl.textContent = currentUserData.friends ? currentUserData.friends.length : 0;

        if (dayStreakEl) dayStreakEl.textContent = currentUserData.streak || 0;
        if (totalXPEl) totalXPEl.textContent = currentUserData.gems || 0;
        if (currentLeagueEl) currentLeagueEl.textContent = currentUserData.currentLeague || 'None';
        if (top3FinishesEl) top3FinishesEl.textContent = currentUserData.top3Finishes || 0;
        if (profileAvatarDisplay) profileAvatarDisplay.src = currentUserData.avatar || defaultAvatarUrl;
    }

    function loadEditFormData() {
        const sourceData = userEditFormInitialData || currentUserData;
        if (!sourceData) return;

        // SỬA Ở ĐÂY: sourceData.name, sourceData.avatar
        if (editNameInput) editNameInput.value = sourceData.name || ''; // Giả sử UserEditForm.displayName map với DTO.name
        if (editEmailInput) editEmailInput.value = sourceData.email || '';
        if (editAvatarPreview) editAvatarPreview.src = sourceData.avatar || defaultAvatarUrl;
        if (selectedAvatarUrlInput) selectedAvatarUrlInput.value = sourceData.avatar || defaultAvatarUrl; // Input này vẫn lưu URL

        if (editCurrentPasswordInput) editCurrentPasswordInput.value = sourceData.currentPassword || "";
        if (editNewPasswordInput) editNewPasswordInput.value = sourceData.newPassword || "";
    }

    function renderFriendList() {
        if (!friendListUi) return;
        friendListUi.innerHTML = '';
        const friends = currentUserData && currentUserData.friends ? currentUserData.friends : [];

        if (friends.length === 0) {
            if (noFriendsMessage) noFriendsMessage.style.display = 'block';
        } else {
            if (noFriendsMessage) noFriendsMessage.style.display = 'none';
            friends.forEach(friend => { // friend ở đây là UserResponseDTO
                const li = document.createElement('li');
                // SỬA Ở ĐÂY: friend.avatar, friend.name
                li.innerHTML = `
                    <img src="${friend.avatar || defaultAvatarUrl}" alt="${friend.name} Avatar">
                    <a href="/profile/${friend.uId}"><span>${friend.name}</span></a>
                    <button class="unfriend-btn" data-friend-id="${friend.uId}" title="Unfriend"><i class="fas fa-user-minus"></i></button>
                `;
                friendListUi.appendChild(li);
            });
        }
    }

    function renderFriendRequests(type = 'received') {
        const listUi = type === 'received' ? friendRequestsListUiReceived : friendRequestsListUiSent;
        if (!listUi) return;

        const requests = currentUserData && currentUserData.friendRequests && currentUserData.friendRequests[type] ? currentUserData.friendRequests[type] : [];

        listUi.innerHTML = '';
        if (receivedRequestCountBadge) receivedRequestCountBadge.textContent = (currentUserData?.friendRequests?.received?.length || 0).toString();
        if (sentRequestCountBadge) sentRequestCountBadge.textContent = (currentUserData?.friendRequests?.sent?.length || 0).toString();

        if (friendRequestsListUiReceived) friendRequestsListUiReceived.style.display = type === 'received' ? 'block' : 'none';
        if (friendRequestsListUiSent) friendRequestsListUiSent.style.display = type === 'sent' ? 'block' : 'none';

        const activeListVisible = (type === 'received' && friendRequestsListUiReceived && friendRequestsListUiReceived.style.display === 'block') ||
            (type === 'sent' && friendRequestsListUiSent && friendRequestsListUiSent.style.display === 'block');

        if (requests.length === 0) {
            if (noFriendRequestsMessage && activeListVisible) noFriendRequestsMessage.style.display = 'block';
        } else {
            if (noFriendRequestsMessage) noFriendRequestsMessage.style.display = 'none';
            requests.forEach(request => { // request ở đây là UserResponseDTO
                const li = document.createElement('li');
                let actionsHtml = '';
                if (type === 'received') {
                    actionsHtml = `
                        <button class="accept-request-btn" data-request-id="${request.uId}" title="Accept"><i class="fas fa-check"></i></button>
                        <button class="decline-request-btn" data-request-id="${request.uId}" title="Decline"><i class="fas fa-times"></i></button>
                    `;
                } else {
                    actionsHtml = `
                        <button class="cancel-request-btn" data-request-id="${request.uId}" title="Cancel Request"><i class="fas fa-ban"></i></button>
                    `;
                }
                // SỬA Ở ĐÂY: request.avatar, request.name
                li.innerHTML = `
                    <img src="${request.avatar || defaultAvatarUrl}" alt="${request.name} Avatar">
                    <span class="fr-info-name">${request.name}</span>
                    <div class="fr-actions-btns">${actionsHtml}</div>
                `;
                listUi.appendChild(li);
            });
        }
    }

    function populateAvatarSelectionGrid() {
        if (!avatarSelectionGrid) return;
        avatarSelectionGrid.innerHTML = '';
        (sampleAvatars || []).forEach(avatarSrc => {
            const img = document.createElement('img');
            img.src = avatarSrc;
            img.alt = "Avatar option";
            img.classList.add('avatar-option');
            img.dataset.src = avatarSrc;
            if (avatarSrc === currentSelectedAvatarInModal) {
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
        if (!avatarModal) return;
        // SỬA Ở ĐÂY: selectedAvatarUrlInput.value hoặc currentUserData.avatar
        currentSelectedAvatarInModal = selectedAvatarUrlInput ? selectedAvatarUrlInput.value : (currentUserData ? (currentUserData.avatar || defaultAvatarUrl) : defaultAvatarUrl);
        populateAvatarSelectionGrid();
        avatarModal.style.display = 'block';
    }

    function closeAvatarModal() {
        if (avatarModal) avatarModal.style.display = 'none';
    }

    if (openAvatarModalBtnEdit) openAvatarModalBtnEdit.addEventListener('click', openAvatarModal);
    if (closeAvatarModalBtn) closeAvatarModalBtn.addEventListener('click', closeAvatarModal);
    window.addEventListener('click', (event) => {
        if (avatarModal && event.target == avatarModal) closeAvatarModal();
    });

    if (confirmAvatarSelectionBtn) {
        confirmAvatarSelectionBtn.addEventListener('click', () => {
            if (currentSelectedAvatarInModal) {
                if (editAvatarPreview) editAvatarPreview.src = currentSelectedAvatarInModal;
                if (selectedAvatarUrlInput) selectedAvatarUrlInput.value = currentSelectedAvatarInModal; // Cập nhật input ẩn
            }
            closeAvatarModal();
        });
    }

    if (avatarUploadLabel) {
        avatarUploadLabel.addEventListener('click', () => avatarUploadInput.click());
    }

    if (avatarUploadInput) {
        avatarUploadInput.addEventListener('change', async function (event) {
            if (event.target.files && event.target.files[0]) {
                const file = event.target.files[0];
                const formData = new FormData();
                formData.append('avatarFile', file);
                try {
                    const response = await makeApiCall(backendUrls.uploadAvatar, 'POST', formData, true);
                    const uploadedImageUrl = typeof response === 'string' ? response : response.avatar; // Giả sử API trả về trường 'avatar'

                    if (editAvatarPreview) editAvatarPreview.src = uploadedImageUrl;
                    if (selectedAvatarUrlInput) selectedAvatarUrlInput.value = uploadedImageUrl; // Cập nhật input ẩn
                    currentSelectedAvatarInModal = uploadedImageUrl;
                    alert('Avatar uploaded successfully! Remember to save changes.');
                    closeAvatarModal();
                } catch (e) { /* Error handled */ }
            }
        });
    }

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            if (profileView) profileView.style.display = 'none';
            if (profileView) profileView.classList.remove('profile-view-active');
            if (editProfileView) editProfileView.style.display = 'block';
            loadEditFormData();
        });
    }
    if (cancelEditProfileBtn) {
        cancelEditProfileBtn.addEventListener('click', () => {
            if (editProfileView) editProfileView.style.display = 'none';
            if (profileView) profileView.style.display = 'block';
            if (profileView) profileView.classList.add('profile-view-active');
        });
    }
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(editProfileForm);
            // Input 'selectedAvatarUrlInput' đã có name="avatar" (hoặc tên trường tương ứng trong UserEditForm)
            // nên giá trị của nó sẽ tự động được FormData lấy.
            // Nếu bạn đặt name cho selectedAvatarUrlInput là "avatar" (giống UserEditForm.avatar)
            // thì không cần append thủ công nữa.
            // formData.append('avatar', selectedAvatarUrlInput.value); // Chỉ cần nếu input không có name hoặc name khác

            try {
                const response = await makeApiCall(backendUrls.updateProfile, 'POST', formData, true);
                window.location.href = '/profile?success=true';
            } catch (error) { /* Error handled */ }
        });
    }

    function toggleCollapsible(toggleElement, contentElement) {
        // ... (giữ nguyên)
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
        // ... (giữ nguyên)
        toggle.addEventListener('click', function () {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash', type === 'text');
            this.classList.toggle('fa-eye', type === 'password');
        });
    });

    if (searchFriendBtn && findFriendInput) {
        searchFriendBtn.addEventListener('click', async () => {
            const searchTerm = findFriendInput.value.trim();
            if (!searchResultsUi) return;
            searchResultsUi.innerHTML = '';
            if (!searchTerm) {
                searchResultsUi.innerHTML = '<li>Please enter a name or username to search.</li>';
                return;
            }
            try {
                const results = await makeApiCall(`${backendUrls.searchFriends}?query=${encodeURIComponent(searchTerm)}`, 'GET');
                if (results && results.length > 0) {
                    results.forEach(user => { // user ở đây là UserResponseDTO
                        const li = document.createElement('li');
                        const isFriend = currentUserData.friends.some(f => f.uId === user.uId);
                        const isRequestSentByCurrentUser = currentUserData.friendRequests.sent.some(r => r.uId === user.uId);
                        const isRequestReceivedFromThisUser = currentUserData.friendRequests.received.some(r => r.uId === user.uId);

                        let buttonHtml = `<button class="send-request-btn" data-user-id="${user.uId}" title="Send Friend Request"><i class="fas fa-user-plus"></i></button>`;
                        if (user.uId === currentUserData.uId) {
                            buttonHtml = `<button disabled class="send-request-btn" title="This is you"><i class="fas fa-user-check"></i></button>`;
                        } else if (isFriend) {
                            buttonHtml = `<button disabled class="send-request-btn" title="Already friends"><i class="fas fa-users"></i></button>`;
                        } else if (isRequestSentByCurrentUser) {
                            buttonHtml = `<button disabled class="send-request-btn" title="Request Sent"><i class="fas fa-check"></i></button>`;
                        } else if (isRequestReceivedFromThisUser) {
                            buttonHtml = `<button class="accept-request-btn" data-request-id="${user.uId}" title="Accept Request"><i class="fas fa-user-plus"></i></button>`;
                        }

                        // SỬA Ở ĐÂY: user.avatar, user.name
                        li.innerHTML = `
                            <img src="${user.avatar || defaultAvatarUrl}" alt="${user.name} Avatar">
                            <a href="/profile/${user.uId}" class="user-profile-link"><span>${user.name} (@${user.username})</span></a>
                            ${buttonHtml}
                        `;
                        searchResultsUi.appendChild(li);
                    });
                } else {
                    searchResultsUi.innerHTML = '<li>No users found.</li>';
                }
            } catch (error) {
                searchResultsUi.innerHTML = '<li>Error searching for friends.</li>';
            }
        });
    }

    friendRequestTabs.forEach(tab => {
        // ... (giữ nguyên)
        tab.addEventListener('click', function () {
            friendRequestTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const tabType = this.dataset.tab;
            renderFriendRequests(tabType);
        });
    });

    document.body.addEventListener('click', async function (event) {
        // ... (giữ nguyên logic, chỉ cần đảm bảo các đối tượng friend/request được tạo/cập nhật có trường 'avatar')
        const targetButton = event.target.closest('button');
        if (!targetButton) return;

        const friendId = targetButton.dataset.friendId;
        const requestId = targetButton.dataset.requestId;
        const userId = targetButton.dataset.userId;

        try {
            if (targetButton.classList.contains('unfriend-btn') && friendId) {
                if (confirm(`Are you sure you want to unfriend this user?`)) {
                    await makeApiCall(`${backendUrls.unfriend}/${friendId}`, 'POST');
                    currentUserData.friends = currentUserData.friends.filter(f => f.uId != friendId);
                    renderFriendList();
                    // alert(`Unfriended successfully!`); // makeApiCall đã alert
                }
            } else if (targetButton.classList.contains('accept-request-btn') && requestId) {
                const acceptedFriendData = await makeApiCall(`${backendUrls.acceptFriendRequest}/${requestId}`, 'POST');
                const requestIndex = currentUserData.friendRequests.received.findIndex(r => r.uId == requestId);
                if (requestIndex > -1) {
                    const acceptedRequestInfo = currentUserData.friendRequests.received.splice(requestIndex, 1)[0];
                    // Tạo đối tượng friend mới dựa trên thông tin từ request và phản hồi API (nếu có)
                    const newFriend = {
                        uId: acceptedRequestInfo.uId,
                        name: acceptedRequestInfo.name,
                        avatar: acceptedRequestInfo.avatar, // Sử dụng avatar từ request
                        username: acceptedRequestInfo.username, // Giả sử có username
                        // ... các trường khác từ acceptedFriendData nếu API trả về đầy đủ UserResponseDTO
                        ...(typeof acceptedFriendData === 'object' ? acceptedFriendData : {})
                    };
                    currentUserData.friends.push(newFriend);
                }
                renderFriendList();
                renderFriendRequests('received');
                // alert(`Friend request accepted!`);
            } else if (targetButton.classList.contains('decline-request-btn') && requestId) {
                await makeApiCall(`${backendUrls.declineFriendRequest}/${requestId}`, 'POST');
                currentUserData.friendRequests.received = currentUserData.friendRequests.received.filter(r => r.uId != requestId);
                renderFriendRequests('received');
                // alert(`Friend request declined.`);
            } else if (targetButton.classList.contains('cancel-request-btn') && requestId) {
                await makeApiCall(`${backendUrls.cancelFriendRequest}/${requestId}`, 'POST');
                currentUserData.friendRequests.sent = currentUserData.friendRequests.sent.filter(r => r.uId != requestId);
                renderFriendRequests('sent');
                // alert(`Friend request cancelled.`);
            } else if (targetButton.classList.contains('send-request-btn') && userId && !targetButton.disabled) {
                await makeApiCall(`${backendUrls.sendFriendRequest}/${userId}`, 'POST');
                const searchItem = targetButton.closest('li');
                let name = 'User', avatar = defaultAvatarUrl, username = 'user';
                if(searchItem) {
                    const nameSpan = searchItem.querySelector('a span');
                    if (nameSpan) {
                        const nameAndUser = nameSpan.textContent.match(/(.+)\s\(@(.+)\)/);
                        if (nameAndUser) {
                            name = nameAndUser[1];
                            username = nameAndUser[2];
                        } else {
                            name = nameSpan.textContent;
                        }
                    }
                    const img = searchItem.querySelector('img');
                    if (img) avatar = img.src;
                }
                // SỬA Ở ĐÂY: Tạo đối tượng request với trường 'avatar'
                currentUserData.friendRequests.sent.push({ uId: parseInt(userId), name: name, avatar: avatar, username: username });
                renderFriendRequests('sent');
                targetButton.disabled = true;
                targetButton.innerHTML = '<i class="fas fa-check"></i>';
                targetButton.title = 'Request Sent';
                // alert(`Friend request sent!`);
            }
        } catch (e) { /* Error handled */ }
    });

    const sendFriendRequestBtnProfile = document.getElementById('sendFriendRequestBtn');
    const acceptFriendBtnProfile = document.getElementById('acceptFriendBtn');
    const declineFriendBtnProfile = document.getElementById('declineFriendBtn');

    if (sendFriendRequestBtnProfile) {
        // ... (giữ nguyên)
        sendFriendRequestBtnProfile.addEventListener('click', async function () {
            const targetId = this.getAttribute('data-target-id');
            if (!targetId) return;
            try {
                await makeApiCall(`${backendUrls.sendFriendRequest}/${targetId}`, 'POST');
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-check"></i> Request Sent';
            } catch (e) { /* Failed already alerted */ }
        });
    }
    if (acceptFriendBtnProfile) {
        // ... (giữ nguyên)
        acceptFriendBtnProfile.addEventListener('click', async function () {
            const requesterId = this.getAttribute('data-requester-id');
            if (!requesterId) return;
            try {
                await makeApiCall(`${backendUrls.acceptFriendRequest}/${requesterId}`, 'POST');
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-users"></i> Friends';
                if(declineFriendBtnProfile) declineFriendBtnProfile.style.display = 'none';
            } catch (e) { /* Failed */ }
        });
    }
    if (declineFriendBtnProfile) {
        // ... (giữ nguyên)
        declineFriendBtnProfile.addEventListener('click', async function () {
            const requesterId = this.getAttribute('data-requester-id');
            if (!requesterId) return;
            try {
                await makeApiCall(`${backendUrls.declineFriendRequest}/${requesterId}`, 'POST');
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-times"></i> Declined';
                if(acceptFriendBtnProfile) acceptFriendBtnProfile.style.display = 'none';
            } catch (e) { /* Failed */ }
        });
    }

    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        // ... (giữ nguyên)
        logoutButton.addEventListener("click", (event) => {
            if (!confirm("Are you sure you want to logout?")) {
                event.preventDefault();
            }
        });
    }

    function initializePage() {
        if (!currentUserData && !viewOnly) {
            console.error("Current user data not available for own profile.");
        }
        loadProfileDisplayData();
        if (!viewOnly) {
            renderFriendList();
            renderFriendRequests('received');
            const receivedTab = document.querySelector('.fr-tab-btn[data-tab="received"]');
            const sentTab = document.querySelector('.fr-tab-btn[data-tab="sent"]');
            if (receivedTab) receivedTab.classList.add('active');
            if (sentTab) sentTab.classList.remove('active');
        }
        if (userEditFormInitialData && editProfileView && profileView) {
            profileView.style.display = 'none';
            profileView.classList.remove('profile-view-active');
            editProfileView.style.display = 'block';
            loadEditFormData();
        }
    }
    initializePage();
});