document.addEventListener("DOMContentLoaded", () => {
  // Các phần tử DOM
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");
  const audio = document.getElementById("background-music");
  const messageForm = document.getElementById("message-form");
  const writeMessageSubmitted = document.getElementById("write-message-submitted");

  // Hiển thị section #home mặc định
  if (sections.length > 0) {
    document.getElementById("home").classList.add("active");
  }

  // Xử lý nút menu (di động)
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });

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
      console.log("Navigating to:", targetId);

      sections.forEach(section => {
        section.classList.remove("active");
        if (section.id === targetId) {
          section.classList.add("active");
          section.scrollIntoView({ behavior: "smooth", block: "start" });
          console.log("Activated section:", section.id);
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

  // Gửi tin nhắn
  if (messageForm && writeMessageSubmitted) {
    messageForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("name");
      const messageInput = document.getElementById("message");
      const name = nameInput.value.trim();
      const message = messageInput.value.trim();

      if (!name || !message) {
        alert("Vui lòng nhập đầy đủ tên và lời nhắn!");
        return;
      }

      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, message }),
        });

        const result = await response.json();
        if (result.success) {
          nameInput.value = "";
          messageInput.value = "";
          loadMessages(); // Tải lại danh sách tin nhắn
        } else {
          alert("Gửi tin nhắn thất bại!");
        }
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
        alert("Không thể gửi tin nhắn do lỗi kết nối!");
      }
    });
  }

  // Hiển thị tin nhắn
  function loadMessages() {
    if (writeMessageSubmitted) {
      fetch('/api/messages')
        .then(response => response.json())
        .then(messages => {
          writeMessageSubmitted.innerHTML = ''; // Xóa nội dung cũ
          messages.forEach(msg => {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message-card");
            messageDiv.innerHTML = `<strong>${msg.name}</strong> (${msg.timestamp}): ${msg.message}`;
            messageDiv.addEventListener("click", () => showMessage(msg.name, msg.message));
            writeMessageSubmitted.appendChild(messageDiv);
          });
        })
        .catch(error => console.error("Lỗi khi tải tin nhắn:", error));
    }
  }

  // Gọi hàm hiển thị tin nhắn khi trang tải
  loadMessages();

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
