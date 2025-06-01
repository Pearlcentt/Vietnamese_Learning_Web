document.addEventListener('DOMContentLoaded', () => {
    // --- Access server-provided data (from the <script th:inline="javascript"> block) ---
    const currentUserData = window.serverData.currentUser;
    const sampleAvatars = window.serverData.sampleAvatars;
    const defaultAvatarUrl = window.serverData.defaultAvatarUrl;
    const csrfToken = window.serverData.csrfToken;
    const csrfHeaderName = window.serverData.csrfHeaderName;
    const backendUrls = window.serverData.urls;

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
    const editUsernameInput = document.getElementById('editUsernameInput'); // Username is usually read-only
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
    const noFriendRequestsMessage = document.getElementById('noFriendRequestsMessage');

    const friendListUi = document.getElementById('friendListUi');
    const noFriendsMessage = document.getElementById('noFriendsMessage');

    let currentSelectedAvatarInModal = currentUserData ? currentUserData.avatarUrl : defaultAvatarUrl;

    // --- Helper function for AJAX calls ---
    async function makeApiCall(url, method = 'GET', body = null, isFormData = false) {
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
                options.body = body; // body is already FormData
            } else {
                headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify(body);
            }
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.text(); // Or response.json() if your backend sends JSON errors
                console.error('API Error:', response.status, errorData);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
            }
            if (response.headers.get("content-type")?.includes("application/json")) {
                return await response.json();
            }
            return await response.text(); // Or handle other content types
        } catch (error) {
            console.error('Fetch error:', error);
            alert('An error occurred. Please try again.');
            throw error;
        }
    }


    // --- Functions ---
    function loadProfileDisplayData() {
        if (!currentUserData) return;

        displayNameEl.textContent = currentUserData.displayName;
        usernameEl.textContent = currentUserData.username;
        joinedDateEl.textContent = currentUserData.joinedDate;
        followingCountEl.textContent = currentUserData.followingCount;
        followersCountEl.textContent = currentUserData.followersCount;
        dayStreakEl.textContent = currentUserData.dayStreak;
        totalXPEl.textContent = currentUserData.totalXP;
        currentLeagueEl.textContent = currentUserData.currentLeague;
        top3FinishesEl.textContent = currentUserData.top3Finishes;
        profileAvatarDisplay.src = currentUserData.avatarUrl || defaultAvatarUrl;
    }

    function loadEditFormData() {
        if (!currentUserData) return;

        editNameInput.value = currentUserData.displayName;
        editUsernameInput.value = currentUserData.username; // Usually not editable
        editEmailInput.value = currentUserData.email;
        editAvatarPreview.src = currentUserData.avatarUrl || defaultAvatarUrl;
        selectedAvatarUrlInput.value = currentUserData.avatarUrl || defaultAvatarUrl;
        editCurrentPasswordInput.value = "";
        editNewPasswordInput.value = "";
    }

    function loadSidebarBadges() {
        if (!currentUserData || !currentUserData.languageLearning) return;

        const lang = currentUserData.languageLearning;
        if (userFlagSidebar) userFlagSidebar.src = lang.flag || defaultAvatarUrl; // Use a default flag image
        if (userLanguageSidebar) userLanguageSidebar.textContent = lang.name ? lang.name.toUpperCase() : 'LANGUAGE';
        if (userStreakSidebar) userStreakSidebar.textContent = lang.streak || 0;
        if (userGemsSidebar) userGemsSidebar.textContent = lang.gems || 0;
    }

    function renderFriendList() {
        friendListUi.innerHTML = '';
        const friends = currentUserData && currentUserData.friends ? currentUserData.friends : [];

        if (friends.length === 0) {
            if (noFriendsMessage) noFriendsMessage.style.display = 'block';
        } else {
            if (noFriendsMessage) noFriendsMessage.style.display = 'none';
            friends.forEach(friend => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <img src="${friend.avatar || defaultAvatarUrl}" alt="${friend.name} Avatar">
                    <span>${friend.name}</span>
                    <button class="unfriend-btn" data-friend-id="${friend.id}" title="Unfriend"><i class="fas fa-user-minus"></i></button>
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

        friendRequestsListUiReceived.style.display = type === 'received' ? 'block' : 'none';
        friendRequestsListUiSent.style.display = type === 'sent' ? 'block' : 'none';

        const activeListVisible = (type === 'received' && friendRequestsListUiReceived.style.display === 'block') ||
            (type === 'sent' && friendRequestsListUiSent.style.display === 'block');

        if (requests.length === 0) {
            if (noFriendRequestsMessage && activeListVisible) {
                noFriendRequestsMessage.style.display = 'block';
            }
        } else {
            if (noFriendRequestsMessage) noFriendRequestsMessage.style.display = 'none';
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
                    <img src="${request.avatar || defaultAvatarUrl}" alt="${request.name} Avatar">
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
        currentSelectedAvatarInModal = currentUserData ? currentUserData.avatarUrl : defaultAvatarUrl;
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
        confirmAvatarSelectionBtn.addEventListener('click', async () => {
            if (currentSelectedAvatarInModal && currentUserData) {
                // Optimistic update
                currentUserData.avatarUrl = currentSelectedAvatarInModal;
                if (profileAvatarDisplay) profileAvatarDisplay.src = currentSelectedAvatarInModal;
                if (editAvatarPreview) editAvatarPreview.src = currentSelectedAvatarInModal;
                if (selectedAvatarUrlInput) selectedAvatarUrlInput.value = currentSelectedAvatarInModal;

                console.log("Avatar selected (from list):", currentSelectedAvatarInModal);
                // **BACKEND INTEGRATION POINT**: Send selectedAvatarUrlInput.value with the main profile update form
                // Or, if you want to update avatar immediately:
                // try {
                //    await makeApiCall(backendUrls.updateProfile, 'POST', { avatarUrl: currentSelectedAvatarInModal });
                //    alert('Avatar updated!');
                // } catch (e) { /* handle error, revert optimistic update if needed */ }
            }
            closeAvatarModal();
        });
    }

    if (avatarUploadInput) {
        avatarUploadInput.addEventListener('change', async function (event) {
            if (event.target.files && event.target.files[0]) {
                const file = event.target.files[0];
                const formData = new FormData();
                formData.append('avatarFile', file);

                try {
                    const response = await makeApiCall(backendUrls.uploadAvatar, 'POST', formData, true);
                    const uploadedImageUrl = typeof response === 'string' ? response : response.avatarUrl; // Adjust based on server response

                    if (currentUserData) currentUserData.avatarUrl = uploadedImageUrl;
                    if (profileAvatarDisplay) profileAvatarDisplay.src = uploadedImageUrl;
                    if (editAvatarPreview) editAvatarPreview.src = uploadedImageUrl;
                    if (selectedAvatarUrlInput) selectedAvatarUrlInput.value = uploadedImageUrl;

                    console.log("Avatar uploaded and URL received:", uploadedImageUrl);
                    alert('Avatar uploaded successfully!');
                    closeAvatarModal();
                } catch (e) {
                    alert('Avatar upload failed.');
                }
            }
        });
    }

    // --- Event Listeners ---
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
            const formData = {
                displayName: editNameInput.value,
                email: editEmailInput.value,
                selectedAvatarUrl: selectedAvatarUrlInput.value, // This should be the URL of the chosen avatar
                currentPassword: editCurrentPasswordInput.value,
                newPassword: editNewPasswordInput.value
            };

            try {
                const updatedUser = await makeApiCall(backendUrls.updateProfile, 'POST', formData);
                // Assuming server returns the updated user object or relevant parts
                if (currentUserData && updatedUser) { // Merge or replace currentUserData
                    Object.assign(currentUserData, updatedUser); // Simple merge, adjust as needed
                }

                alert('Profile updated successfully!');
                loadProfileDisplayData(); // Refresh main view
                if (editProfileView) editProfileView.style.display = 'none';
                if (profileView) profileView.style.display = 'block';
                if (profileView) profileView.classList.add('profile-view-active');

            } catch (error) {
                alert('Failed to update profile. Please check the details and try again.');
            }
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
            this.classList.toggle('fa-eye-slash'); // Show slash when text
            this.classList.toggle('fa-eye', type === 'password'); // Show eye when password
        });
    });

    if (searchFriendBtn && findFriendInput) {
        searchFriendBtn.addEventListener('click', async () => {
            const searchTerm = findFriendInput.value.trim();
            searchResultsUi.innerHTML = '';
            if (!searchTerm) {
                searchResultsUi.innerHTML = '<li>Please enter a name to search.</li>';
                return;
            }

            try {
                const results = await makeApiCall(`${backendUrls.searchFriends}?query=${encodeURIComponent(searchTerm)}`, 'GET');
                if (results && results.length > 0) {
                    results.forEach(user => {
                        const li = document.createElement('li');
                        // Check if already friends or request sent
                        const isFriend = currentUserData.friends.some(f => f.id === user.id);
                        const isRequestSent = currentUserData.friendRequests.sent.some(r => r.id === user.id);
                        let buttonHtml = `<button class="send-request-btn" data-user-id="${user.id}" title="Send Friend Request"><i class="fas fa-user-plus"></i></button>`;
                        if (isFriend) {
                            buttonHtml = `<button disabled class="send-request-btn"><i class="fas fa-users"></i></button>`; // Already friends
                        } else if (isRequestSent) {
                            buttonHtml = `<button disabled class="send-request-btn"><i class="fas fa-check"></i></button>`; // Request sent
                        }

                        li.innerHTML = `
                            <img src="${user.avatar || defaultAvatarUrl}" alt="${user.name} Avatar">
                            <span>${user.name}</span>
                            ${buttonHtml}
                        `;
                        searchResultsUi.appendChild(li);
                    });
                } else {
                    searchResultsUi.innerHTML = '<li>No users found matching your search.</li>';
                }
            } catch (error) {
                searchResultsUi.innerHTML = '<li>Error searching for friends.</li>';
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
    document.body.addEventListener('click', async function (event) {
        const unfriendBtn = event.target.closest('.unfriend-btn');
        const acceptRequestBtn = event.target.closest('.accept-request-btn');
        const declineRequestBtn = event.target.closest('.decline-request-btn');
        const cancelRequestBtn = event.target.closest('.cancel-request-btn');
        const sendRequestBtn = event.target.closest('.send-request-btn');

        if (unfriendBtn) {
            const friendId = unfriendBtn.dataset.friendId;
            if (confirm(`Are you sure you want to unfriend this user?`)) {
                try {
                    await makeApiCall(`${backendUrls.unfriend}/${friendId}`, 'POST');
                    currentUserData.friends = currentUserData.friends.filter(f => f.id != friendId);
                    renderFriendList();
                    alert(`Unfriended successfully!`);
                } catch (e) { /* Error already handled by makeApiCall */ }
            }
        }
        if (acceptRequestBtn) {
            const requestId = acceptRequestBtn.dataset.requestId;
            try {
                const acceptedFriend = await makeApiCall(`${backendUrls.acceptFriendRequest}/${requestId}`, 'POST');
                const request = currentUserData.friendRequests.received.find(r => r.id == requestId);
                if (request) {
                    currentUserData.friends.push({ ...request, ...acceptedFriend }); // Use data from server if available
                    currentUserData.friendRequests.received = currentUserData.friendRequests.received.filter(r => r.id != requestId);
                }
                renderFriendList();
                renderFriendRequests('received');
                alert(`Friend request accepted!`);
            } catch (e) { /* Error handled */ }
        }
        if (declineRequestBtn) {
            const requestId = declineRequestBtn.dataset.requestId;
            try {
                await makeApiCall(`${backendUrls.declineFriendRequest}/${requestId}`, 'POST');
                currentUserData.friendRequests.received = currentUserData.friendRequests.received.filter(r => r.id != requestId);
                renderFriendRequests('received');
                alert(`Friend request declined.`);
            } catch (e) { /* Error handled */ }
        }
        if (cancelRequestBtn) {
            const requestId = cancelRequestBtn.dataset.requestId;
            try {
                await makeApiCall(`${backendUrls.cancelFriendRequest}/${requestId}`, 'POST');
                currentUserData.friendRequests.sent = currentUserData.friendRequests.sent.filter(r => r.id != requestId);
                renderFriendRequests('sent');
                alert(`Friend request cancelled.`);
            } catch (e) { /* Error handled */ }
        }
        if (sendRequestBtn && !sendRequestBtn.disabled) {
            const userId = sendRequestBtn.dataset.userId;
            try {
                await makeApiCall(`${backendUrls.sendFriendRequest}/${userId}`, 'POST');
                // Optimistically update UI or refetch data
                const targetUser = { id: userId, name: sendRequestBtn.parentElement.querySelector('span').textContent, avatar: sendRequestBtn.parentElement.querySelector('img').src };
                currentUserData.friendRequests.sent.push(targetUser);
                renderFriendRequests('sent'); // To update count and list if visible

                sendRequestBtn.disabled = true;
                sendRequestBtn.innerHTML = '<i class="fas fa-check"></i>';
                alert(`Friend request sent!`);
            } catch (e) { /* Error handled */ }
        }
    });

    // --- Initial Load ---
    function initializePage() {
        if (!currentUserData) {
            console.error("Current user data not available. Page cannot be initialized.");
            // Potentially redirect to login or show an error message
            // For now, try to make parts of the page work if possible or just return
            // document.body.innerHTML = "<h1>Error: User data not loaded. Please try logging in again.</h1>";
            // return;
        }
        loadProfileDisplayData();
        loadSidebarBadges();
        renderFriendList();
        renderFriendRequests('received');

        const receivedTab = document.querySelector('.fr-tab-btn[data-tab="received"]');
        const sentTab = document.querySelector('.fr-tab-btn[data-tab="sent"]');
        if (receivedTab) receivedTab.classList.add('active');
        if (sentTab) sentTab.classList.remove('active');

    }

    initializePage();
});