document.addEventListener("DOMContentLoaded", () => {
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
      sections.forEach(section => {
        section.classList.remove("active");
        if (section.id === targetId) {
          section.classList.add("active");
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      if (navMenu) navMenu.classList.remove("active");
    });
  });

  // Phát nhạc nền
  if (audio) {
    audio.volume = 0.5;
    audio.muted = false;
    const playAttempt = () => {
      audio.play().catch(error => {
        console.error("Lỗi khi phát nhạc:", error);
        audio.muted = true;
        document.body.addEventListener("click", () => {
          audio.muted = false;
          audio.play().catch(err => console.error("Lỗi sau khi nhấp:", err));
        }, { once: true });
      });
    };
    playAttempt();
  }

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
    if (modal) modal.style.display = "none";
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
      videoPlayer.currentTime = 0;
      modal.style.display = "none";
    }
  };

  // Hiệu ứng hạt rơi
// Cấu hình cho hiệu ứng hạt rơi
  const config = {
    maxParticles: window.innerWidth <= 768 ? 20 : 25, // Số lượng hạt tối đa (mobile: 10, desktop: 20)
    particleInterval: window.innerWidth <= 768 ? 600 : 400, // Tần suất tạo hạt (ms)
    minAnimationDuration: 5, // Thời gian animation tối thiểu (s)
    maxAnimationDuration: 10, // Thời gian animation tối đa (s)
  };

  let currentParticles = 0; // Theo dõi số lượng hạt hiện tại
  const particlesContainer = document.getElementById("particles");

  // Hàm tạo hạt
  function createParticle() {
    if (currentParticles >= config.maxParticles || !particlesContainer) {
      return; // Không tạo hạt mới nếu vượt quá giới hạn hoặc container không tồn tại
    }

    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.left = Math.random() * 100 + "vw";
    const size = Math.random() * 5 + 5; // Kích thước ngẫu nhiên 5-10px
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    const animationDuration = Math.random() * (config.maxAnimationDuration - config.minAnimationDuration) + config.minAnimationDuration;
    particle.style.animationDuration = animationDuration + "s";

    // Thêm màu ngẫu nhiên (tùy chọn để tăng tính sinh động)
    const colors = [
      'rgba(238, 139, 208, 0.5)', // Hồng phấn
      'rgba(135, 206, 235, 0.5)', // Xanh dương nhạt
      'rgba(255, 182, 193, 0.5)', // Hồng nhạt
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];

    particlesContainer.appendChild(particle);
    currentParticles++;

    // Xóa hạt sau khi animation kết thúc
    particle.addEventListener("animationend", () => {
      particle.remove();
      currentParticles--;
    });
  }

  // Tạo hạt ban đầu, phân bố đều thời gian
  const initialParticles = config.maxParticles;
  for (let i = 0; i < initialParticles; i++) {
    setTimeout(createParticle, i * (config.particleInterval / initialParticles));
  }

  // Tạo hạt mới theo thời gian
  setInterval(() => {
    if (currentParticles < config.maxParticles) {
      createParticle();
    }
  }, config.particleInterval);

  // Xử lý thay đổi kích thước màn hình
  window.addEventListener("resize", () => {
    config.maxParticles = window.innerWidth <= 768 ? 20 : 25;
    config.particleInterval = window.innerWidth <= 768 ? 600 : 400;
  });
});
