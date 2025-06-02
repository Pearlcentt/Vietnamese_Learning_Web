// leaderboard.js - Original content (NO CHANGES NEEDED TO THIS FILE ITSELF)
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.tab-button');
    const leaderboardListContainer = document.getElementById('leaderboard-list-container');

    // Elements for leaderboard header
    const promotionCountEl = document.getElementById('promotion-count');
    const daysLeftEl = document.getElementById('days-left');

    // Elements for right sidebar (user profile)
    const userFlagEl = document.getElementById('user-flag');
    const userLanguageEl = document.getElementById('user-language');
    const userStreakEl = document.getElementById('user-streak');
    const userGemsEl = document.getElementById('user-gems');
    const profileAvatarEl = document.getElementById('profile-avatar');
    const profileUsernameEl = document.getElementById('profile-username');
    const profileTotalXpEl = document.getElementById('profile-total-xp');
    const profileCurrentLeagueEl = document.getElementById('profile-current-league');
    const profileAchievementsListEl = document.getElementById('profile-achievements-list');

    // --- LẤY DỮ LIỆU TỪ SERVER (THYMELEAF INLINED) ---
    const currentUser = window.serverData.currentUser;
    const leagueSettings = window.serverData.leagueSettings;
    let globalLeaderboardData = window.serverData.globalLeaderboard || [];
    let friendsLeaderboardData = window.serverData.friendsLeaderboard || [];
    const defaultAvatarUrl = window.serverData.defaultAvatarUrl;
    const medalImageUrls = window.serverData.medalImageUrls;
    // --- END LẤY DỮ LIỆU ---


    function updateCurrentUserProfile() {
        if (!currentUser || !userFlagEl) return;

        if (userFlagEl) userFlagEl.src = currentUser.flagSrc || '/images/default-flag.png';
        if (userLanguageEl) userLanguageEl.textContent = currentUser.languageLearning ? currentUser.languageLearning.toUpperCase() : 'LANGUAGE';
        if (userStreakEl) userStreakEl.textContent = currentUser.streak || 0;
        if (userGemsEl) userGemsEl.textContent = currentUser.gems || 0;

        if (profileAvatarEl) profileAvatarEl.src = currentUser.avatar || defaultAvatarUrl;
        if (profileUsernameEl) profileUsernameEl.textContent = currentUser.username || 'Username';
        if (profileTotalXpEl) profileTotalXpEl.textContent = currentUser.totalXp || 0; // Should be totalXp
        if (profileCurrentLeagueEl) profileCurrentLeagueEl.textContent = currentUser.currentLeague || 'N/A';

        if (profileAchievementsListEl) {
            profileAchievementsListEl.innerHTML = '';
            if (currentUser.achievements && currentUser.achievements.length > 0) {
                currentUser.achievements.forEach(ach => {
                    const li = document.createElement('li');
                    // Assuming ach object has { iconClass: 'fas fa-trophy', name: 'Ach Name', details: 'Ach Details' }
                    li.innerHTML = `<i class="${ach.iconClass || 'fas fa-trophy'}"></i> ${ach.name || 'Achievement'} - <small>${ach.details || ''}</small>`;
                    profileAchievementsListEl.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'No achievements yet.';
                profileAchievementsListEl.appendChild(li);
            }
        }
    }

    function updateLeaderboardHeader() {
        if (!leagueSettings || !document.querySelector('.leaderboard-header h1')) return;

        document.querySelector('.leaderboard-header h1').textContent = leagueSettings.name || 'Current League';
        if (promotionCountEl) promotionCountEl.textContent = leagueSettings.promotionCount || 0;
        if (daysLeftEl) daysLeftEl.textContent = leagueSettings.daysLeft || 0;
    }

    function renderLeaderboard(data, promotionZoneAfterRank) {
        if (!leaderboardListContainer) return;
        leaderboardListContainer.innerHTML = '';

        const leaderboardData = Array.isArray(data) ? data : [];

        if (currentUser) {
            const currentUserDataInList = leaderboardData.find(user => user.username === currentUser.username);
            if (currentUserDataInList) {
                currentUser.currentLeagueXp = currentUserDataInList.xp;
            }
        }

        const sortedData = [...leaderboardData].sort((a, b) => b.xp - a.xp);

        sortedData.forEach((user, index) => {
            const actualRank = index + 1;
            const item = document.createElement('div');
            item.classList.add('leaderboard-item');
            if (currentUser && user.username === currentUser.username) {
                item.classList.add('current-user-highlight');
            }
            let rankContentHtml = '';
            let rankSpecificClass = '';
            if (actualRank === 1 && medalImageUrls.gold) {
                rankContentHtml = `<img src="${medalImageUrls.gold}" alt="Gold Medal" class="rank-medal-image">`;
                rankSpecificClass = 'rank-has-medal';
            } else if (actualRank === 2 && medalImageUrls.silver) {
                rankContentHtml = `<img src="${medalImageUrls.silver}" alt="Silver Medal" class="rank-medal-image">`;
                rankSpecificClass = 'rank-has-medal';
            } else if (actualRank === 3 && medalImageUrls.bronze) {
                rankContentHtml = `<img src="${medalImageUrls.bronze}" alt="Bronze Medal" class="rank-medal-image">`;
                rankSpecificClass = 'rank-has-medal';
            } else {
                rankContentHtml = actualRank;
            }

            item.setAttribute('data-user-id', user.uId || user.uid || user.id || '');
            item.innerHTML = `
                <div class="rank ${rankSpecificClass}">${rankContentHtml}</div>
                <div class="username-leaderboard">${user.username || 'Unknown User'}</div>
                <div class="xp">${user.xp || 0} XP</div>
            `;

            if (item.getAttribute('data-user-id')) {
                item.style.cursor = 'pointer';
                item.addEventListener('click', function() {
                    const uid = item.getAttribute('data-user-id');
                    if (uid) {
                        window.location.href = `/profile/${uid}`; // Adjust this URL as needed
                    }
                });
            }
            leaderboardListContainer.appendChild(item);
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabType = tab.getAttribute('data-tab');
            if (tabType === 'global') {
                renderLeaderboard(globalLeaderboardData, leagueSettings ? leagueSettings.promotionCount : 0);
            } else if (tabType === 'friends') {
                renderLeaderboard(friendsLeaderboardData, 0);
            }
        });
    });

    updateLeaderboardHeader();
    updateCurrentUserProfile();

    const globalTabButton = document.querySelector('.tab-button[data-tab="global"]');
    if (globalTabButton) {
        globalTabButton.click();
    }

    window.addCurrentUserXpToLeague = function (amount) {
        if (!currentUser) {
            console.warn("Cannot add XP: currentUser is not defined.");
            return;
        }

        let userInGlobal = globalLeaderboardData.find(u => u.username === currentUser.username);
        if (userInGlobal) {
            userInGlobal.xp += amount;
        } else {
            globalLeaderboardData.push({
                uId: currentUser.uId || currentUser.uid || currentUser.id, // Make sure to include uId
                username: currentUser.username,
                xp: amount,
                avatar: currentUser.avatar || defaultAvatarUrl
            });
        }

        let userInFriends = friendsLeaderboardData.find(u => u.username === currentUser.username);
        if (userInFriends) {
            userInFriends.xp += amount;
        } else {
            friendsLeaderboardData.push({
                uId: currentUser.uId || currentUser.uid || currentUser.id, // Make sure to include uId
                username: currentUser.username,
                xp: amount,
                avatar: currentUser.avatar || defaultAvatarUrl
            });
        }

        currentUser.currentLeagueXp = (currentUser.currentLeagueXp || 0) + amount;

        const activeTab = document.querySelector('.tab-button.active');
        if (activeTab) {
            activeTab.click(); // Re-render the current tab
        }
        console.log(`${currentUser.username} now has ${currentUser.currentLeagueXp} XP in this league (client-side demo).`);
    }
});