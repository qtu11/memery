document.addEventListener("DOMContentLoaded", () => {
  // Khởi tạo Firebase
  let database;
  try {
    const firebaseConfig = {
      apiKey: "AIzaSyDGl114VDUnvUtVdl7vNd35lHEgXQIdaKs",
      authDomain: "tuquangmemmery.firebaseapp.com",
      projectId: "tuquangmemmery",
      storageBucket: "tuquangmemmery.firebasestorage.app",
      messagingSenderId: "280703846268",
      appId: "1:280703846268:web:d4fc49d0750dcea82a46f9",
      measurementId: "G-W04JHPDT9Z"
    };
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log("Firebase khởi tạo thành công"); // Debug
  } catch (error) {
    console.error("Lỗi khi khởi tạo Firebase:", error);
  }

  // Các phần tử DOM
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");
  const audio = document.getElementById("background-music");

  // Hiển thị section #home mặc định
  if (sections.length > 0) {
    document.getElementById("home").classList.add("active");
  }

  // Xử lý nút menu (di động)
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });

    // Ẩn menu khi nhấp ra ngoài
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && e.target !== menuToggle) {
        navMenu.classList.remove("active");
      }
    });
  }

  // Điều hướng giữa các section
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      console.log("Navigating to:", targetId); // Debug

      sections.forEach(section => {
        section.classList.remove("active");
        if (section.id === targetId) {
          section.classList.add("active");
          section.scrollIntoView({ behavior: "smooth", block: "start" });
          console.log("Activated section:", section.id); // Debug
        }
      });

      if (navMenu) {
        navMenu.classList.remove("active");
      }
    });
  });

  // Phát nhạc nền tự động
  if (audio) {
    audio.volume = 0.5;
    audio.muted = false;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Nhạc nền đã phát tự động thành công!");
        })
        .catch(error => {
          console.error("Lỗi khi phát nhạc tự động:", error);
          document.body.addEventListener("click", () => {
            audio.play().catch(err => console.error("Lỗi khi phát nhạc sau khi nhấp:", err));
          }, { once: true });
        });
    }
  }

  // Gửi tâm thư
  window.submitMessage = async function() {
    console.log("submitMessage được gọi"); // Debug
    if (!database) {
      console.log("Database không được khởi tạo"); // Debug
      alert("Không thể gửi tin nhắn do lỗi kết nối Firebase!");
      return;
    }

    const nameInput = document.getElementById("name");
    const messageInput = document.getElementById("message");
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    console.log("Name:", name, "Message:", message); // Debug

    if (name && message) {
      const newMessage = {
        name,
        message,
        timestamp: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
      };
      console.log("New message:", newMessage); // Debug
      try {
        await database.ref('messages').push(newMessage);
        console.log("Tin nhắn đã gửi thành công"); // Debug
        nameInput.value = "";
        messageInput.value = "";
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
        alert("Không thể gửi tin nhắn do lỗi kết nối!");
      }
    } else {
      console.log("Input không hợp lệ"); // Debug
      alert("Vui lòng nhập đầy đủ tên và lời nhắn!");
    }
  };

  // Hiển thị tâm thư trong section #messages
  function displayMessages() {
    if (!database) {
      console.error("Không thể hiển thị tin nhắn do lỗi kết nối Firebase!");
      return;
    }

    const submittedMessages = document.getElementById("submitted-messages");
    if (!submittedMessages) return;

    database.ref('messages').on('child_added', (snapshot) => {
      const msg = snapshot.val();
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message-card");
      messageDiv.innerHTML = `<strong>${msg.name}</strong> (${msg.timestamp}): ${msg.message}`;
      messageDiv.addEventListener("click", () => showMessage(msg.name, msg.message));
      submittedMessages.appendChild(messageDiv);
    }, (error) => {
      console.error("Lỗi khi lấy tin nhắn:", error);
    });
  }

  // Hiển thị tâm thư trong section #write-message
  function displayMessagesInWriteSection() {
    if (!database) {
      console.error("Không thể hiển thị tin nhắn do lỗi kết nối Firebase!");
      return;
    }

    const writeMessageSubmitted = document.getElementById("write-message-submitted");
    if (!writeMessageSubmitted) return;

    database.ref('messages').on('child_added', (snapshot) => {
      const msg = snapshot.val();
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message-card");
      messageDiv.innerHTML = `<strong>${msg.name}</strong> (${msg.timestamp}): ${msg.message}`;
      messageDiv.addEventListener("click", () => showMessage(msg.name, msg.message));
      writeMessageSubmitted.appendChild(messageDiv);
    }, (error) => {
      console.error("Lỗi khi lấy tin nhắn trong section viết tâm thư:", error);
    });
  }

  // Gọi cả hai hàm hiển thị tâm thư
  displayMessages();
  displayMessagesInWriteSection();

  // Hiển thị lời nhắn trong modal
  window.showMessage = function(name, message) {
    const modal = document.getElementById("message-modal");
    const modalName = document.getElementById("modal-name");
    const modalMessage = document.getElementById("modal-message");
    if (modal && modalName && modalMessage) {
      modalName.textContent = name;
      modalMessage.textContent = message;
      modal.style.display = "flex";
    }
  };

  window.closeModal = function() {
    const modal = document.getElementById("message-modal");
    if (modal) {
      modal.style.display = "none";
    }
  };

  // Hiển thị video trong modal
  window.showVideo = function(src, title, description) {
    const modal = document.getElementById("video-modal");
    const videoSource = document.getElementById("video-modal-source");
    const videoPlayer = document.getElementById("video-modal-player");
    const videoTitle = document.getElementById("video-modal-title");
    const videoDescription = document.getElementById("video-modal-description");
    if (modal && videoSource && videoPlayer && videoTitle && videoDescription) {
      videoSource.src = src;
      videoPlayer.load();
      videoTitle.textContent = title;
      videoDescription.textContent = description;
      modal.style.display = "flex";
    }
  };

  window.closeVideoModal = function() {
    const modal = document.getElementById("video-modal");
    const videoPlayer = document.getElementById("video-modal-player");
    if (modal && videoPlayer) {
      videoPlayer.pause();
      modal.style.display = "none";
    }
  };

  // Hiệu ứng hạt rơi
  function createParticle() {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.left = Math.random() * 100 + "vw";
    const size = Math.random() * 5 + 5;
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.animationDuration = Math.random() * 5 + 5 + "s";
    document.getElementById("particles").appendChild(particle);
    setTimeout(() => {
      particle.remove();
    }, parseFloat(particle.style.animationDuration) * 1000);
  }

  const isMobile = window.innerWidth <= 768;
  const initialParticles = isMobile ? 10 : 20;
  const particleInterval = isMobile ? 500 : 300;

  for (let i = 0; i < initialParticles; i++) {
    createParticle();
  }
  setInterval(createParticle, particleInterval);
});

// Phát nhạc nền thủ công
function playBackgroundMusic() {
  const audio = document.getElementById("background-music");
  if (audio) {
    audio.play().catch(error => {
      console.error("Lỗi khi phát nhạc:", error);
    });
  }
}
