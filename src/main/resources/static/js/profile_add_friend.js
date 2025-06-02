document.addEventListener('DOMContentLoaded', () => {
    console.log('DEBUG: profile_add_friend.js loaded and DOM ready');

    const currentUserData = window.serverData.currentUser;
    const profileUserData = window.serverData.profileUser;
    const isOwnProfile = window.serverData.isOwnProfile;
    const sampleAvatars = window.serverData.sampleAvatars;
    const defaultAvatarUrl = window.serverData.defaultAvatarUrl || '/images/avatar3.png';
    const csrfToken = window.serverData.csrfToken;
    const csrfHeaderName = window.serverData.csrfHeaderName;
    const backendUrls = window.serverData.urls;

    console.log('DEBUG: serverData loaded:', window.serverData);
    if (!currentUserData) {
        console.warn('DEBUG: currentUserData is null or undefined. Friend-related functionalities might be affected.');
    } else {
        console.log('DEBUG: currentUserData:', currentUserData);
    }
    console.log('DEBUG: profileUserData:', profileUserData);

    const profileView = document.getElementById('profileView');
    const editProfileView = document.getElementById('editProfileView');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const cancelEditProfileBtn = document.getElementById('cancelEditProfileBtn');
    const editProfileForm = document.getElementById('editProfileForm');

    const profileAvatarDisplay = document.getElementById('profileAvatarDisplay');
    const displayNameEl = document.getElementById('displayName');
    const usernameEl = document.getElementById('username');
    const joinedDateEl = document.getElementById('joinedDate');
    const friendsCountEl = document.getElementById('followingCount');
    const dayStreakEl = document.getElementById('dayStreak');
    const totalXPEl = document.getElementById('totalXP');
    const currentLeagueEl = document.getElementById('currentLeague');
    const top3FinishesEl = document.getElementById('top3Finishes');

    const editAvatarPreview = document.getElementById('editAvatarPreview');
    const selectedAvatarUrlInput = document.getElementById('selectedAvatarUrlInput');
    const editNameInput = document.getElementById('editNameInput');
    const editUsernameInput = document.getElementById('editUsernameInput');
    const editEmailInput = document.getElementById('editEmailInput');
    const editCurrentPasswordInput = document.getElementById('editCurrentPasswordInput');
    const editNewPasswordInput = document.getElementById('editNewPasswordInput');

    const avatarModal = document.getElementById('avatarModal');
    const openAvatarModalBtnMain = document.getElementById('openAvatarModalBtnMain');
    const openAvatarModalBtnEdit = document.getElementById('openAvatarModalBtnEdit');
    const closeAvatarModalBtn = document.getElementById('closeAvatarModalBtn');
    const avatarSelectionGrid = document.getElementById('avatarSelectionGrid');
    const confirmAvatarSelectionBtn = document.getElementById('confirmAvatarSelectionBtn');
    const avatarUploadInput = document.getElementById('avatarUpload');

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
    const noFriendsMessageOtherUser = document.getElementById('noFriendsMessageOtherUser');

    let currentSelectedAvatarInModal = currentUserData ? (currentUserData.avatar || defaultAvatarUrl) : defaultAvatarUrl;

    const mockUsersDatabase = [
        { uId: 55, username: 'HellNah', name: 'Hell Nah Indeed', avatar: '/images/avatar1.png' },
        { uId: 2, username: 'frienduser1', name: 'Friendly User One', avatar: '/images/avatar2.png' },
        { uId: 101, username: 'AliceWonder', name: 'Alice W.', avatar: '/images/avatar4.png' },
        { uId: 102, username: 'BobBuilder', name: 'Bob B.', avatar: '/images/avatar5.png' },
        { uId: 103, username: 'CharlieChap', name: 'Charlie C.', avatar: '/images/avatar6.png' },
        { uId: 104, username: 'DianaPrince', name: 'Diana P.', avatar: '/images/avatar7.png' },
        { uId: 105, username: 'UserNew', name: 'New User Test', avatar: '/images/avatar3.png' }
    ];

    async function makeApiCall(url, method = 'GET', body = null, isFormData = false) {
        console.log(`DEBUG: makeApiCall: ${method} ${url}`, body);
        const headers = {};
        if (csrfToken && csrfHeaderName) {
            headers[csrfHeaderName] = csrfToken;
        }
        const options = { method, headers };
        if (body) {
            if (isFormData) {
                options.body = body;
            } else {
                headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify(body);
            }
        }
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorText = await response.text();
                let detailedMessage = errorText;
                try {
                    const errorJson = JSON.parse(errorText);
                    if (errorJson && errorJson.message) detailedMessage = errorJson.message;
                } catch (e) { /* Not JSON, use raw text */ }
                console.error(`API Error: ${response.status} ${response.statusText} - ${detailedMessage}`);
                throw { status: response.status, message: detailedMessage || response.statusText, isApiError: true };
            }
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            }
            return await response.text();
        } catch (error) {
            if (!error.isApiError) {
                console.error('Fetch error (non-API):', error);
            }
            throw error;
        }
    }

    async function verifyUserSession() {
        try {
            const response = await makeApiCall('/api/auth/check', 'GET');
            if (response && response.authenticated && response.user) {
                console.log('DEBUG: Session verified, user data:', response.user);
                window.serverData.currentUser = response.user;
                return response.user;
            } else {
                console.warn('DEBUG: Session check returned no user data.');
                return null;
            }
        } catch (error) {
            console.error('DEBUG: Session verification failed:', error);
            return null;
        }
    }

    function showUserMessage(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert-message alert-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => { notification.style.opacity = '1'; }, 10);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => { if (document.body.contains(notification)) document.body.removeChild(notification); }, 500);
        }, 3000 + (message.length * 50));
    }

    function loadProfileDisplayData() {
        const displayUser = profileUserData;
        if (!displayUser) {
            console.warn("Profile user data (profileUserData) not available for display.");
            if (displayNameEl) displayNameEl.textContent = 'User Name';
            if (usernameEl) usernameEl.textContent = 'username';
            if (joinedDateEl) joinedDateEl.textContent = 'Unknown Date';
            if (friendsCountEl) friendsCountEl.textContent = '0';
            if (dayStreakEl) dayStreakEl.textContent = '0';
            if (totalXPEl) totalXPEl.textContent = '0';
            if (currentLeagueEl) currentLeagueEl.textContent = 'None';
            if (top3FinishesEl) top3FinishesEl.textContent = '0';
            if (profileAvatarDisplay) profileAvatarDisplay.src = defaultAvatarUrl;
            return;
        }

        if (displayNameEl) displayNameEl.textContent = displayUser.name || 'User Name';
        if (usernameEl) usernameEl.textContent = displayUser.username || 'username';
        if (joinedDateEl && displayUser.dateCreated) {
            try {
                const date = new Date(displayUser.dateCreated);
                joinedDateEl.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            } catch (e) {
                console.warn("Error formatting joinedDate:", e);
                joinedDateEl.textContent = "Unknown Date";
            }
        } else if (joinedDateEl) {
            joinedDateEl.textContent = "Unknown Date";
        }

        const friendCount = displayUser.friends ? displayUser.friends.length : 0;
        if (friendsCountEl) friendsCountEl.textContent = friendCount.toString();

        if (dayStreakEl) dayStreakEl.textContent = (displayUser.streak || 0).toString();
        if (totalXPEl) totalXPEl.textContent = (displayUser.gems || 0).toString();
        if (currentLeagueEl) currentLeagueEl.textContent = displayUser.currentLeague || 'None';
        if (top3FinishesEl) top3FinishesEl.textContent = (displayUser.top3Finishes || 0).toString();
        if (profileAvatarDisplay) profileAvatarDisplay.src = displayUser.avatar || defaultAvatarUrl;

        if (isOwnProfile) {
            if (noFriendsMessage) noFriendsMessage.style.display = (currentUserData && currentUserData.friends && currentUserData.friends.length > 0) ? 'none' : 'block';
            if (noFriendsMessageOtherUser) noFriendsMessageOtherUser.style.display = 'none';
        } else {
            if (noFriendsMessage) noFriendsMessage.style.display = 'none';
            if (noFriendsMessageOtherUser) {
                const hasFriends = displayUser.friends && displayUser.friends.length > 0;
                noFriendsMessageOtherUser.style.display = hasFriends ? 'none' : 'block';
                if (!hasFriends) {
                    noFriendsMessageOtherUser.textContent = `${displayUser.name || 'This user'} has no friends yet.`;
                }
            }
        }
    }

    function loadEditFormData() {
        if (!currentUserData || !editProfileForm) {
            console.warn("Cannot load edit form data: currentUserData or form element missing.");
            return;
        }
        if (editNameInput) editNameInput.value = currentUserData.name || '';
        if (editUsernameInput) editUsernameInput.value = currentUserData.username || '';
        if (editEmailInput) editEmailInput.value = currentUserData.email || '';
        if (editAvatarPreview) editAvatarPreview.src = currentUserData.avatar || defaultAvatarUrl;
        if (selectedAvatarUrlInput) selectedAvatarUrlInput.value = currentUserData.avatar || defaultAvatarUrl;
        if (editCurrentPasswordInput) editCurrentPasswordInput.value = "";
        if (editNewPasswordInput) editNewPasswordInput.value = "";
    }

    function loadSidebarBadges() {
        if (!currentUserData || !currentUserData.languageLearning) {
            return;
        }
        const lang = currentUserData.languageLearning;
        if (userFlagSidebar) userFlagSidebar.src = lang.flag || '/images/default-flag.png';
        if (userLanguageSidebar) userLanguageSidebar.textContent = lang.name ? lang.name.toUpperCase() : 'LANGUAGE';
        if (userStreakSidebar) userStreakSidebar.textContent = (lang.streak || 0).toString();
        if (userGemsSidebar) userGemsSidebar.textContent = (lang.gems || 0).toString();
    }

    function renderFriendList() {
        if (!friendListUi || !currentUserData) return;
        friendListUi.innerHTML = '';
        const friends = currentUserData.friends || [];
        if (noFriendsMessage) noFriendsMessage.style.display = (friends.length === 0 && isOwnProfile) ? 'block' : 'none';

        friends.forEach(friend => {
            const friendId = friend.uId;
            if (friendId === undefined) { console.warn("Friend object missing uId:", friend); return; }
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${friend.avatar || defaultAvatarUrl}" alt="${friend.name || 'Friend'}'s Avatar">
                <a href="/profile_add_friend/${friendId}" class="user-profile-link"><span>${friend.name || 'Friend'}</span></a>
                <button class="unfriend-btn" data-friend-id="${friendId}" title="Unfriend"><i class="fas fa-user-minus"></i></button>
            `;
            friendListUi.appendChild(li);
        });
    }

    function renderFriendRequests(type = 'received') {
        const listUi = type === 'received' ? friendRequestsListUiReceived : friendRequestsListUiSent;
        if (!listUi || !currentUserData || !currentUserData.friendRequests) {
            console.warn(`Cannot render friend requests ('${type}'): list UI, currentUserData, or friendRequests missing.`);
            return;
        }

        const requests = currentUserData.friendRequests[type] || [];
        listUi.innerHTML = '';

        if (receivedRequestCountBadge) receivedRequestCountBadge.textContent = (currentUserData.friendRequests.received?.length || 0).toString();
        if (sentRequestCountBadge) sentRequestCountBadge.textContent = (currentUserData.friendRequests.sent?.length || 0).toString();

        if (friendRequestsListUiReceived) friendRequestsListUiReceived.style.display = type === 'received' ? 'block' : 'none';
        if (friendRequestsListUiSent) friendRequestsListUiSent.style.display = type === 'sent' ? 'block' : 'none';

        const activeListIsVisible = listUi.style.display === 'block';
        if (noFriendRequestsMessage) noFriendRequestsMessage.style.display = (requests.length === 0 && activeListIsVisible) ? 'block' : 'none';

        requests.forEach(request => {
            const requesterOrTargetId = request.uId;
            if (requesterOrTargetId === undefined) { console.warn("Friend request object missing uId:", request); return; }

            const li = document.createElement('li');
            let actionsHtml = '';
            if (type === 'received') {
                actionsHtml = `
                    <button class="accept-request-btn" data-request-id="${requesterOrTargetId}" title="Accept"><i class="fas fa-check"></i></button>
                    <button class="decline-request-btn" data-request-id="${requesterOrTargetId}" title="Decline"><i class="fas fa-times"></i></button>
                `;
            } else {
                actionsHtml = `
                    <button class="cancel-request-btn" data-request-id="${requesterOrTargetId}" title="Cancel Request"><i class="fas fa-ban"></i></button>
                `;
            }
            li.innerHTML = `
                <img src="${request.avatar || defaultAvatarUrl}" alt="${request.name || 'User'}'s Avatar">
                <a href="/profile_add_friend/${requesterOrTargetId}" class="user-profile-link"><span class="fr-info-name">${request.name || 'User'}</span></a>
                <div class="fr-actions-btns">${actionsHtml}</div>
            `;
            listUi.appendChild(li);
        });
    }

    function populateAvatarSelectionGrid() {
        if (!avatarSelectionGrid) return;
        avatarSelectionGrid.innerHTML = '';
        (sampleAvatars || []).forEach(avatarSrc => {
            const img = document.createElement('img');
            img.src = avatarSrc; img.alt = "Avatar option"; img.classList.add('avatar-option'); img.dataset.src = avatarSrc;
            if (avatarSrc === currentSelectedAvatarInModal) img.classList.add('selected');
            img.addEventListener('click', () => {
                avatarSelectionGrid.querySelectorAll('.avatar-option.selected').forEach(el => el.classList.remove('selected'));
                img.classList.add('selected'); currentSelectedAvatarInModal = img.dataset.src;
            });
            avatarSelectionGrid.appendChild(img);
        });
    }

    function openAvatarModal() {
        if (!avatarModal) return;
        currentSelectedAvatarInModal = currentUserData ? (currentUserData.avatar || defaultAvatarUrl) : defaultAvatarUrl;
        populateAvatarSelectionGrid(); avatarModal.style.display = 'block';
    }
    function closeAvatarModal() { if (avatarModal) avatarModal.style.display = 'none'; }

    if (openAvatarModalBtnMain) openAvatarModalBtnMain.addEventListener('click', openAvatarModal);
    if (openAvatarModalBtnEdit) openAvatarModalBtnEdit.addEventListener('click', openAvatarModal);
    if (closeAvatarModalBtn) closeAvatarModalBtn.addEventListener('click', closeAvatarModal);
    window.addEventListener('click', (event) => { if (avatarModal && event.target == avatarModal) closeAvatarModal(); });

    if (confirmAvatarSelectionBtn) {
        confirmAvatarSelectionBtn.addEventListener('click', () => {
            if (currentSelectedAvatarInModal) {
                if (profileAvatarDisplay && isOwnProfile) profileAvatarDisplay.src = currentSelectedAvatarInModal;
                if (editAvatarPreview) editAvatarPreview.src = currentSelectedAvatarInModal;
                if (selectedAvatarUrlInput) selectedAvatarUrlInput.value = currentSelectedAvatarInModal;
            }
            closeAvatarModal();
        });
    }

    if (avatarUploadInput) {
        avatarUploadInput.addEventListener('change', function (event) {
            if (event.target.files && event.target.files[0]) {
                const file = event.target.files[0];
                if (!file.type.startsWith('image/')) {
                    showUserMessage('Please select an image file.', 'error');
                    return;
                }
                if (file.size > 2 * 1024 * 1024) {
                    showUserMessage('File is too large. Max 2MB allowed.', 'error');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    const uploadedImageUrl = e.target.result;
                    if (profileAvatarDisplay && isOwnProfile) profileAvatarDisplay.src = uploadedImageUrl;
                    if (editAvatarPreview) editAvatarPreview.src = uploadedImageUrl;
                    if (selectedAvatarUrlInput) selectedAvatarUrlInput.value = uploadedImageUrl;
                    showUserMessage('Avatar preview updated from upload!', 'info');
                }
                reader.readAsDataURL(file);
                closeAvatarModal();
            }
        });
    }

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            if (profileView) { profileView.style.display = 'none'; profileView.classList.remove('profile-view-active'); }
            if (editProfileView) editProfileView.style.display = 'block';
            loadEditFormData();
        });
    }
    if (cancelEditProfileBtn) {
        cancelEditProfileBtn.addEventListener('click', () => {
            if (editProfileView) editProfileView.style.display = 'none';
            if (profileView) { profileView.style.display = 'block'; profileView.classList.add('profile-view-active'); }
        });
    }

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(editProfileForm);
            try {
                const response = await makeApiCall(backendUrls.updateProfile, 'POST', formData, true);
                if (response && response.success && response.user) {
                    if (currentUserData) Object.assign(currentUserData, response.user);
                    window.location.href = `/profile_add_friend?success_update=true`;
                } else {
                    let errorMessage = (response && response.message) ? response.message : 'Failed to update profile.';
                    if (response && response.errors) {
                        errorMessage += ` ${Object.values(response.errors).join(' ')}`;
                    }
                    window.location.href = `/profile_add_friend?error_update=${encodeURIComponent(errorMessage)}`;
                }
            } catch (error) {
                console.error('Profile update error:', error);
                window.location.href = `/profile_add_friend?error_update=${encodeURIComponent(error.message || 'An unexpected error occurred.')}`;
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
            if (icon) { icon.classList.toggle('fa-chevron-right', isActive); icon.classList.toggle('fa-chevron-down', !isActive); }
        });
    }
    toggleCollapsible(findFriendsToggle, findFriendsContent);
    toggleCollapsible(friendRequestsToggle, friendRequestsContent);

    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const passwordInput = this.previousElementSibling;
            if (passwordInput && passwordInput.tagName === 'INPUT') {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash', type === 'text');
                this.classList.toggle('fa-eye', type === 'password');
            }
        });
    });

    if (searchFriendBtn && findFriendInput && searchResultsUi) {
        searchFriendBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            const searchTerm = findFriendInput.value.trim();
            searchResultsUi.innerHTML = '';
            if (!searchTerm) {
                searchResultsUi.innerHTML = '<li>Please enter a username or name to search.</li>';
                return;
            }

            const searchTermLower = searchTerm.toLowerCase();
            const results = mockUsersDatabase.filter(user =>
                (currentUserData ? user.uId !== currentUserData.uId : true) &&
                (user.username.toLowerCase().includes(searchTermLower) || user.name.toLowerCase().includes(searchTermLower))
            );

            if (results.length > 0) {
                results.forEach(user => {
                    const userId = user.uId;
                    const userName = user.name || user.username;
                    const userAvatar = user.avatar || defaultAvatarUrl;

                    const li = document.createElement('li');
                    let buttonHtml = '';

                    if (currentUserData) {
                        const isFriend = currentUserData.friends?.some(f => f.uId === userId);
                        const isRequestSentByCurrentUser = currentUserData.friendRequests?.sent?.some(r => r.uId === userId);
                        const isRequestReceivedByCurrentUser = currentUserData.friendRequests?.received?.some(r => r.uId === userId);

                        if (isFriend) {
                            buttonHtml = `<button disabled class="friend-status-icon" title="Friends"><i class="fas fa-users"></i></button>`;
                        } else if (isRequestSentByCurrentUser) {
                            buttonHtml = `<button disabled class="friend-status-icon" title="Request Sent"><i class="fas fa-check"></i></button>`;
                        } else if (isRequestReceivedByCurrentUser) {
                            buttonHtml = `<button class="view-pending-request-btn friend-action-icon" data-user-id="${userId}" title="View Incoming Request"><i class="fas fa-envelope-open-text"></i></button>`;
                        } else {
                            buttonHtml = `<button class="send-request-btn friend-action-icon" data-user-id="${userId}" title="Add Friend"><i class="fas fa-user-plus"></i></button>`;
                        }
                    } else {
                        buttonHtml = `<button class="send-request-btn friend-action-icon" data-user-id="${userId}" title="Add Friend (Login Required)"><i class="fas fa-user-plus"></i></button>`;
                    }

                    li.innerHTML = `
                        <img src="${userAvatar}" alt="${userName}'s Avatar">
                        <a href="/profile_add_friend/${userId}" class="user-profile-link"><span>${userName}</span></a>
                        ${buttonHtml}`;
                    searchResultsUi.appendChild(li);
                });
            } else {
                searchResultsUi.innerHTML = '<li>No users found matching your search.</li>';
            }
        });
    }

    if (friendRequestTabs) {
        friendRequestTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                friendRequestTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                renderFriendRequests(this.dataset.tab);
            });
        });
    }

    document.body.addEventListener('click', async function (event) {
        const targetButton = event.target.closest('button.friend-action-icon, button.unfriend-btn, button.accept-request-btn, button.decline-request-btn, button.cancel-request-btn');

        if (!targetButton) return;

        let effectiveUserData = currentUserData;

        if (!effectiveUserData) {
            console.warn("DEBUG: currentUserData is null, attempting to verify session...");
            effectiveUserData = await verifyUserSession();
            if (!effectiveUserData) {
                showUserMessage('You need to be logged in to perform this action. Redirecting to login...', 'error');
                setTimeout(() => { window.location.href = '/login'; }, 2000);
                return;
            }
            window.serverData.currentUser = effectiveUserData;
        }

        if (!effectiveUserData.friendRequests) {
            effectiveUserData.friendRequests = { received: [], sent: [] };
        }
        effectiveUserData.friendRequests.received = effectiveUserData.friendRequests.received || [];
        effectiveUserData.friendRequests.sent = effectiveUserData.friendRequests.sent || [];
        effectiveUserData.friends = effectiveUserData.friends || [];

        if (targetButton.classList.contains('send-request-btn') && !targetButton.disabled) {
            const targetUserId = parseInt(targetButton.dataset.userId);
            if (!targetUserId || isNaN(targetUserId)) {
                console.error("Invalid targetUserId for send-request-btn");
                showUserMessage('Invalid user ID.', 'error');
                return;
            }

            console.log(`DEBUG: Clicked send-request-btn for user ID: ${targetUserId}`);
            try {
                const response = await makeApiCall(`${backendUrls.sendFriendRequest}/${targetUserId}`, 'POST');
                console.log(`DEBUG: API call to send friend request to ${targetUserId} succeeded. Response:`, response);

                const searchedUser = mockUsersDatabase.find(u => u.uId === targetUserId);
                const userData = searchedUser || { uId: targetUserId, name: 'User', avatar: defaultAvatarUrl };

                effectiveUserData.friendRequests.sent = effectiveUserData.friendRequests.sent.filter(req => req.uId !== targetUserId);
                effectiveUserData.friendRequests.sent.push({
                    uId: targetUserId,
                    name: userData.name,
                    avatar: userData.avatar
                });

                targetButton.classList.remove('friend-action-icon');
                targetButton.classList.add('friend-status-icon');
                targetButton.innerHTML = '<i class="fas fa-check"></i>';
                targetButton.disabled = true;
                targetButton.title = 'Request Sent';

                const sentTab = document.querySelector('.fr-tab-btn[data-tab="sent"]');
                if (sentTab && !sentTab.classList.contains('active')) {
                    sentTab.click();
                }

                renderFriendRequests('sent');
                showUserMessage('Friend request sent!', 'success');
                console.log('DEBUG: UI updated after sending friend request.');
            } catch (e) {
                showUserMessage(`Failed to send request: ${e.message || 'Try again.'}`, 'error');
                console.error("Error sending friend request from search:", e);
            }
        } else if (targetButton.classList.contains('view-pending-request-btn')) {
            if (friendRequestsToggle && friendRequestsContent) {
                if (friendRequestsContent.style.display !== 'block') {
                    friendRequestsToggle.click();
                }
                const receivedTab = document.querySelector('.fr-tab-btn[data-tab="received"]');
                if (receivedTab && !receivedTab.classList.contains('active')) {
                    receivedTab.click();
                }
                friendRequestsListUiReceived.scrollIntoView({ behavior: 'smooth', block: 'center' });
                showUserMessage('Switched to received friend requests.', 'info');
            }
        } else if (targetButton.classList.contains('unfriend-btn')) {
            const friendId = parseInt(targetButton.dataset.friendId);
            if (!friendId || isNaN(friendId) || !confirm(`Are you sure you want to unfriend this user?`)) return;
            try {
                await makeApiCall(`${backendUrls.unfriend}/${friendId}`, 'POST');
                effectiveUserData.friends = effectiveUserData.friends.filter(f => f.uId !== friendId);
                renderFriendList();
                showUserMessage(`Unfriended successfully!`, 'success');
                if (profileUserData && profileUserData.uId === friendId) window.location.reload();
            } catch (e) { showUserMessage(`Failed to unfriend: ${e.message || 'Try again.'}`, 'error'); }
        } else if (targetButton.classList.contains('accept-request-btn')) {
            const requesterId = parseInt(targetButton.dataset.requestId);
            if (!requesterId || isNaN(requesterId)) return;
            try {
                const acceptedFriendData = await makeApiCall(`${backendUrls.acceptFriendRequest}/${requesterId}`, 'POST');
                const request = effectiveUserData.friendRequests.received.find(r => r.uId === requesterId);
                if (request) {
                    effectiveUserData.friends.push({
                        uId: request.uId,
                        name: (acceptedFriendData && acceptedFriendData.name) ? acceptedFriendData.name : request.name,
                        avatar: (acceptedFriendData && acceptedFriendData.avatar) ? acceptedFriendData.avatar : request.avatar
                    });
                }
                effectiveUserData.friendRequests.received = effectiveUserData.friendRequests.received.filter(r => r.uId !== requesterId);
                renderFriendList();
                renderFriendRequests('received');
                showUserMessage(`Friend request accepted!`, 'success');
                if (profileUserData && profileUserData.uId === requesterId) window.location.reload();
            } catch (e) { showUserMessage(`Failed to accept request: ${e.message || 'Try again.'}`, 'error'); }
        } else if (targetButton.classList.contains('decline-request-btn')) {
            const requesterId = parseInt(targetButton.dataset.requestId);
            if (!requesterId || isNaN(requesterId)) return;
            try {
                await makeApiCall(`${backendUrls.declineFriendRequest}/${requesterId}`, 'POST');
                effectiveUserData.friendRequests.received = effectiveUserData.friendRequests.received.filter(r => r.uId !== requesterId);
                renderFriendRequests('received');
                showUserMessage(`Friend request declined.`, 'info');
                if (profileUserData && profileUserData.uId === requesterId) window.location.reload();
            } catch (e) { showUserMessage(`Failed to decline request: ${e.message || 'Try again.'}`, 'error'); }
        } else if (targetButton.classList.contains('cancel-request-btn')) {
            const targetId = parseInt(targetButton.dataset.requestId);
            if (!targetId || isNaN(targetId)) return;
            try {
                await makeApiCall(`${backendUrls.cancelFriendRequest}/${targetId}`, 'POST');
                effectiveUserData.friendRequests.sent = effectiveUserData.friendRequests.sent.filter(r => r.uId !== targetId);
                renderFriendRequests('sent');
                showUserMessage(`Friend request cancelled.`, 'info');
                if (profileUserData && profileUserData.uId === targetId) window.location.reload();
            } catch (e) { showUserMessage(`Failed to cancel request: ${e.message || 'Try again.'}`, 'error'); }
        }
    });

    const sendFriendRequestBtnProfile = document.getElementById('sendFriendRequestBtn');
    const acceptFriendBtnProfile = document.getElementById('acceptFriendBtn');
    const declineFriendBtnProfile = document.getElementById('declineFriendBtn');

    if (sendFriendRequestBtnProfile) {
        sendFriendRequestBtnProfile.addEventListener('click', async function () {
            let effectiveUserData = currentUserData;
            if (!effectiveUserData) {
                effectiveUserData = await verifyUserSession();
                if (!effectiveUserData) {
                    showUserMessage('You need to be logged in to perform this action. Redirecting to login...', 'error');
                    setTimeout(() => { window.location.href = '/login'; }, 2000);
                    return;
                }
                window.serverData.currentUser = effectiveUserData;
            }

            const targetId = parseInt(this.dataset.targetId);
            if (!targetId || isNaN(targetId)) return;
            try {
                await makeApiCall(`${backendUrls.sendFriendRequest}/${targetId}`, 'POST');
                if (profileUserData) {
                    effectiveUserData.friendRequests.sent.push({ uId: targetId, name: profileUserData.name, avatar: profileUserData.avatar });
                    renderFriendRequests('sent');
                }
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-check"></i> Request Sent';
                if (acceptFriendBtnProfile) acceptFriendBtnProfile.style.display = 'none';
                if (declineFriendBtnProfile) declineFriendBtnProfile.style.display = 'none';
                showUserMessage('Friend request sent!', 'success');
            } catch (e) {
                showUserMessage(`Failed to send request: ${e.message || 'Try again.'}`, 'error');
            }
        });
    }

    if (acceptFriendBtnProfile) {
        acceptFriendBtnProfile.addEventListener('click', async function () {
            let effectiveUserData = currentUserData;
            if (!effectiveUserData) {
                effectiveUserData = await verifyUserSession();
                if (!effectiveUserData) {
                    showUserMessage('You need to be logged in to perform this action. Redirecting to login...', 'error');
                    setTimeout(() => { window.location.href = '/login'; }, 2000);
                    return;
                }
                window.serverData.currentUser = effectiveUserData;
            }

            const requesterId = parseInt(this.dataset.requesterId);
            if (!requesterId || isNaN(requesterId)) return;
            try {
                const acceptedData = await makeApiCall(`${backendUrls.acceptFriendRequest}/${requesterId}`, 'POST');
                if (profileUserData) {
                    effectiveUserData.friends.push({
                        uId: requesterId,
                        name: acceptedData?.name || profileUserData.name,
                        avatar: acceptedData?.avatar || profileUserData.avatar
                    });
                    effectiveUserData.friendRequests.received = effectiveUserData.friendRequests.received.filter(r => r.uId !== requesterId);
                    renderFriendList();
                    renderFriendRequests('received');
                }
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-users"></i> Friends';
                if (declineFriendBtnProfile) declineFriendBtnProfile.style.display = 'none';
                if (sendFriendRequestBtnProfile) sendFriendRequestBtnProfile.style.display = 'none';
                showUserMessage('Friend request accepted!', 'success');
            } catch (e) {
                showUserMessage(`Failed to accept request: ${e.message || 'Try again.'}`, 'error');
            }
        });
    }

    if (declineFriendBtnProfile) {
        declineFriendBtnProfile.addEventListener('click', async function () {
            let effectiveUserData = currentUserData;
            if (!effectiveUserData) {
                effectiveUserData = await verifyUserSession();
                if (!effectiveUserData) {
                    showUserMessage('You need to be logged in to perform this action. Redirecting to login...', 'error');
                    setTimeout(() => { window.location.href = '/login'; }, 2000);
                    return;
                }
                window.serverData.currentUser = effectiveUserData;
            }

            const requesterId = parseInt(this.dataset.requesterId);
            if (!requesterId || isNaN(requesterId)) return;
            try {
                await makeApiCall(`${backendUrls.declineFriendRequest}/${requesterId}`, 'POST');
                effectiveUserData.friendRequests.received = effectiveUserData.friendRequests.received.filter(r => r.uId !== requesterId);
                renderFriendRequests('received');
                this.style.display = 'none';
                if (acceptFriendBtnProfile) acceptFriendBtnProfile.style.display = 'none';
                if (sendFriendRequestBtnProfile) {
                    sendFriendRequestBtnProfile.style.display = 'inline-block';
                    sendFriendRequestBtnProfile.disabled = false;
                    sendFriendRequestBtnProfile.innerHTML = '<i class="fas fa-user-plus"></i> Add Friend';
                }
                showUserMessage('Friend request declined.', 'info');
            } catch (e) {
                showUserMessage(`Failed to decline request: ${e.message || 'Try again.'}`, 'error');
            }
        });
    }

    function initializePage() {
        console.log("DEBUG: Initializing page...");
        if (!profileUserData && !isOwnProfile) {
            console.error("Profile user data (profileUserData) not available. Page cannot be fully initialized for viewed profile.");
            if (document.getElementById('profileView')) {
                document.getElementById('profileView').innerHTML = "<div class='profile-main' style='padding: 20px; text-align: center;'><h2>Profile Not Found</h2><p>The requested user profile could not be loaded.</p></div>";
            }
        }

        if (currentUserData) {
            currentUserData.friends = currentUserData.friends || [];
            if (!currentUserData.friendRequests) {
                currentUserData.friendRequests = { received: [], sent: [] };
            } else {
                currentUserData.friendRequests.received = currentUserData.friendRequests.received || [];
                currentUserData.friendRequests.sent = currentUserData.friendRequests.sent || [];
            }
            loadSidebarBadges();
            renderFriendList();
            renderFriendRequests('received');
            const receivedTab = document.querySelector('.fr-tab-btn[data-tab="received"]');
            if (receivedTab && !receivedTab.classList.contains('active')) {
                const activeTab = document.querySelector('.fr-tab-btn.active');
                if (activeTab) activeTab.classList.remove('active');
                receivedTab.classList.add('active');
            }
        } else {
            console.warn("Current logged-in user data (currentUserData) not available. Attempting session verification...");
            verifyUserSession().then(userData => {
                if (userData) {
                    window.serverData.currentUser = userData;
                    loadSidebarBadges();
                    renderFriendList();
                    renderFriendRequests('received');
                    const receivedTab = document.querySelector('.fr-tab-btn[data-tab="received"]');
                    if (receivedTab && !receivedTab.classList.contains('active')) {
                        const activeTab = document.querySelector('.fr-tab-btn.active');
                        if (activeTab) activeTab.classList.remove('active');
                        receivedTab.classList.add('active');
                    }
                } else {
                    console.warn("Session verification failed. Friend-related features will be disabled.");
                }
            });
        }

        loadProfileDisplayData();

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('success_update')) {
            showUserMessage('Profile updated successfully!', 'success');
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        if (urlParams.has('error_update')) {
            showUserMessage(decodeURIComponent(urlParams.get('error_update')), 'error');
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        console.log("DEBUG: Page initialization complete.");
    }

    initializePage();
});