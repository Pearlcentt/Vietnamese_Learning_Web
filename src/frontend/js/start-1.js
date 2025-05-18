document.addEventListener("DOMContentLoaded", () => {
  // Include Unit 1 and all other topics
  const topicsData = [
    { topic: 1, title: "Introduction to Vietnamese" },
    { topic: 2, title: "Basic Greetings" },
    { topic: 3, title: "Numbers & Counting" },
    { topic: 4, title: "Family Members" },
    { topic: 5, title: "Common Foods" },
    { topic: 6, title: "Daily Activities" },
    { topic: 7, title: "Colors & Objects" },
    { topic: 8, title: "Time & Calendar" },
    { topic: 9, title: "Places in Town" },
    { topic: 10, title: "Weather & Seasons" },
  ];

  const topicPath = document.getElementById("topicPath");

  // Clear any existing content
  topicPath.innerHTML = "";

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
      .rock-item .rock-1.ctl-shift-1 { transform: translateX(-60px) translateY(-20px) !important; }
      .rock-item .rock-2.ctl-shift-2 { transform: translateX(-110px) translateY(-13px) !important; }
      .rock-item .rock-3.ctl-shift-3 { transform: translateX(-150px) translateY(5px) !important; }
      
      /* Rocks going from left to center */
      .rock-item .rock-1.ltc-shift-3 { transform: translateX(-150px) translateY(5px) !important; }
      .rock-item .rock-2.ltc-shift-2 { transform: translateX(-110px) translateY(+13px) !important; }
      .rock-item .rock-3.ltc-shift-1 { transform: translateX(-60px) translateY(+20px) !important; }
      
      /* Rocks going from center to right */
      .rock-item .rock-1.ctr-shift-1 { transform: translateX(60px) translateY(-20px) !important; }
      .rock-item .rock-2.ctr-shift-2 { transform: translateX(110px) translateY(-13px) !important; }
      .rock-item .rock-3.ctr-shift-3 { transform: translateX(150px) translateY(+5px) !important; }
      
      /* Rocks going from right to center */
      .rock-item .rock-1.rtc-shift-3 { transform: translateX(150px) translateY(5px) !important; }
      .rock-item .rock-2.rtc-shift-2 { transform: translateX(110px) translateY(+13px) !important; }
      .rock-item .rock-3.rtc-shift-1 { transform: translateX(60px) translateY(20px) !important; }
      
      /* Override hover transform for positioned items */
      .topic-item.left-position:hover {
        transform: translateX(-160px) scale(1.1) !important;
      }
      .topic-item.right-position:hover {
        transform: translateX(160px) scale(1.1) !important;
      }
    `;
  document.head.appendChild(styleSheet);

  // Function to create a topic item with position adjustment
  function createTopicItem(topicNumber, position) {
    const topicItem = document.createElement("div");
    topicItem.className = "topic-item";
    topicItem.id = `topic-item-${topicNumber}`;

    // Apply winding path positioning
    if (position === "left") {
      topicItem.classList.add("left-position");
    } else if (position === "right") {
      topicItem.classList.add("right-position");
    }

    const progressRing = document.createElement("div");
    progressRing.className = "progress-ring";

    const starContainer = document.createElement("div");
    starContainer.className = "star-container";

    const starImg = document.createElement("img");
    starImg.src = "../images/star.png";
    starImg.alt = "Star";

    // Create the hover topic box
    const hoverTopic = document.createElement("div");
    hoverTopic.className = "hover-topic";

    const topicTitle = document.createElement("div");
    topicTitle.className = "topic-title";

    const sectionTitle = document.createElement("div");
    sectionTitle.className = "section-title";
    sectionTitle.textContent = `TOPIC ${topicNumber}`;

    const titleHeader = document.createElement("h2");
    titleHeader.textContent = topicsData[topicNumber - 1].title;

    // Create progress container
    const progressContainer = document.createElement("div");
    progressContainer.className = "progress-container";

    // Create progress bar wrapper
    const progressBarWrapper = document.createElement("div");
    progressBarWrapper.className = "progress-bar-wrapper";

    // Create progress bar
    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar-topic";

    // Set random completed lessons for demo (replace with actual data later)
    const completedLessons = Math.floor(Math.random() * 6); // 0-5 completed
    const totalLessons = 5;
    const progressPercentage = (completedLessons / totalLessons) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    progressBarWrapper.appendChild(progressBar);
    progressContainer.appendChild(progressBarWrapper);

    topicTitle.appendChild(sectionTitle);
    topicTitle.appendChild(titleHeader);

    hoverTopic.appendChild(topicTitle);
    hoverTopic.appendChild(progressContainer);

    starContainer.appendChild(starImg);
    topicItem.appendChild(progressRing);
    topicItem.appendChild(starContainer);
    topicItem.appendChild(hoverTopic);

    return topicItem;
  }

  // Function to create a rock item with winding path adjustments
  function createRockItem(topicNumber, pattern) {
    const rockItem = document.createElement("div");
    rockItem.className = "rock-item";
    rockItem.id = `rock-item-${topicNumber}`;

    // Create three rock divs with appropriate transformations based on pattern
    for (let i = 1; i <= 3; i++) {
      const rock = document.createElement("div");
      rock.className = `rock rock-${i}`;

      // Apply appropriate classes based on the pattern
      if (pattern === "center-to-left") {
        rock.classList.add(`ctl-shift-${i}`);
      } else if (pattern === "left-to-center") {
        rock.classList.add(`ltc-shift-${4 - i}`); // 3, 2, 1
      } else if (pattern === "center-to-right") {
        rock.classList.add(`ctr-shift-${i}`);
      } else if (pattern === "right-to-center") {
        rock.classList.add(`rtc-shift-${4 - i}`); // 3, 2, 1
      }

      const rockImg = document.createElement("img");
      rockImg.src = "../images/rock.png";
      rockImg.alt = "Rock";

      rock.appendChild(rockImg);
      rockItem.appendChild(rock);
    }

    return rockItem;
  }

  // Add each topic to the path with winding pattern
  topicsData.forEach((topicData, index) => {
    let topicPosition;
    let rockPattern;

    // Determine position pattern based on topic number
    // Pattern repeats: center -> left -> center -> right -> center -> ...
    const cycle = index % 4;

    if (cycle === 0) {
      topicPosition = "center";
      rockPattern = "center-to-left";
    } else if (cycle === 1) {
      topicPosition = "left";
      rockPattern = "left-to-center";
    } else if (cycle === 2) {
      topicPosition = "center";
      rockPattern = "center-to-right";
    } else {
      topicPosition = "right";
      rockPattern = "right-to-center";
    }

    // Create and append the topic item with position
    const topicItem = createTopicItem(topicData.topic, topicPosition);

    // Add data attribute for the topic title
    topicItem.dataset.title = topicData.title;
    topicItem.dataset.topicNumber = topicData.topic;

    // Create and append the rock item with pattern
    const rockItem = createRockItem(topicData.topic, rockPattern);

    // Append both to the topic path
    topicPath.appendChild(topicItem);
    topicPath.appendChild(rockItem);
  });

  // Make topics clickable
  document.querySelectorAll(".topic-item").forEach((item) => {
    item.addEventListener("click", function () {
      const topicTitle = this.dataset.title;
      const topicNumber = this.dataset.topicNumber;

      if (topicTitle) {
        console.log(`Selected topic ${topicNumber}: ${topicTitle}`);

        // Visual feedback
        document.querySelectorAll(".topic-item").forEach((topic) => {
          topic.style.boxShadow = "0 0 10px rgba(88, 204, 2, 0.5)";
        });
        this.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.8)";

        // Redirect to lessons.html and pass topic info as query parameters
        window.location.href = `../html/lessons.html?topic=${topicNumber}&title=${encodeURIComponent(
          topicTitle
        )}`;
      }
    });
  });
  const logoutNavItem = document.querySelector(
    ".nav-item .logout-icon"
  ).parentElement;
  logoutNavItem.addEventListener("click", () => {
    window.location.href = "../html/login.html";
  });
});
