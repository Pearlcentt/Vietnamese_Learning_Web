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
        if (profileTotalXpEl) profileTotalXpEl.textContent = currentUser.totalXp || 0;
        if (profileCurrentLeagueEl) profileCurrentLeagueEl.textContent = currentUser.currentLeague || 'N/A';

        if (profileAchievementsListEl) {
            profileAchievementsListEl.innerHTML = ''; // Clear old achievements
            if (currentUser.achievements && currentUser.achievements.length > 0) {
                currentUser.achievements.forEach(ach => {
                    const li = document.createElement('li');
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

        // Đảm bảo data là một mảng
        const leaderboardData = Array.isArray(data) ? data : [];

        // Cập nhật XP của người dùng hiện tại trong giải đấu từ data (nếu có và currentUser tồn tại)
        if (currentUser) {
            const currentUserDataInList = leaderboardData.find(user => user.username === currentUser.username);
            if (currentUserDataInList) {
                currentUser.currentLeagueXp = currentUserDataInList.xp;
            }
        }


        // Sắp xếp lại data theo XP giảm dần để xác định rank
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

            if (actualRank === 1) {
                rankContentHtml = `<img src="${medalImageUrls.gold}" alt="Gold Medal" class="rank-medal-image">`;
                rankSpecificClass = 'rank-has-medal';
            } else if (actualRank === 2) {
                rankContentHtml = `<img src="${medalImageUrls.silver}" alt="Silver Medal" class="rank-medal-image">`;
                rankSpecificClass = 'rank-has-medal';
            } else if (actualRank === 3) {
                rankContentHtml = `<img src="${medalImageUrls.bronze}" alt="Bronze Medal" class="rank-medal-image">`;
                rankSpecificClass = 'rank-has-medal';
            } else {
                rankContentHtml = actualRank;
            }

            item.innerHTML = `
                <div class="rank ${rankSpecificClass}">${rankContentHtml}</div>
                <div class="username-leaderboard">${user.username || 'Unknown User'}</div>
                <div class="xp">${user.xp || 0} XP</div>
            `;
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
                renderLeaderboard(friendsLeaderboardData, 0); // Friends tab might not have promotion zones
            }
        });
    });

    // Initial setup
    updateLeaderboardHeader();
    updateCurrentUserProfile();

    // Load global leaderboard by default if the button exists
    const globalTabButton = document.querySelector('.tab-button[data-tab="global"]');
    if (globalTabButton) {
        globalTabButton.click();
    }


    // Hàm ví dụ để test việc tăng XP (gọi từ console: addCurrentUserXpToLeague(5))
    window.addCurrentUserXpToLeague = function (amount) {
        if (!currentUser) {
            console.warn("Cannot add XP: currentUser is not defined.");
            return;
        }

        let userInGlobal = globalLeaderboardData.find(u => u.username === currentUser.username);
        if (userInGlobal) {
            userInGlobal.xp += amount;
        } else {
            globalLeaderboardData.push({ username: currentUser.username, xp: amount, avatar: currentUser.avatar });
        }

        let userInFriends = friendsLeaderboardData.find(u => u.username === currentUser.username);
        if (userInFriends) {
            userInFriends.xp += amount;
        } else {
            friendsLeaderboardData.push({ username: currentUser.username, xp: amount, avatar: currentUser.avatar });
        }

        currentUser.currentLeagueXp = (currentUser.currentLeagueXp || 0) + amount;

        const activeTab = document.querySelector('.tab-button.active');
        if (activeTab) {
            activeTab.click();
        }
        // updateCurrentUserProfile(); // Chỉ cập nhật nếu totalXp thay đổi thực sự từ backend
        console.log(`${currentUser.username} now has ${currentUser.currentLeagueXp} XP in this league (client-side demo).`);
      
    }
});