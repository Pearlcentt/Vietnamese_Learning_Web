document.addEventListener("DOMContentLoaded", () => {
  // Apply CSS styles for topic positioning (only if using client-side positioning)
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
        .topic-item.left-position {
            transform: translateX(-175px) !important; 
        }
        .topic-item.right-position {
            transform: translateX(175px) !important;
        }
        
        /* Override hover transform for positioned items */
        .topic-item.left-position:hover {
            transform: translateX(-160px) scale(1.1) !important;
        }
        .topic-item.right-position:hover {
            transform: translateX(160px) scale(1.1) !important;
        }
        
        .topic-item:hover {
            transform: scale(1.1);
            transition: transform 0.2s ease;
        }
        
        /* Rock positioning classes */
        .rock-item.ctl-pattern .rock-1 { transform: translateX(-60px) translateY(-20px); }
        .rock-item.ctl-pattern .rock-2 { transform: translateX(-110px) translateY(-13px); }
        .rock-item.ctl-pattern .rock-3 { transform: translateX(-150px) translateY(5px); }
        
        .rock-item.ltc-pattern .rock-1 { transform: translateX(-150px) translateY(5px); }
        .rock-item.ltc-pattern .rock-2 { transform: translateX(-110px) translateY(13px); }
        .rock-item.ltc-pattern .rock-3 { transform: translateX(-60px) translateY(20px); }
        
        .rock-item.ctr-pattern .rock-1 { transform: translateX(60px) translateY(-20px); }
        .rock-item.ctr-pattern .rock-2 { transform: translateX(110px) translateY(-13px); }
        .rock-item.ctr-pattern .rock-3 { transform: translateX(150px) translateY(5px); }
        
        .rock-item.rtc-pattern .rock-1 { transform: translateX(150px) translateY(5px); }
        .rock-item.rtc-pattern .rock-2 { transform: translateX(110px) translateY(13px); }
        .rock-item.rtc-pattern .rock-3 { transform: translateX(60px) translateY(20px); }
    `;
  document.head.appendChild(styleSheet);

  // Make topics clickable - this works with backend-generated topics
  document.querySelectorAll(".topic-item").forEach((item) => {
    item.addEventListener("click", function () {
      const topicId = this.dataset.topicId;
      const topicTitle = this.dataset.title;

      if (topicId) {
        console.log(`Selected topic ${topicId}: ${topicTitle}`);

        // Visual feedback
        document.querySelectorAll(".topic-item").forEach((topic) => {
          topic.style.boxShadow = "0 0 10px rgba(88, 204, 2, 0.5)";
        });
        this.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.8)";

        // Redirect to lessons page with Spring Boot controller
        window.location.href = `/lessons?topicId=${topicId}`;
      }
    });
  });

  // Handle logout functionality
  const logoutElements = document.querySelectorAll(".logout-icon, .nav-item:has(.logout-icon)");
  logoutElements.forEach(element => {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to logout?')) {
        window.location.href = "/logout";
      }
    });
  });

  // Handle navigation items
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.addEventListener('click', function() {
      // Don't handle logout here as it's handled above
      if (this.querySelector('.logout-icon')) {
        return;
      }

      // Remove active class from all nav items
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

      // Add active class to clicked item
      this.classList.add('active');

      // Handle navigation based on text content
      const navText = this.querySelector('.nav-text')?.textContent;
      switch(navText) {
        case 'LEARN':
          window.location.href = '/dashboard';
          break;
        case 'LEADERBOARDS':
          // TODO: Implement when you create leaderboards controller
          console.log('Leaderboards not implemented yet');
          break;
        case 'QUESTS':
          // TODO: Implement when you create quests controller
          console.log('Quests not implemented yet');
          break;
        case 'PROFILE':
          // TODO: Implement when you create profile controller
          console.log('Profile not implemented yet');
          break;
      }
    });
  });

  // Add smooth scrolling for topic path if it's long
  const topicPath = document.getElementById('topicPath');
  if (topicPath) {
    // You can add scroll behavior here if needed
    topicPath.style.scrollBehavior = 'smooth';
  }
});