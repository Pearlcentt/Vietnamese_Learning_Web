document.addEventListener("DOMContentLoaded", () => {
  // Add custom CSS to ensure our inline styles override any existing CSS
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
      .topic-item.left-position {
        transform: translateX(-175px) !important; 
      }
      .topic-item.right-position {
        transform: translateX(175px) !important;
      }
      
      /* Rocks going from center to left */
      .rock-item.ctl-pattern .rock-1 { transform: translateX(-60px) translateY(-20px) !important; }
      .rock-item.ctl-pattern .rock-2 { transform: translateX(-110px) translateY(-13px) !important; }
      .rock-item.ctl-pattern .rock-3 { transform: translateX(-150px) translateY(5px) !important; }
      
      /* Rocks going from left to center */
      .rock-item.ltc-pattern .rock-1 { transform: translateX(-150px) translateY(5px) !important; }
      .rock-item.ltc-pattern .rock-2 { transform: translateX(-110px) translateY(13px) !important; }
      .rock-item.ltc-pattern .rock-3 { transform: translateX(-60px) translateY(20px) !important; }
      
      /* Rocks going from center to right */
      .rock-item.ctr-pattern .rock-1 { transform: translateX(60px) translateY(-20px) !important; }
      .rock-item.ctr-pattern .rock-2 { transform: translateX(110px) translateY(-13px) !important; }
      .rock-item.ctr-pattern .rock-3 { transform: translateX(150px) translateY(5px) !important; }
      
      /* Rocks going from right to center */
      .rock-item.rtc-pattern .rock-1 { transform: translateX(150px) translateY(5px) !important; }
      .rock-item.rtc-pattern .rock-2 { transform: translateX(110px) translateY(13px) !important; }
      .rock-item.rtc-pattern .rock-3 { transform: translateX(60px) translateY(20px) !important; }
      
      /* Override hover transform for positioned items */
      .topic-item.left-position:hover {
        transform: translateX(-160px) scale(1.1) !important;
      }
      .topic-item.right-position:hover {
        transform: translateX(160px) scale(1.1) !important;
      }
      .topic-item:not(.left-position):not(.right-position):hover {
        transform: scale(1.1) !important;
      }
    `;
  document.head.appendChild(styleSheet);

  // Make topics clickable - redirect to lessons with topicId
  document.querySelectorAll(".topic-item").forEach((item) => {
    item.addEventListener("click", () => {
      const topicId = item.dataset.topicId;
      const topicTitle = item.dataset.title;

      if (topicId) {
        console.log(`Selected topic ${topicId}: ${topicTitle}`);

        // Visual feedback - remove previous selections
        document.querySelectorAll(".topic-item").forEach((topic) => {
          topic.style.boxShadow = "0 0 10px rgba(88, 204, 2, 0.5)";
        });

        // Highlight selected topic
        item.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.8)";

        // Redirect to lessons page with topicId (keeping your original URL structure)
        window.location.href = `/lessons?topicId=${topicId}`;
      }
    });

    // Add hover effects for better UX
    item.addEventListener("mouseenter", function () {
      this.style.transition = "all 0.3s ease";
      const description = this.dataset.description;
      const descriptionElement = this.querySelector(".topic-description");
      if (descriptionElement && description) {
        descriptionElement.textContent = description;
      }
    });

    item.addEventListener("mouseleave", function () {
      // Reset to default shadow if not selected
      if (this.style.boxShadow !== "0 0 20px rgba(255, 215, 0, 0.8)") {
        this.style.boxShadow = "0 0 10px rgba(88, 204, 2, 0.5)";
      }
    });
  });

  // Add event listener for the logout link
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default link behavior
      if (confirm("Are you sure you want to logout?")) {
        // Perform logout action (e.g., redirect or send a request)
        window.location.href = "/logout"; // Example: Redirect to logout endpoint
      }
    });
  }

  // Optional: Add loading animation for topics
  const topicItems = document.querySelectorAll(".topic-item");
  topicItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform += " translateY(20px)";

    setTimeout(() => {
      item.style.transition = "all 0.5s ease";
      item.style.opacity = "1";
      item.style.transform = item.style.transform.replace(
        "translateY(20px)",
        ""
      );
    }, index * 100);
  });

  // // Optional: Handle progress bar animations
  // const progressBars = document.querySelectorAll(".progress-bar-topic");
  // progressBars.forEach((bar) => {
  //   const width = bar.style.width;
  //   if (width && width !== "0%") {
  //     bar.style.width = "0%";

  //     setTimeout(() => {
  //       bar.style.transition = "width 1s ease-out";
  //       bar.style.width = width;
  //     }, 500);
  //   }
  // });

  // Optional: Add keyboard navigation
  document.addEventListener("keydown", (e) => {
    const topics = Array.from(document.querySelectorAll(".topic-item"));
    const currentSelected = document.querySelector(
      ".topic-item[style*='rgba(255, 215, 0, 0.8)']"
    );

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();

      let newIndex;
      if (currentSelected) {
        const currentIndex = topics.indexOf(currentSelected);
        newIndex =
          e.key === "ArrowUp"
            ? (currentIndex - 1 + topics.length) % topics.length
            : (currentIndex + 1) % topics.length;
      } else {
        newIndex = 0;
      }

      // Reset all topics
      topics.forEach((topic) => {
        topic.style.boxShadow = "0 0 10px rgba(88, 204, 2, 0.5)";
      });

      // Highlight new topic
      topics[newIndex].style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.8)";
      topics[newIndex].scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (e.key === "Enter" && currentSelected) {
      currentSelected.click();
    }
  });
});

// Navigation items click handlers
document.querySelectorAll(".nav-item").forEach((item, index) => {
  item.addEventListener("click", () => {
    // Remove active class from all items
    document
      .querySelectorAll(".nav-item")
      .forEach((nav) => nav.classList.remove("active"));

    // Add active class to clicked item
    item.classList.add("active");

    // Handle navigation based on index or content
    const navText = item.querySelector(".nav-text")?.textContent;
    switch (navText) {
      case "LEARN":
        // Already on learn page
        break;
      case "LEADERBOARDS":
        // Implement leaderboards navigation
        console.log("Navigate to leaderboards");
        break;
      case "QUESTS":
        // Implement quests navigation
        console.log("Navigate to quests");
        break;
      case "PROFILE":
        // Implement profile navigation
        console.log("Navigate to profile");
        break;
    }
  });
});
