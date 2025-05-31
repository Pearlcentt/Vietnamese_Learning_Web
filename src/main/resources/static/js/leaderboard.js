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

    // --- MOCK DATA ---
    let currentUser = {
        username: "Christa",
        avatar: "images/christa_avatar.png",
        totalXp: 1560,
        currentLeague: "Pearl League", // Sẽ được cập nhật từ leagueSettings nếu cần
        streak: 32, // Ví dụ streak
        gems: 1364,
        languageLearning: "VIETNAMESE",
        flagSrc: "../html/images/vietnam.png", // Đường dẫn cờ
        achievements: [
            { name: "Streak Champion", iconClass: "fas fa-fire-alt", details: "30 Day Streak" },
            { name: "XP Magnet", iconClass: "fas fa-star", details: "10,000 XP Earned" },
            { name: "Perfect Lesson", iconClass: "fas fa-check-circle", details: "Completed a lesson with no mistakes" }
        ],
        // XP trong giải đấu hiện tại (có thể khác totalXp)
        currentLeagueXp: 10 // Sẽ được cập nhật từ leaderboardData
    };

    const globalLeaderboardData = [
        { username: "Dominik_S", xp: 128 },
        { username: "DuoUserX", xp: 95 },
        { username: "Elena", xp: 83 },
        { username: "Luis Fonsi", xp: 30 },
        { username: "Alex", xp: 18 },
        { username: "Sophia", xp: 14 },
        { username: "Mike", xp: 13 },
        { username: "Sara The Leader", xp: 13 },
        { username: "Markus Stark", xp: 12 },
        { username: currentUser.username, xp: 10 }, // XP của người dùng hiện tại trong giải này
        { username: "User11", xp: 9 },
        { username: "User12", xp: 8 },
    ];

    const friendsLeaderboardData = [
        { username: currentUser.username, xp: 120 },
        { username: "FriendAnna", xp: 115 },
        { username: "BestBuddyBen", xp: 90 },
        { username: "StudyPalSam", xp: 75 },
    ];
    // --- END MOCK DATA ---

    // --- LEADERBOARD SETTINGS ---
    const leagueSettings = {
        name: "Pearl League",
        promotionCount: 7,
        daysLeft: 4,
    };
    // --- END LEADERBOARD SETTINGS ---

    function updateCurrentUserProfile() {
        if (!currentUser) return;

        userFlagEl.src = currentUser.flagSrc;
        userLanguageEl.textContent = currentUser.languageLearning.toUpperCase();
        userStreakEl.textContent = currentUser.streak;
        userGemsEl.textContent = currentUser.gems;

        profileAvatarEl.src = currentUser.avatar;
        profileUsernameEl.textContent = currentUser.username;
        profileTotalXpEl.textContent = currentUser.totalXp;
        profileCurrentLeagueEl.textContent = currentUser.currentLeague;

        profileAchievementsListEl.innerHTML = ''; // Clear old achievements
        currentUser.achievements.forEach(ach => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="${ach.iconClass}"></i> ${ach.name} - <small>${ach.details}</small>`;
            profileAchievementsListEl.appendChild(li);
        });
    }

    function updateLeaderboardHeader() {
        document.querySelector('.leaderboard-header h1').textContent = leagueSettings.name;
        promotionCountEl.textContent = leagueSettings.promotionCount;
        daysLeftEl.textContent = leagueSettings.daysLeft;
    }

    function renderLeaderboard(data, promotionZoneAfterRank) {
        leaderboardListContainer.innerHTML = '';

        // Cập nhật XP của người dùng hiện tại trong giải đấu từ data (nếu có)
        const currentUserDataInList = data.find(user => user.username === currentUser.username);
        if (currentUserDataInList) {
            currentUser.currentLeagueXp = currentUserDataInList.xp;
        }

        // Sắp xếp lại data theo XP giảm dần để xác định rank
        const sortedData = [...data].sort((a, b) => b.xp - a.xp);

        sortedData.forEach((user, index) => {
            const actualRank = index + 1;

            const item = document.createElement('div');
            item.classList.add('leaderboard-item');
            if (user.username === currentUser.username) {
                item.classList.add('current-user-highlight');
            }

            let rankContentHtml = '';
            let rankSpecificClass = '';

            if (actualRank === 1) {
                rankContentHtml = '<img src="../html/images/gold.png" alt="Gold Medal" class="rank-medal-image">';
                rankSpecificClass = 'rank-has-medal';
            } else if (actualRank === 2) {
                rankContentHtml = '<img src="../html/images/silver.png" alt="Silver Medal" class="rank-medal-image">';
                rankSpecificClass = 'rank-has-medal';
            } else if (actualRank === 3) {
                rankContentHtml = '<img src="../html/images/bronze.png" alt="Bronze Medal" class="rank-medal-image">';
                rankSpecificClass = 'rank-has-medal';
            } else {
                rankContentHtml = actualRank;
            }

            item.innerHTML = `
                <div class="rank ${rankSpecificClass}">${rankContentHtml}</div>
                <div class="username-leaderboard">${user.username}</div>
                <div class="xp">${user.xp} XP</div>
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
                renderLeaderboard(globalLeaderboardData, leagueSettings.promotionCount);
            } else if (tabType === 'friends') {
                renderLeaderboard(friendsLeaderboardData, 0);
            }
        });
    });

    // Initial setup
    updateLeaderboardHeader();
    updateCurrentUserProfile();
    // Load global leaderboard by default
    document.querySelector('.tab-button[data-tab="global"]').click();


    // Hàm ví dụ để test việc tăng XP (gọi từ console: addCurrentUserXpToLeague(5))
    window.addCurrentUserXpToLeague = function (amount) {
        let userInGlobal = globalLeaderboardData.find(u => u.username === currentUser.username);
        if (userInGlobal) {
            userInGlobal.xp += amount;
        } else { // Nếu người dùng chưa có trong list, thêm vào (hiếm khi xảy ra nếu data ban đầu đúng)
            globalLeaderboardData.push({ username: currentUser.username, xp: amount });
        }

        let userInFriends = friendsLeaderboardData.find(u => u.username === currentUser.username);
        if (userInFriends) {
            userInFriends.xp += amount;
        } else {
            friendsLeaderboardData.push({ username: currentUser.username, xp: amount });
        }

        currentUser.currentLeagueXp += amount; // Cập nhật XP giải đấu của người dùng
        // currentUser.totalXp += amount; // Cân nhắc có cập nhật totalXp ở đây không, hay chỉ khi hoàn thành bài học thực sự

        // Re-render the currently active tab
        const activeTab = document.querySelector('.tab-button.active');
        if (activeTab) {
            activeTab.click();
        }
        // updateCurrentUserProfile(); // Cập nhật profile nếu totalXp thay đổi
        console.log(`${currentUser.username} now has ${currentUser.currentLeagueXp} XP in this league.`);
    }
});