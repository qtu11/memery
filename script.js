document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");
  const particlesContainer = document.getElementById("particles");
  const audio = document.getElementById("background-music");

  // Initialize default section
  if (sections.length > 0) {
    const homeSection = document.getElementById("home");
    if (homeSection) {
      homeSection.classList.add("active");
      document.querySelector('.nav-link[href="home"]')?.classList.add("current");
    }
  }

  // Menu toggle
  if (menuToggle && navMenu) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-controls", "nav-menu");

    const toggleMenu = () => {
      const isExpanded = navMenu.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", isExpanded.toString());
    };

    menuToggle.addEventListener("click", toggleMenu);

    // Close menu when clicking outside
    const closeMenu = (e) => {
      if (
        !navMenu.contains(e.target) &&
        e.target !== menuToggle &&
        !menuToggle.contains(e.target) &&
        navMenu.classList.contains("active")
      ) {
        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    };
    document.addEventListener("click", closeMenu, { passive: true });

    // Reset menu on resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    }, { passive: true });
  }

  // Navigation links
  if (navLinks.length > 0) {
    navLinks.forEach(link => {
      const handleNav = (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          sections.forEach(section => section.classList.remove("active"));
          targetSection.classList.add("active");
          targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
          navLinks.forEach(l => l.classList.remove("current"));
          link.classList.add("current");
          if (navMenu && window.innerWidth <= 768) {
            navMenu.classList.remove("active");
            menuToggle?.setAttribute("aria-expanded", "false");
          }
        } else {
          console.warn(`Section with ID "${targetId}" not found! Ensure <section id="${targetId}"> exists in HTML.`);
        }
      };
      link.addEventListener("click", handleNav);
    });
  }

  // Particle effect
  const config = {
    maxParticles: window.innerWidth <= 768 ? 15 : 20,
    particleInterval: window.innerWidth <= 768 ? 600 : 400,
    minAnimationDuration: 5,
    maxAnimationDuration: 10,
  };
  let currentParticles = 0;

  function createParticle() {
    if (currentParticles >= config.maxParticles || !particlesContainer) return;
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.left = Math.random() * 100 + "vw";
    const size = Math.random() * 5 + 5;
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    const animationDuration = Math.random() * (config.maxAnimationDuration - config.minAnimationDuration) + config.minAnimationDuration;
    particle.style.animationDuration = animationDuration + "s";
    const colors = [
      'rgba(238, 139, 208, 0.5)',
      'rgba(135, 206, 235, 0.5)',
      'rgba(255, 182, 193, 0.5)',
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particlesContainer.appendChild(particle);
    currentParticles++;
    particle.addEventListener("animationend", () => {
      particle.remove();
      currentParticles--;
    }, { once: true });
  }

  function animateParticles() {
    if (currentParticles < config.maxParticles) createParticle();
    requestAnimationFrame(animateParticles);
  }

  if (particlesContainer) {
    for (let i = 0; i < config.maxParticles; i++) {
      setTimeout(createParticle, i * (config.particleInterval / config.maxParticles));
    }
    requestAnimationFrame(animateParticles);
  }

  window.addEventListener("resize", () => {
    config.maxParticles = window.innerWidth <= 768 ? 15 : 20;
    config.particleInterval = window.innerWidth <= 768 ? 600 : 400;
  }, { passive: true });

  // Avatar hover heart effect
  function createHeartEffect(avatar) {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.style.position = "absolute";
    heart.style.left = "50%";
    heart.style.top = "50%";
    heart.style.transform = "translate(-50%, -50%)";
    heart.style.color = "red";
    heart.style.fontSize = "20px";
    heart.textContent = "";
    avatar.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  }

  const avatars = document.querySelectorAll('.avatar-circle');
  avatars.forEach(avatar => {
    avatar.addEventListener('mouseover', () => {
      const randomAngle = Math.random() * 10 - 5;
      avatar.style.transform = `rotate(${randomAngle}deg) scale(1.1)`;
      avatar.querySelector('img').style.filter = `brightness(${110 + Math.random() * 10}%) sepia(${Math.random() * 15}%)`;
      createHeartEffect(avatar);
    });
    avatar.addEventListener('mouseout', () => {
      avatar.style.transform = 'rotate(0deg) scale(1)';
      avatar.querySelector('img').style.filter = 'brightness(100%) sepia(0%)';
    });
  });

  // Member card animation
  const memberCards = document.querySelectorAll('.member-card');
  if (memberCards.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const isLeft = entry.target.offsetLeft < window.innerWidth / 2;
          entry.target.style.animation = isLeft ? `fadeInLeft 1s ease-out` : `fadeInRight 1s ease-out`;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    memberCards.forEach(card => observer.observe(card));
  }

  // Show member detail modal
  window.showMemberDetail = function(name, avatar, age, dob, strength, weakness) {
    const modal = document.getElementById('memberModal');
    const modalName = document.getElementById('modalName');
    const modalAvatar = document.getElementById('modalAvatar');
    const modalAge = document.getElementById('modalAge');
    const modalDob = document.getElementById('modalDob');
    const modalStrength = document.getElementById('modalStrength');
    const modalWeakness = document.getElementById('modalWeakness');
    if (!modal || !modalName || !modalAvatar || !modalAge || !modalDob || !modalStrength || !modalWeakness) return;
    modalName.textContent = name || "Không có tên";
    modalAvatar.src = avatar || "https://via.placeholder.com/120";
    modalAvatar.style.maxWidth = '100%';
    modalAvatar.style.maxHeight = '100%';
    modalAvatar.style.objectFit = 'cover';
    modalAge.textContent = `Tuổi: ${age || "Không xác định"}`;
    modalDob.textContent = `Ngày sinh: ${dob || "Không xác định"}`;
    modalStrength.textContent = `Ưu điểm: ${strength || "Không xác định"}`;
    modalWeakness.textContent = `Nhược điểm: ${weakness || "Không xác định"}`;
    modal.style.display = 'flex';
  };

  window.closeMemberModal = function() {
    const modal = document.getElementById('memberModal');
    if (modal) modal.style.display = 'none';
  };

  // Show video modal
  window.showVideo = function(src, title, description) {
    const modal = document.getElementById("video-modal");
    const videoSource = document.getElementById("video-modal-source");
    const videoPlayer = document.getElementById("video-modal-player");
    const videoTitle = document.getElementById("video-modal-title");
    const videoDescription = document.getElementById("video-modal-description");
    if (!modal || !videoSource || !videoPlayer || !videoTitle || !videoDescription) return;
    videoSource.src = src;
    videoPlayer.load();
    videoPlayer.play().catch(() => {
      modal.addEventListener('click', () => videoPlayer.play(), { once: true });
    });
    videoTitle.textContent = title || "Không có tiêu đề";
    videoDescription.textContent = description || "Không có mô tả";
    modal.style.display = "flex";
    if (audio) {
      audio.pause(); // Pause background music
      audio.muted = true; // Mute to ensure it stays off
    }
  };

  window.closeVideoModal = function() {
    const modal = document.getElementById("video-modal");
    const videoPlayer = document.getElementById("video-modal-player");
    if (modal && videoPlayer) {
      videoPlayer.pause();
      videoPlayer.currentTime = 0;
      modal.style.display = "none";
      if (audio) {
        audio.muted = false; // Unmute
        audio.play().catch(error => {
          console.error("Failed to resume background music:", error);
        }); // Attempt to resume
      }
    }
  };

  // Show message modal
  window.showMessage = function(name, message) {
    const modal = document.getElementById("message-modal");
    const modalName = document.getElementById("modal-name");
    const modalMessage = document.getElementById("modal-message");
    if (!modal || !modalName || !modalMessage) return;
    modalName.textContent = name || "Không có tên";
    const cleanMessage = message.replace(/\/([^/]+)\//, '$1').replace(/\s+/g, ' ').trim();
    modalMessage.textContent = cleanMessage || "Không có nội dung";
    modal.style.display = "flex";
  };

  window.closeMessageModal = function() {
    const modal = document.getElementById("message-modal");
    if (modal) {
      modal.style.display = "none";
      console.log("Message modal closed successfully.");
    } else {
      console.warn("Message modal not found!");
    }
  };

  // Dynamic "Xem chi tiết" button
  document.querySelectorAll('.xem-chi-tiet').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.member-card');
      if (card) {
        const name = card.querySelector('h3')?.textContent || 'Không có tên';
        const avatar = card.querySelector('.avatar-circle img')?.src || 'https://via.placeholder.com/120';
        const age = card.querySelector('.description')?.innerHTML.match(/Tuổi: (\d+)/)?.[1] || 'Không xác định';
        const dob = card.querySelector('.description')?.innerHTML.match(/Ngày sinh: ([^<]+)/)?.[1]?.trim() || 'Không xác định';
        const strength = card.querySelector('.description')?.innerHTML.match(/Ưu điểm: ([^<]+)/)?.[1]?.trim() || 'Không xác định';
        const weakness = card.querySelector('.description')?.innerHTML.match(/Nhược điểm: ([^<]+)/)?.[1]?.trim() || 'Không xác định';
        window.showMemberDetail(name, avatar, age, dob, strength, weakness);
      }
    });
  });

  // Close modals with Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeMemberModal();
      window.closeMessageModal();
      window.closeVideoModal();
    }
  });

  // Background music control
  window.playBackgroundMusic = function() {
    if (audio) {
      audio.muted = false;
      audio.volume = 0.8;
      audio.play().catch(error => {
        console.error("Auto-play blocked by browser:", error);
        audio.muted = true;
        document.body.addEventListener('click', () => {
          audio.muted = false;
          audio.play().catch(err => console.error("Play after click failed:", err));
        }, { once: true });
      });
    }
  };

  // Auto-play background music on load
  if (audio) {
    audio.loop = true;
    playBackgroundMusic();
  }
});
