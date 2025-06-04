document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const audio = document.getElementById("background-music");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

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

  // Phát nhạc nền
  audio.volume = 0.5;
  audio.play().catch(error => {
    console.error("Lỗi khi phát nhạc:", error);
  });

  // Điều hướng
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      sections.forEach(section => {
        section.classList.remove("active");
        if (section.id === targetId) {
          section.classList.add("active");
        }
      });
      navMenu.classList.remove("active"); // Ẩn menu khi nhấp vào liên kết
    });
  });

  // Gửi tâm thư
  window.submitMessage = function() {
    const nameInput = document.getElementById("name");
    const messageInput = document.getElementById("message");
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (name && message) {
      const newMessage = { name, message, timestamp: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) };
      let messages = JSON.parse(localStorage.getItem("messages") || "[]");
      messages.push(newMessage);
      localStorage.setItem("messages", JSON.stringify(messages));
      displayMessages();
      nameInput.value = "";
      messageInput.value = "";
    } else {
      alert("Vui lòng nhập đầy đủ tên và lời nhắn!");
    }
  };

  // Hiển thị tâm thư
  function displayMessages() {
    const submittedMessages = document.getElementById("submitted-messages");
    submittedMessages.innerHTML = "";
    let messages = JSON.parse(localStorage.getItem("messages") || "[]");
    messages.forEach(msg => {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message-card");
      messageDiv.innerHTML = `<strong>${msg.name}</strong> (${msg.timestamp}): ${msg.message}`;
      submittedMessages.appendChild(messageDiv);
    });
  }

  // Hiển thị tâm thư khi tải trang
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

// Hàm bật nhạc nền thủ công
function playBackgroundMusic() {
  const audio = document.getElementById("background-music");
  audio.play().catch(error => {
    console.error("Lỗi khi phát nhạc:", error);
  });
}
