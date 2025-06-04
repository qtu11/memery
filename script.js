document.addEventListener("DOMContentLoaded", () => {
  // Initialize Firebase
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
  const database = firebase.database();

  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const audio = document.getElementById("background-music");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

  // Hiển thị section #home mặc định
  document.getElementById("home").classList.add("active");

  // Xử lý nút menu
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  // Ẩn menu khi nhấp ra ngoài
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && e.target !== menuToggle) {
      navMenu.classList.remove("active");
    }
  });

  // Phát nhạc nền tự động
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

  // Điều hướng
  console.log("Sections found:", sections.length);
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      console.log("Navigating to:", targetId);
      sections.forEach(section => {
        section.classList.remove("active");
        if (section.id === targetId) {
          section.classList.add("active");
          section.scrollIntoView({ behavior: "smooth", block: "start" });
          console.log("Activated section:", section.id);
        }
      });
      navMenu.classList.remove("active");
    });
  });

  // Gửi tâm thư
  window.submitMessage = async function() {
    const nameInput = document.getElementById("name");
    const messageInput = document.getElementById("message");
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (name && message) {
      const newMessage = { name, message, timestamp: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) };
      try {
        await database.ref('messages').push(newMessage);
        nameInput.value = "";
        messageInput.value = "";
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
        alert("Không thể gửi tin nhắn do lỗi kết nối!");
      }
    } else {
      alert("Vui lòng nhập đầy đủ tên và lời nhắn!");
    }
  };

  // Hiển thị tâm thư theo thời gian thực
  function displayMessages() {
    const submittedMessages = document.getElementById("submitted-messages");
    database.ref('messages').on('child_added', (snapshot) => {
      const msg = snapshot.val();
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message-card");
      messageDiv.innerHTML = `<strong>${msg.name}</strong> (${msg.timestamp}): ${msg.message}`;
      submittedMessages.appendChild(messageDiv);
    }, (error) => {
      console.error("Lỗi khi lấy tin nhắn:", error);
    });
  }

  // Gọi hàm hiển thị tâm thư
  displayMessages();

  // Hiển thị lời nhắn trong modal
  window.showMessage = function(name, message) {
    document.getElementById("modal-name").textContent = name;
    document.getElementById("modal-message").textContent = message;
    document.getElementById("message-modal").style.display = "flex";
  };

  window.closeModal = function() {
    document.getElementById("message-modal").style.display = "none";
  };

  // Hiển thị video trong modal
  window.showVideo = function(src, title, description) {
    const modal = document.getElementById("video-modal");
    const videoSource = document.getElementById("video-modal-source");
    const videoPlayer = document.getElementById("video-modal-player");
    const videoTitle = document.getElementById("video-modal-title");
    const videoDescription = document.getElementById("video-modal-description");
    videoSource.src = src;
    videoPlayer.load();
    videoTitle.textContent = title;
    videoDescription.textContent = description;
    modal.style.display = "flex";
  };

  window.closeVideoModal = function() {
    const modal = document.getElementById("video-modal");
    const videoPlayer = document.getElementById("video-modal-player");
    videoPlayer.pause();
    modal.style.display = "none";
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

function playBackgroundMusic() {
  const audio = document.getElementById("background-music");
  audio.play().catch(error => {
    console.error("Lỗi khi phát nhạc:", error);
  });
}
