// Modern JavaScript for 12A9 Memory Website

class MemoryWebsite {
  constructor() {
    this.currentSection = 'home';
    this.isMenuOpen = false;
    this.isMusicPlaying = false;
    this.audio = null;
    this.isInitialized = false;
    this.init();
  }

  init() {
    console.log('Initializing Memory Website...');
    this.setupEventListeners();
    this.setupNavigation();
    this.setupAudio();
    this.loadContent();
    this.showNotification('Chào mừng đến với trang kỷ niệm 12A9! 🎉', 'success');
    this.isInitialized = true;
    console.log('Website initialized successfully');
  }

  setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-container') && this.isMenuOpen) {
        this.closeMenu();
      }
    });

    // Close modals with escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });

    // Window resize handler
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));

    // Intersection Observer for animations
    this.setupIntersectionObserver();
  }

  setupNavigation() {
    console.log('Setting up navigation...');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        this.navigateToSection(targetId);
        this.closeMenu();
      });
    });

    // Set initial active link
    this.updateActiveNavLink();
  }

  setupAudio() {
    console.log('Setting up audio...');
    this.audio = document.getElementById('background-music');
    if (this.audio) {
      this.audio.volume = 0.3;
      this.audio.loop = true;
      
      // Handle audio events
      this.audio.addEventListener('loadstart', () => console.log('Audio loading started'));
      this.audio.addEventListener('canplay', () => console.log('Audio can play'));
      this.audio.addEventListener('error', (e) => console.error('Audio error:', e));
    }
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.member-card, .media-item, .message-card');
    animateElements.forEach(el => observer.observe(el));
  }

  toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    this.isMenuOpen = !this.isMenuOpen;
    
    if (navMenu) {
      navMenu.classList.toggle('active', this.isMenuOpen);
    }
    
    if (navToggle) {
      navToggle.classList.toggle('active', this.isMenuOpen);
      navToggle.setAttribute('aria-expanded', this.isMenuOpen.toString());
    }
    
    console.log('Menu toggled:', this.isMenuOpen);
  }

  closeMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    this.isMenuOpen = false;
    
    if (navMenu) {
      navMenu.classList.remove('active');
    }
    
    if (navToggle) {
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  navigateToSection(sectionId) {
    console.log('Navigating to section:', sectionId);
    
    // Validate sectionId
    if (!sectionId) return;

    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      this.currentSection = sectionId;
      this.updateActiveNavLink();
      
      // Smooth scroll to section
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`Section with ID ${sectionId} not found`);
    }
  }

  updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1);
      link.classList.toggle('active', href === this.currentSection);
    });
  }

  loadContent() {
    console.log('Loading content...');
    this.showLoading();
    
    try {
      this.loadMembers();
      this.loadVideos();
      this.loadPhotos();
      this.loadMessages();
      
      setTimeout(() => {
        this.hideLoading();
        console.log('Content loaded successfully');
      }, 1000);
    } catch (error) {
      console.error('Error loading content:', error);
      this.hideLoading();
      this.showNotification('Lỗi khi tải nội dung', 'error');
    }
  }


  loadMembers() {
    const membersData = [
      { name: "Đồng Xuân An", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava24.JPG", age: 17, birthday: "29/10/2007", strengths: "Vui vẻ, hòa đồng", weaknesses: "Hay trễ giờ" },
      { name: "Nguyễn Ngọc Mai Anh", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava12.JPG", age: 18, birthday: "14/04/2007", strengths: "Dịu dàng, chăm chỉ", weaknesses: "Nhút nhát" },
      { name: "Lưu Trần Gia Bảo", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava17.JPG", age: 17, birthday: "11/08/2007", strengths: "Hài hước, năng động", weaknesses: "Lười học" },
      { name: "Ngô Phan Thái Bình", avatar: "https://via.placeholder.com/120", age: 17, birthday: "08/12/2007", strengths: "Siêng năng, chu đáo", weaknesses: "Quá nghiêm túc" },
      { name: "Đào Thị Huyền Diệu", avatar: "https://via.placeholder.com/120", age: 17, birthday: "10/08/2007", strengths: "Tốt bụng, sáng tạo", weaknesses: "Dễ phân tâm" },
      { name: "Nguyễn Thị Xuân Diệu", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava3.jpg", age: 17, birthday: "21/08/2007", strengths: "Hiền lành, kiên nhẫn", weaknesses: "Ít nói" },
      { name: "Bùi Chí Dũng", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava4.png", age: 17, birthday: "13/09/2007", strengths: "Thân thiện, dễ mến", weaknesses: "Hay lo lắng" },
      { name: "Nguyễn Trần Khánh Duy", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava26.JPG", age: 17, birthday: "30/10/2007", strengths: "Thông minh, sáng tạo", weaknesses: "Hay trì hoãn" },
      { name: "Lê Anh Đào", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava27.JPG", age: 17, birthday: "08/12/2007", strengths: "Xinh đẹp, hoạt bát", weaknesses: "Dễ xúc động" },
      { name: "Hoàng Thị Thúy Hằng", avatar: "https://via.placeholder.com/120", age: 19, birthday: "18/03/2006", strengths: "Kiên trì, chăm chỉ", weaknesses: "Cầu toàn" },
      { name: "Hoàng Gia Hân", avatar: "https://via.placeholder.com/120", age: 17, birthday: "05/12/2007", strengths: "Tốt bụng, vui vẻ", weaknesses: "Hay quên" },
      { name: "Phùng Gia Hân", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava32.JPG", age: 17, birthday: "24/11/2007", strengths: "Hòa đồng, sáng tạo", weaknesses: "Thích mơ mộng" },
      { name: "Trần Gia Huy", avatar: "https://via.placeholder.com/120", age: 18, birthday: "30/01/2007", strengths: "Tự tin, năng động", weaknesses: "Thích tranh luận" },
      { name: "Nguyễn Thị Thanh Huyền", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava9.jpg", age: 17, birthday: "11/11/2007", strengths: "Dịu dàng, tinh tế", weaknesses: "Hay lo lắng" },
      { name: "Trần Thị Ngọc Huyền", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava21.JPG", age: 17, birthday: "23/09/2007", strengths: "Hiền lành, chu đáo", weaknesses: "Ít chia sẻ" },
      { name: "Trần Thị Thu Hường", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava2.jpg", age: 17, birthday: "13/10/2007", strengths: "Tự lập, kiên trì", weaknesses: "Quá cầu toàn" },
      { name: "Nguyễn Hữu Khanh", avatar: "https://via.placeholder.com/120", age: 17, birthday: "21/09/2007", strengths: "Tích cực, lạc quan", weaknesses: "Hay vội vã" },
      { name: "Phùng Gia Khánh", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava22.JPG", age: 20, birthday: "05/11/2005", strengths: "Chăm chỉ, đáng tin cậy", weaknesses: "Thích làm việc một mình" },
      { name: "Nguyễn Thị Phương Mai", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava19.JPG", age: 17, birthday: "30/09/2007", strengths: "Xinh đẹp, hiền hậu", weaknesses: "Dễ xúc động" },
      { name: "Phạm Ngọc Trúc My", avatar: "https://via.placeholder.com/120", age: 17, birthday: "17/11/2007", strengths: "Xinh đẹp, dịu dàng", weaknesses: "Dễ xúc động" },
      { name: "Trần Khánh Ngọc", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava20.JPG", age: 17, birthday: "05/09/2007", strengths: "Tinh tế, chu đáo", weaknesses: "Hay lo lắng" },
      { name: "Trương Phạm Kim Nhàn", avatar: "https://via.placeholder.com/120", age: 17, birthday: "12/11/2007", strengths: "Kiên nhẫn, tốt bụng", weaknesses: "Ít nói" },
      { name: "Ngô Thanh Nhân", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava14.JPG", age: 18, birthday: "14/12/2006", strengths: "Hài hước, năng động", weaknesses: "Hay quên" },
      { name: "Huỳnh Long Nhật", avatar: "https://via.placeholder.com/120", age: 17, birthday: "27/09/2007", strengths: "Tự lập, mạnh mẽ", weaknesses: "Ít chia sẻ" },
      { name: "Dương Ngọc Nhi", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava28.JPG", age: 17, birthday: "11/07/2007", strengths: "Xinh đẹp, hoạt bát", weaknesses: "Thích kiểm soát" },
      { name: "Lê Ngọc Thảo Như", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava11.jpg", age: 17, birthday: "20/08/2007", strengths: "Hiền lành, chăm chỉ", weaknesses: "Dễ phân tâm" },
      { name: "Nguyễn Phạm Quỳnh Như", avatar: "https://via.placeholder.com/120", age: 18, birthday: "14/01/2007", strengths: "Tinh tế, khéo léo", weaknesses: "Hay lo lắng" },
      { name: "Vương Quý Phi", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava8.jpg", age: 17, birthday: "14/11/2007", strengths: "Tự tin, năng động", weaknesses: "Thích tranh luận" },
      { name: "Đặng Phương Quỳnh", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava29.JPG", age: 18, birthday: "05/06/2007", strengths: "Hiền lành, chu đáo", weaknesses: "Ít nói" },
      { name: "Huỳnh Phát Tài", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava18.JPG", age: 18, birthday: "29/05/2007", strengths: "Hài hước, năng động", weaknesses: "Hài" },
      { name: "Hoàng Phạm Duy Tân", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava16.JPG", age: 18, birthday: "18/03/2007", strengths: "Tự lập, mạnh mẽ", weaknesses: "Ít chia sẻ" },
      { name: "Trịnh Thị Kim Thanh", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava33.JPG", age: 21, birthday: "11/06/2004", strengths: "Xinh đẹp, dịu dàng", weaknesses: "Dễ xúc động" },
      { name: "Bùi Phương Thảo", avatar: "https://via.placeholder.com/120", age: 17, birthday: "07/12/2007", strengths: "Tinh tế, khéo léo", weaknesses: "Hay lo lắng" },
      { name: "Nguyễn Võ Hồng Thi", avatar: "https://via.placeholder.com/120", age: 17, birthday: "17/05/2007", strengths: "Tự tin, nhiệt huyết", weaknesses: "Thích kiểm soát" },
      { name: "Lê Ngọc Quỳnh Thư", avatar: "https://via.placeholder.com/120", age: 18, birthday: "12/04/2007", strengths: "Hiền lành, chu đáo", weaknesses: "Ít nói" },
      { name: "Nguyễn Hà Minh Thư", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava25.JPG", age: 17, birthday: "25/07/2007", strengths: "Tốt bụng, kiên nhẫn", weaknesses: "Dễ phân tâm" },
      { name: "Nguyễn Thị Anh Thư", avatar: "https://via.placeholder.com/120", age: 18, birthday: "28/04/2006", strengths: "Xinh đẹp, hoạt bát", weaknesses: "Hay lo lắng" },
      { name: "Nguyễn Song Bích Thy", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava30.JPG", age: 18, birthday: "21/01/2007", strengths: "Tinh tế, khéo léo", weaknesses: "Dễ xúc động" },
      { name: "Phạm Thanh Tuyết Thy", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava31.JPG", age: 17, birthday: "27/08/2007", strengths: "Hiền lành, chu đáo", weaknesses: "Ít nói" },
      { name: "Tạ Thủy Tiên", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava10.jpg", age: 17, birthday: "18/10/2007", strengths: "Xinh đẹp, năng động", weaknesses: "Dễ thương" },
      { name: "Đỗ Văn Đức Tình", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava13.JPG", age: 18, birthday: "20/02/2007", strengths: "Tự lập, mạnh mẽ", weaknesses: "Ít chia sẻ" },
      { name: "Lê Ngọc Yến Trang", avatar: "https://via.placeholder.com/120", age: 17, birthday: "27/12/2007", strengths: "Tinh tế, khéo léo", weaknesses: "Hay lo lắng" },
      { name: "Nguyễn Ngọc Quỳnh Trâm", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava15.JPG", age: 17, birthday: "18/10/2007", strengths: "Xinh đẹp, hoạt bát", weaknesses: "Dễ xúc động" },
      { name: "Lâm Huyền Trân", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava6.jpg", age: 17, birthday: "21/11/2007", strengths: "Hiền lành, chu đáo", weaknesses: "Ít nói" },
      { name: "Nguyễn Quang Tú", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/avatuss.jpg", age: 18, birthday: "20/02/2007", strengths: "Năng động, hài hước", weaknesses: "Hay quên" },
      { name: "Nguyễn Quang Tuấn", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava5.jpg", age: 18, birthday: "20/02/2007", strengths: "Tinh tế, khéo léo", weaknesses: "Thỉnh thoảng lơ đãng" },
      { name: "Nguyễn Thùy Minh Tuệ", avatar: "https://via.placeholder.com/120", age: 17, birthday: "13/07/2007", strengths: "Thông minh, sáng tạo", weaknesses: "Hay trì hoãn" },
      { name: "Nguyễn Văn Tùng", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava7.jpg", age: 17, birthday: "01/06/2007", strengths: "Thông minh, sáng tạo", weaknesses: "Thỉnh thoảng nhút nhát" },
      { name: "Trần Chí Tùng", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava23.JPG", age: 18, birthday: "05/03/2007", strengths: "Tự tin, năng động", weaknesses: "Thích tranh luận" },
      { name: "Trần Lê Khánh Vân", avatar: "https://via.placeholder.com/120", age: 18, birthday: "05/05/2007", strengths: "Xinh đẹp, dịu dàng", weaknesses: "Dễ xúc động" },
      { name: "Trần Thị Hải Vy", avatar: "https://via.placeholder.com/120", age: 17, birthday: "14/09/2007", strengths: "Tinh tế, khéo léo", weaknesses: "Hay lo lắng" },
      { name: "Phạm Hải Yến", avatar: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ava1.jpg", age: 17, birthday: "13/11/2007", strengths: "Hiền lành, chu đáo", weaknesses: "Ít nói" }
    ];

    const membersGrid = document.getElementById('members-grid');
    if (!membersGrid) return;

    membersGrid.innerHTML = membersData.map((member, index) => `
      <div class="member-card" onclick="showMemberDetail('${member.name}', '${member.avatar}', ${member.age}, '${member.birthday}', '${member.strengths}', '${member.weaknesses}')" style="animation-delay: ${index * 0.1}s">
        <div class="member-avatar">
          <img src="${member.avatar}" alt="${member.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/120/667eea/ffffff?text=${member.name.charAt(0)}'">
        </div>
        <h3 class="member-name">${member.name}</h3>
        <div class="member-info">
          <strong>Tuổi:</strong> ${member.age}<br>
          <strong>Ngày sinh:</strong> ${member.birthday}<br>
          <strong>Ưu điểm:</strong> ${member.strengths}<br>
          <strong>Nhược điểm:</strong> ${member.weaknesses}
        </div>
        <button class="member-btn">
          <i class="fas fa-eye"></i>
          Xem chi tiết
        </button>
      </div>
    `).join('');
  }

  loadVideos() {
    console.log('Loading videos...');
    const videosData = [
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video1.mp4", title: "Diễn như thật", description: "Khoảnh khắc vui vẻ." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video2.mp4", title: "Ngủ quên trời quên đất", description: "Đi học là 1 niềm vui." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video3.mp4", title: "Sinh nhật thầy Hậu", description: "Khoảng khác đáng nhớ." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video4.mp4", title: "Kịch nô hài", description: "Diễn kịch nhưng mà dui." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video5.mp4", title: "Video 5", description: "Giây phút chia tay xúc động." },
      { src: "https://res.cloudinary.com/dnqzcnkla/video/upload/v1748865600/e8yyjraej5r3vn7ffgel.mp4", title: "Video 6", description: "photobook đủ làm được 1 abulm lun." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video7.mp4", title: "Video 7", description: "Ăn ún no nê." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video8.mp4", title: "Video 8", description: "Buổi học thú vị." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video9.mp4", title: "Video 9", description: "Bất ngờ chưa." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video10.mp4", title: "Video 10", description: "Cảm nhận của cô trang chắc rất vuii." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video11.mp4", title: "Video 11", description: "Sinh nhật thầy hậu mà vui cỡ này." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video12.mp4", title: "Video 12", description: "Karaoke cùng bạn bè." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video13.mp4", title: "Video 13", description: "Phỏng vấn thầy Cường." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video14.mp4", title: "Video 14", description: "Mãi đỉnh nha thầy." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video15.mp4", title: "Video 15", description: "Sinh nhật thầy hậu vui quá đi." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video16.mp4", title: "Video 16", description: "Tạo bất ngờ cho cô Tâm." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video17.mp4", title: "Video 17", description: "Kỉ niệm yêu dấu." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video18.mp4", title: "Video 18", description: "Thầy Ngọc bất ngờ chuâ." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video19.mp4", title: "Video 19", description: "Tạo bất ngờ cho cô Gấm." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video20.mp4", title: "Video 20", description: "Tặng thầy Ngọc bài hát." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video21.mp4", title: "Video 21", description: "Chụp hình với thầy Hậu." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video22.mp4", title: "Video 22", description: "Buổi học tổng kết năm học." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video23.mp4", title: "Video 23", description: "Lớp mình đạt giải II, đỉnh quá di." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video24.mp4", title: "Video 24", description: "Kéo co thì lớp mình đoàn kết lắm." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video25.mp4", title: "Video 25", description: "Chuẩn bị hơi cực nhưng kỉ niệm rất vui." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video26.mp4", title: "Video 26", description: "Cô Tâm vì học sinh lắm lun, love cô." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video27.mp4", title: "Video 27", description: "Diễn cho lớp, kỉ niệm vui lắm." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video28.mp4", title: "Video 28", description: "Chắc cô bất ngờ lắm." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video29.mp4", title: "Video 29", description: "Ngày đó vui lắm, không thể quên được." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video30.mp4", title: "Video 30", description: "Gửi lời cảm ơn chân thành đến thầy/cô." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video31.mp4", title: "Video 31", description: "Quà cho cô Lý nhé <3" },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video32.mp4", title: "Video 32", description: "Khoảng khắc đáng nhớ." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video33.mp4", title: "Video 33", description: "Nhậu cùng ba Dũng nhâ." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video34.mp4", title: "Video 34", description: "Chụp kỉ niệm nhé." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video35.mp4", title: "Video 35", description: "Bế ba Dũng xuống biển thoiii." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video36.mp4", title: "Video 36", description: "Gục ngã, thầy bối rối." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video37.mp4", title: "Video 37", description: "Sinh nhật Phương Mai nhé." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video38.mp4", title: "Video 38", description: "Tập trung học thuiii." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video39.mp4", title: "Video 39", description: "Dóng kịch để thuyết trình tưởng đi làm diễn viên." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video40.mp4", title: "Video 40", description: "Khoảnh khắc đáng nhớ cuối năm." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video41.mp4", title: "Video 41", description: "Cấp báo!!" },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video58.mp4", title: "Video 42", description: "Memories." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video57.mp4", title: "Video 43", description: "Đoàn kết đoàn kết." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video44.mp4", title: "Video 44", description: "10A11." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video46.mp4", title: "Video 45", description: "Tập nhảy mà khong tha nhỏo." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video56.mp4", title: "Video 46", description: "Tỏa sáng with 12a9." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video62.mp4", title: "Video 47", description: "Háo hực di đalat mà lạc cô." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video52.mp4", title: "Video 48", description: "Mê.." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video53.mp4", title: "Video 49", description: "LangBiAng." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video48.mp4", title: "Video 50", description: "Trúc Lâm Yên Tử." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video51.mp4", title: "Video 51", description: "Quậy banh xe." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video54.mp4", title: "Video 52", description: "Quậy." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video63.mp4", title: "Video 53", description: "Quậy banh nóc đà lạt." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video59.mp4", title: "Video 54", description: "Chuẩn bị chụp kỉ yếu." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video64.mp4", title: "Video 55", description: "Vui lắm lun." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video61.mp4", title: "Video 56", description: "Giây phút sắp chia ly." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/video50.mp4", title: "Video 57", description: "Ca nhạc bạn nhé." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/6724289933668.mp4", title: "Video 58", description: "Cô gấm." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/6724290709048.mp4", title: "Video 59", description: "Luôn vui vẻ bạn nhé." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/6724290643035.mp4", title: "Video 60", description: "Giữa mãi trong tim mình nhé." },
      { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/videos/6724289943220.mp4", title: "Video 61", description: "Lớp 10 vui lắm." }
    ];

    const videoGrid = document.getElementById('video-grid');
    if (!videoGrid) return;

    videoGrid.innerHTML = videosData.map((video, index) => `
      <div class="media-item" onclick="showVideo('${video.src}', '${video.title}', '${video.description}')" style="animation-delay: ${index * 0.1}s">
        <video muted playsinline preload="metadata" onmouseenter="this.play().catch(e=>{})" onmouseleave="this.pause(); this.currentTime=0">
          <source src="${video.src}" type="video/mp4">
        </video>
        <div class="media-overlay">
          <h4 class="media-title">${video.title}</h4>
          <p class="media-description">${video.description}</p>
        </div>
      </div>
    `).join('');
  }

  loadPhotos() {
    console.log('Loading photos...');
    const photosData = [
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_gv1.jpg", title: "Cô Trang ♥", description: "Giáo viên môn văn của tụi mình nè." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_gv2.jpg", title: "Cô Tâm ♥", description: "Người Cô tận tâm với lớp 12A9 ♥." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_gv3.jpg", title: "2 người đẹp ♥", description: "Luôn đồng hành cùng lớp trong mọi hoạt động." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_gv4.jpg", title: "Cô Gấm", description: "Người cô đáng kính của lớp 11A9." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp1.jpg", title: "Ảnh lớp 1", description: "Săn mây Đà Lạt ne." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp2.jpg", title: "Ảnh lớp 2", description: "Buổi học đầu tiên đầy kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp3.jpg", title: "Ảnh lớp 3", description: "Ngày hội thể thao sôi động." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp4.jpg", title: "Ảnh lớp 4", description: "Chuyến đi dã ngoại đáng nhớ." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp5.jpg", title: "Ảnh lớp 5", description: "Buổi văn nghệ đầy cảm xúc." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp6.jpg", title: "Ảnh lớp 6", description: "Hội trại sôi động của lớp." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp7.jpg", title: "Ảnh lớp 7", description: "Ngày chụp ảnh tập thể đầu tiên." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp8.jpg", title: "Ảnh lớp 8", description: "Buổi học nhóm ngoài trời." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp9.jpg", title: "Ảnh lớp 9", description: "Ngày hội khoa học sáng tạo." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp10.jpg", title: "Ảnh lớp 10", description: "Tham gia hoạt động ngoại khóa." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp11.jpg", title: "Ảnh lớp 11", description: "Buổi sinh hoạt lớp vui vẻ." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp12.jpg", title: "Ảnh lớp 12", description: "Hội hè cùng bạn bè." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp13.jpg", title: "Ảnh lớp 13", description: "Chuyến đi từ thiện ý nghĩa." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp14.jpg", title: "Ảnh lớp 14", description: "Ngày hội truyền thống trường." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp15.jpg", title: "Ảnh lớp 15", description: "Lễ kỷ niệm thành lập trường." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp16.jpg", title: "Ảnh lớp 16", description: "Buổi học ngoại khóa thú vị." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp17.jpg", title: "Ảnh lớp 17", description: "Tham gia giải bóng đá lớp." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp18.jpg", title: "Ảnh lớp 18", description: "Chuyến đi thực tế tại bảo tàng." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp19.jpg", title: "Ảnh lớp 19", description: "Buổi tiệc cuối năm ấm áp." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp20.jpg", title: "Ảnh lớp 20", description: "Ngày hội thể thao toàn trường." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp21.jpg", title: "Ảnh lớp 21", description: "Buổi học nhóm ngoài trời." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp22.jpg", title: "Ảnh lớp 22", description: "Tham gia hội thi nấu ăn." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp23.jpg", title: "Ảnh lớp 23", description: "Ngày hội môi trường xanh." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp24.jpg", title: "Ảnh lớp 24", description: "Buổi họp lớp đầy cảm xúc." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp25.jpg", title: "Ảnh lớp 25", description: "Chuyến đi picnic vui vẻ." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp26.jpg", title: "Ảnh lớp 26", description: "Ngày hội sách và tri thức." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp27.jpg", title: "Ảnh lớp 27", description: "Tham gia hoạt động tình nguyện." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp28.jpg", title: "Ảnh lớp 28", description: "Buổi học kỹ năng sống." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp29.jpg", title: "Ảnh lớp 29", description: "Ngày hội nghề nghiệp tương lai." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_lp30.jpg", title: "Ảnh lớp 30", description: "Tham gia giải chạy marathon." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/z6709921039781_1300731ad87aad338dd18aac23cd1093.jpg", title: "Ảnh lớp 31", description: "Tập thể 12A9." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/z6709921057473_712220237bf5258b35d4209b88c2ff8d.jpg", title: "Ảnh lớp 32", description: "Tập thể 12A9." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/z6709921104168_dc58a0c2480a1f19820f8a3c6be52a08.jpg", title: "Ảnh lớp 33", description: "Tập thể 12A9." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/z6709921123484_ff62101e90283cc2ec1ae2c546790384.jpg", title: "Ảnh lớp 34", description: "Tập thể 12A9." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_1.jpg", title: "Ảnh 1", description: "Khoảnh khắc vui vẻ cùng bạn bè." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_2.jpg", title: "Ảnh 2", description: "Buổi học nhóm đầy kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_3.jpg", title: "Ảnh 3", description: "Ngày hội thể thao sôi động." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_4.jpg", title: "Ảnh 4", description: "Chuyến đi dã ngoại đáng nhớ." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_5.jpg", title: "Ảnh 5", description: "Buổi văn nghệ đầy cảm xúc." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_6.jpg", title: "Ảnh 6", description: "Hội trại sôi động của lớp." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_7.jpg", title: "Ảnh 7", description: "Ngày chụp ảnh tập thể đầu tiên." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_8.jpg", title: "Ảnh 8", description: "Buổi học nhóm ngoài trời." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_9.jpg", title: "Ảnh 9", description: "Ngày hội khoa học sáng tạo." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_10.jpg", title: "Ảnh 10", description: "Tham gia hoạt động ngoại khóa." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_11.jpg", title: "Ảnh 11", description: "Buổi sinh hoạt lớp vui vẻ." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_12.jpg", title: "Ảnh 12", description: "Hội hè cùng bạn bè." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_13.jpg", title: "Ảnh 13", description: "Chuyến đi từ thiện ý nghĩa." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_14.jpg", title: "Ảnh 14", description: "Ngày hội truyền thống trường." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_15.jpg", title: "Ảnh 15", description: "Lễ kỷ niệm thành lập trường." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_16.jpg", title: "Ảnh 16", description: "Buổi học ngoại khóa thú vị." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_17.jpg", title: "Ảnh 17", description: "Tham gia giải bóng đá lớp." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_18.jpg", title: "Ảnh 18", description: "Chuyến đi thực tế tại bảo tàng." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_19.jpg", title: "Ảnh 19", description: "Buổi tiệc cuối năm ấm áp." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_20.jpg", title: "Ảnh 20", description: "Ngày hội thể thao toàn trường." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_21.jpg", title: "Ảnh 21", description: "Buổi học nhóm ngoài trời." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_22.jpg", title: "Ảnh 22", description: "Tham gia hội thi nấu ăn." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_23.jpg", title: "Ảnh 23", description: "Ngày hội môi trường xanh." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_24.jpg", title: "Ảnh 24", description: "Buổi họp lớp đầy cảm xúc." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_25.jpg", title: "Ảnh 25", description: "Chuyến đi picnic vui vẻ." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_26.jpg", title: "Ảnh 26", description: "Tanker S1." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_27.jpg", title: "Ảnh 27", description: "Tháng năm ấy..." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_28.jpg", title: "Ảnh 28", description: "Dặt chân lên Đà Lạt." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_29.jpg", title: "Ảnh 29", description: "Tâm sự." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_30.jpg", title: "Ảnh 30", description: "Tham gia giải ngày hội." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_31.jpg", title: "Ảnh 31", description: "Lên xe anh đèo." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_32.jpg", title: "Ảnh 32", description: "Ngày hôm ấy vuii lắm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_33.jpg", title: "Ảnh 33", description: "Tựa vai." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_34.jpg", title: "Ảnh 34", description: "Chợ Đà Lạt." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_35.jpg", title: "Ảnh 35", description: "Quyết tâm đạt giải." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_36.jpg", title: "Ảnh 36", description: "Tập văn nghệ." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_37.jpg", title: "Ảnh 37", description: "Chụp hình cùng cô Gấm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_38.jpg", title: "Ảnh 38", description: "Ngày tháng năm ấy vui biết mấy." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_39.jpg", title: "Ảnh 39", description: "Phát tài lên đồ chống nắng." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_40.jpg", title: "Ảnh 40", description: "Ảnh ngoan chưa kìa." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_41.jpg", title: "Ảnh 41", description: "3 chị em siu nhân." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_42.jpg", title: "Ảnh 42", description: "Xách bàn ra ngoài ăn lun." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_43.jpg", title: "Ảnh 43", description: "Đại Ka Tuấn trùm toán học nhâ ♥." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_44.jpg", title: "Ảnh 44", description: "Đi chụp photobook ne ♥." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_45.jpg", title: "Ảnh 45", description: "Bắn timm ♥." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_47.jpg", title: "Ảnh 46", description: "F4 chúng mình." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_49.jpg", title: "Ảnh 47", description: "Ăn vụng trc khi vô lp nhe." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_51.jpg", title: "Ảnh 48", description: "Tay chỉ sao." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_54.jpg", title: "Ảnh 49", description: "Đi bảo tàng chứng tích nhé." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/ảnh_57.jpg", title: "Ảnh 50", description: "Dth quas di's." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/z6709921038311_4714aaa90989a96a750d44565ba088da.jpg", title: "Ảnh 51", description: "Kỉ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/z6709921058178_547a1db3c093ce5e7c9586819f2dfd7b.jpg", title: "Ảnh 54", description: "Buổi học thú vị." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/z6709921113774_fc0f602478e6357717e4020de716a479.jpg", title: "Ảnh 56", description: "Chuyến đi thực tế tại bảo tàng." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8872.JPG", title: "Ảnh 58", description: "Ngày hội toàn trường." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8863.JPG", title: "Ảnh 59", description: "Buổi học nhóm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8860.JPG", title: "Ảnh 60", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8831.JPG", title: "Ảnh 61", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8583.JPG", title: "Ảnh 62", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8549.JPG", title: "Ảnh 63", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8537.JPG", title: "Ảnh 64", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8529.JPG", title: "Ảnh 65", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8404.JPG", title: "Ảnh 66", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8401.JPG", title: "Ảnh 67", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8347.JPG", title: "Ảnh 68", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8342.JPG", title: "Ảnh 69", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8334.JPG", title: "Ảnh 70", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8253.JPG", title: "Ảnh 71", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8232.png", title: "Ảnh 72", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8246.JPG", title: "Ảnh 73", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8232.JPG", title: "Ảnh 74", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8210.JPG", title: "Ảnh 75", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8195.JPG", title: "Ảnh 76", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8190.JPG", title: "Ảnh 77", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A8029.JPG", title: "Ảnh 78", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/2F7A7965.JPG", title: "Ảnh 79", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/127A1475.JPG", title: "Ảnh 80", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/127A1471.JPG", title: "Ảnh 81", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/127A1463.JPG", title: "Ảnh 82", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/127A1314.JPG", title: "Ảnh 83", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/127A1308.JPG", title: "Ảnh 84", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/127A1081.JPG", title: "Ảnh 85", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/z6725888143929_d4d79682e20ee2f5ed1f2809fcf13dde.jpg", title: "Ảnh 86", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/HAI05341.JPG", title: "Ảnh 87", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/HAI05372.JPG", title: "Ảnh 88", description: "Kỷ niệm." },
    { src: "https://12a9.s3.ap-southeast-1.amazonaws.com/images/HAI05032.JPG", title: "Ảnh 89", description: "Kỷ niệm." }
  ];

    const photoGrid = document.getElementById('photo-grid');
    if (!photoGrid) return;

    photoGrid.innerHTML = photosData.map((photo, index) => `
      <div class="media-item" onclick="showImage('${photo.src}', '${photo.title}', '${photo.description}')" style="animation-delay: ${index * 0.1}s">
        <img src="${photo.src}" alt="${photo.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/280x220/667eea/ffffff?text=Ảnh+lỗi'">
        <div class="media-overlay">
          <h4 class="media-title">${photo.title}</h4>
          <p class="media-description">${photo.description}</p>
        </div>
      </div>
    `).join('');
  }

  loadMessages() {
    console.log('Loading messages...');
    const messagesData = [
        {
            author: "Đồng Xuân An",
            content: "Tiếng trống trường vang lên, không còn gọi ta vào lớp nữa, mà là khép lại những tháng ngày áo trắng hồn nhiên. Cảm giác trống rỗng len lỏi, tim như có gì nghẹn lại. Nhìn bạn bè lần cuối trong bộ đồng phục, ta chợt sợ mai này không còn được vô tư cười đùa bên nhau nữa. Thầy cô bước đi, bóng dáng như dài ra trên sân nắng chiều - người đưa đò đã hoàn tất một chuyến. Chỉ mong có thể níu lại chút thời gian, chỉ mong những kỷ niệm đừng trôi quá nhanh..."
        },
        {
            author: "Nguyễn Ngọc Mai Anh",
            content: "Tớ đã viết cho cậu biết bao lá thư, nhưng chưa từng gửi. Có lẽ tớ sợ, sợ khi mọi thứ phơi bày ra sẽ khiến chúng ta không thể cười tự nhiên nữa. Mỗi lần cậu mượn bút, cười với tớ hay đơn giản chỉ ngồi gần trong giờ học, trái tim tớ lại run lên. Cảm giác ấy đẹp lắm, nhưng cũng mong manh. Tuổi học trò mà, tình cảm trong trẻo nhưng không đủ can đảm để giữ lấy. Lá thư vẫn nằm yên trong ngăn bàn, cùng những kỷ niệm chưa kịp nói thành lời..."
        },
        {
            author: "Lưu Trần Gia Bảo",
            content: "Dạo này đến lớp, ta hay ngồi lặng thinh nhìn khoảng trống trên những dãy bàn. Có bạn đã nghỉ, có bạn đang ôn thi ở xa, có người đã chọn lối đi riêng. Lớp học bỗng lặng hơn, tiếng nói cười cũng không còn như trước. Những chỗ trống ấy không chỉ là chiếc ghế vắng, mà còn là một phần thanh xuân đang dần rời xa. Chúng ta đều lớn, đều phải đi tiếp, nhưng sao vẫn mong mọi người mãi ở đây, mãi là tập thể 12A9 thân quen thuở nào..."
        },
        {
            author: "Ngô Phan Thái Bình",
            content: "Chẳng hiểu sao tớ lại nhớ những buổi chiều ở lại trực nhật đến thế. Cái lớp ồn ào ban sáng, chiều về chỉ còn lại vài đứa loay hoay quét lớp, lau bảng. Mùi bụi phấn, tiếng chổi quét lạo xạo, tiếng cười vang trong ánh nắng cuối ngày - những điều nhỏ bé ấy làm nên thanh xuân. Chúng ta từng tranh nhau lau bảng, từng lén viết lên bảng những dòng nhắn gửi nhau. Giờ nghĩ lại, thấy ấm áp đến lạ. Giá như những buổi chiều ấy có thể kéo dài thêm một chút..."
        },
        {
            author: "Đào Thị Huyền Diệu",
            content: "Thầy vẫn vậy - dáng cao gầy, giọng trầm và ánh mắt ấm. Có lần thầy giảng bài, chợt dừng lại nhìn cả lớp rồi mỉm cười buồn: “Mấy đứa sắp lớn hết rồi nhỉ?” Khoảnh khắc đó khiến ta nhận ra: thời gian đang lặng lẽ rời đi. Những lời nhắc nhở, những lần mắng yêu, những buổi kiểm tra bất ngờ - tất cả là yêu thương thầy dành cho lũ học trò bướng bỉnh. Cảm ơn thầy, vì đã ở bên tụi em trong những năm tháng ngây ngô nhất."
        },
        {
            author: "Nguyễn Thị Xuân Diệu",
            content: "Tờ giấy thi cuối cùng được nộp lên, cả lớp thở phào mà tim lại nghèn nghẹn. Không còn bài kiểm tra nào nữa đồng nghĩa không còn lần nào cùng nhau hồi hộp, không còn tiếng than vãn “sao ra đề khó thế!”. Bỗng dưng thấy tiếc, dù từng mong kiểm tra nhanh kết thúc. Có những điều, chỉ khi sắp mất đi ta mới kịp nhận ra, rằng nó đã từng gắn bó với mình nhiều đến thế."
        },
        {
            author: "Bùi Chí Dũng",
            content: "Cơn mưa bất chợt đổ xuống trong giờ ra chơi, ai nấy đều vội vã chạy tránh. Vậy mà vẫn có đứa đứng dưới mái hiên, ngẩn người nhìn từng giọt mưa rơi. Mưa hôm nay giống như những kỷ niệm: bất chợt, dai dẳng, và thấm sâu vào lòng. Có ai đã từng ngồi dưới tán phượng nghe mưa, rồi bỗng thèm quay lại những ngày mưa ướt áo mà không lo âu chuyện đời?"
        },
        {
            author: "Nguyễn Trần Khánh Duy",
            content: "Dòng người xếp hàng ở căn tin vẫn đông như mọi khi, nhưng hôm nay lại khác. Tớ biết, đây là lần cuối cùng mình ăn ở đây - chỗ từng giành nhau từng suất bánh mì, từng cốc trà đá. Mỗi góc trong căn tin đều có dấu vết của đám bạn tinh nghịch, của tiếng cười, của mấy lần mượn tiền chưa kịp trả. Bữa ăn cuối cùng ấy không còn ngon như xưa, mà thấm đẫm mùi vị chia xa."
        },
        {
            author: "Lê Anh Đào",
            content: "Cây phượng ấy đã đứng đó từ năm đầu cấp, giờ lại đỏ rực như lời chia tay không thành tiếng. Những cánh hoa rơi như từng mảnh thời gian, từng khoảnh khắc chúng ta bên nhau. Tớ đã khắc tên tụi mình lên thân cây, nơi không ai nhìn thấy, như một lời nhắn rằng: thanh xuân này có cậu. Rồi phượng sẽ tàn, hè sẽ qua, nhưng có một điều sẽ mãi còn: kỷ niệm tuổi học trò."
        },
        {
            author: "Hoàng Thị Thúy Hằng",
            content: "Thầy không dạy bằng giáo án, mà bằng chính cách sống. Có lần cả lớp phạm lỗi, thầy không la mà chỉ kể chuyện thời thầy đi học. Giọng thầy chậm rãi, ánh mắt xa xăm. Từng lời như thấm vào tim. Lúc ấy ta hiểu: trưởng thành không chỉ là điểm số, mà là biết nhận lỗi, biết đứng lên. Bài học ấy không có trong sách, nhưng sẽ theo ta suốt đời "
        },
        {
            author: "Hoàng Gia Hân",
            content: "Góc lớp nơi bàn cuối từng là “đại bản doanh” của tụi mình. Nơi đó từng cất tiếng cười, từng giấu giọt nước mắt. Bây giờ, mỗi lần quay lại nhìn, lòng lại chùng xuống. Bàn ghế vẫn đó, nhưng người đã khác. Chúng ta không còn tranh nhau chỗ ngồi, không còn viết những mẩu giấy vụn chuyền tay nhau. Góc lớp ấy, lặng lẽ giữ những ký ức không ai hay biết."
        },
        {
            author: "Phùng Gia Hân",
            content: "Cuốn sổ lưu bút mở ra, trang đầu tiên vẫn trắng tinh. Ai cũng chần chừ, chẳng ai biết viết gì để đủ đầy, để không hối tiếc. Viết về bạn, về thầy, về những trò tinh nghịch, viết về giấc mơ sau cánh cổng trường. Có người cười, có người rơi nước mắt. Có dòng chữ viết vội, nguệch ngoạc, nhưng chứa trọn cả một thời tuổi trẻ."
        },
        {
            author: "Trần Gia Huy",
            content: "Lần trốn học duy nhất của tụi mình không phải để chơi, mà là để ngồi với nhau ở bờ kè, nói về tương lai. Đứa muốn làm bác sĩ, đứa muốn đi nước ngoài, đứa muốn… mãi bên nhau như bây giờ. Trốn học hôm ấy không bị ai phát hiện, nhưng nó in đậm trong tim như một lần “nổi loạn” đẹp nhất. Chúng ta đã dám rời lớp học một chút, để học về tình bạn và ước mơ."
        },
        {
            author: "Nguyễn Thị Thanh Huyền",
            content: "Lá thư báo điểm rơi vào tay run run. Có người cười như vỡ òa, có người im lặng nhìn xuống đất. Đằng sau mỗi con số là bao tháng ngày thức khuya, bao lần rơi nước mắt. Có bạn chưa đạt được như mong đợi, nhưng đừng buồn - tuổi học trò không chỉ đo bằng điểm số. Chúng ta đã cố gắng hết mình, và điều đó xứng đáng được trân trọng hơn bất kỳ con số nào."
        },
        {
            author: "Trần Thị Ngọc Huyền",
            content: "Chiếc áo đồng phục nay đã bạc màu, cổ áo sờn chỉ, nhưng tớ không nỡ bỏ đi. Nó từng theo tớ suốt ba năm, từng thấm mồ hôi mùa thi, từng nhuốm nước mắt ngày chia tay. Mỗi vết mực, mỗi chỗ rách là một kỷ niệm. Có người chê nó xấu, nhưng với tớ, đó là tấm áo đẹp nhất, vì nó chứa cả một thời thanh xuân rực rỡ."
        },
        {
            author: "Trần Thị Thu Hường",
            content: "Ai đó trong lớp đã lặng lẽ vẽ một bức tranh. Trong đó là bảng đen, bàn ghế, thầy cô và cả những gương mặt thân quen. Bức tranh không đẹp như hoạ sĩ vẽ, nhưng từng đường nét lại khiến ta xúc động. Bởi mỗi màu sắc là một phần ký ức, mỗi gương mặt là một nỗi nhớ. Có thể ta sẽ xa nhau, nhưng bức tranh ấy - và quãng đời ấy - sẽ mãi là một phần trong tim mỗi người."
        },
        {
            author: "Nguyễn Hữu Khanh",
            content: "Có lần tớ hỏi cậu: “Cậu có biết lúc cậu cười, mắt cậu cong như vầng trăng không?” Cậu chỉ cười bảo: “Vậy à?” Và tớ thì không nói gì thêm. Bởi vì tớ biết, mình thích nụ cười ấy từ lúc nào chẳng hay. Mỗi lần lớp mệt mỏi vì bài vở, chỉ cần thấy ánh mắt cậu, thấy nụ cười ấy, mọi mỏi mệt đều tan biến. Có lẽ, cậu là thanh xuân dịu dàng nhất mà tớ từng gặp."
        },
        {
            author: "Phùng Gia Khánh",
            content: "Thanh xuân tuổi học trò cấp 3 là khoảng trời đẹp đẽ nhất đời người. Đó là nơi ta cất giữ những nụ cười vô tư, những lần trốn tiết để ăn quà vặt, hay những ánh mắt bối rối đầu đời. Những tiết học đôi khi dài lê thê, những lần bị gọi lên bảng run rẩy trả lời, tất cả đều hóa thành kỷ niệm. Tuổi 17, 18 - độ tuổi chưa đủ lớn để gọi là trưởng thành nhưng cũng không còn quá trẻ con. Ở nơi ấy, tình bạn, tình thầy trò, và cả những rung động đầu đời đều được vẽ nên bằng màu sắc trong sáng. Dù mai này có đi đâu, làm gì, ta cũng sẽ nhớ mãi một thời áo trắng ngây thơ, đầy ước mơ và khát vọng."
        },
        {
            author: "Nguyễn Thị Phương Mai",
            content: "Thanh xuân cấp 3 là những ngày tháng sống hết mình với ước mơ. Là những buổi học thêm tối mịt vẫn cười vang cùng bạn, là những lần thi thử căng thẳng mà vẫn hẹn nhau ăn chè sau đó. Dù áp lực thi cử đè nặng, nhưng đó là khoảng thời gian chúng ta sống chân thành nhất. Những lời động viên từ bạn bè, những ánh mắt lo lắng từ thầy cô, tất cả là động lực để bước tiếp. Có lẽ sau này khi trưởng thành, ta sẽ không còn có cơ hội sống trọn vẹn như những ngày ấy - vừa áp lực, vừa vui, vừa hồi hộp, vừa mơ mộng. Và rồi, khi chia xa, ta mới chợt hiểu: thanh xuân là quãng đời ngắn ngủi, nhưng để thương nhớ một đời."
        },
        {
            author: "Phạm Ngọc Trúc My",
            content: "Tuổi học trò cấp 3 giống như một thước phim quay chậm. Mỗi ngày đến trường là một ngày đáng nhớ, dù là buồn hay vui. Có hôm cười nghiêng ngả vì trò đùa của đám bạn, có hôm khóc thầm vì điểm kiểm tra thấp. Nhưng tất cả đều chân thật, đều là thanh xuân không thể quay lại. Áo trắng, bảng đen, ghế đá sân trường - những điều bình dị ấy lại in sâu trong tâm trí. Chúng ta từng đứng dưới mưa, từng nắm tay nhau hứa hẹn một tương lai rực rỡ. Và rồi, khi thời gian trôi qua, ký ức ấy vẫn sống mãi trong tim, nhắc nhớ về một thời học trò - vụng về nhưng chan chứa yêu thương."
        },
        {
            author: "Trần Khánh Ngọc",
            content: "Thanh xuân cấp 3 là những mối tình ngây ngô chưa kịp gọi tên. Là ánh mắt bối rối khi lỡ chạm ánh mắt ai đó trong lớp, là những lần tim đập rộn ràng chỉ vì một nụ cười. Tình cảm tuổi học trò không ồn ào, không hứa hẹn dài lâu, nhưng đủ để ta nhớ mãi. Đôi khi chỉ là việc ngồi cùng bàn, chia nhau cây kẹo, hay mượn vở chép bài - cũng khiến trái tim bồi hồi. Dù sau này mỗi người một ngả, nhưng trong lòng ta vẫn lưu giữ bóng hình người ấy - mối tình đầu nhẹ nhàng như mây trời. Bởi tuổi trẻ là để yêu, để thương, để giữ mãi một cảm xúc đẹp đẽ mang tên “học trò”."
        },
        {
            author: "Trương Phạm Kim Nhàn",
            content: "Nếu được quay về, tôi muốn sống lại những ngày tháng cấp 3 thêm một lần nữa. Đó là khoảng thời gian tôi cười nhiều nhất, khóc cũng thật lòng nhất. Là nơi tôi gặp những người bạn tri kỷ, cùng học cùng chơi, cùng ôn thi suốt đêm. Có khi giận nhau vì những điều vụn vặt, nhưng rồi lại dễ dàng tha thứ. Mỗi kỳ thi là một cột mốc, mỗi buổi chia tay là một lần nghẹn ngào. Có lẽ vì thế mà người ta vẫn bảo: “Thanh xuân là thứ đẹp đẽ nhưng mong manh nhất.” Tôi đã sống trọn từng khoảnh khắc ấy, và sẽ luôn trân trọng những năm tháng rực rỡ ấy - thời cấp 3 tươi đẹp và ngập tràn hy vọng."
        },
        {
            author: "Ngô Thanh Nhân",
            content: "Thanh xuân học trò là những giờ ra chơi đầy tiếng cười. Chỉ 15 phút ngắn ngủi giữa các tiết học thôi nhưng đủ để kể hết bao chuyện vui buồn, đủ để rượt đuổi, đá cầu, hay đơn giản là ngồi tựa vai nhau dưới gốc phượng già. Có những lúc chán học, ra sân nằm dài nhìn mây trôi, cảm thấy thế giới thật yên bình. Thời ấy chẳng cần điện thoại hay mạng xã hội, chỉ cần có nhau là đủ. Những niềm vui giản dị ấy giờ trở thành báu vật trong ký ức. Ra chơi không chỉ là nghỉ ngơi, mà là thời khắc nuôi dưỡng tình bạn, gắn kết những tâm hồn trẻ trung, vô tư. Một thời mà chúng ta sống đúng với tuổi, không lo toan, không giả vờ."
        },
        {
            author: "Huỳnh Long Nhật",
            content: "Cấp 3 là khoảng thời gian chúng ta phải học cách đối mặt với áp lực. Từ những kỳ thi giữa kỳ, cuối kỳ, cho đến áp lực từ kỳ thi đại học. Mỗi ngày đều là những cuộc chạy đua với thời gian, học thêm, luyện đề, thức khuya. Nhưng giữa những áp lực đó, ta lại nhận ra sự cố gắng của mình có ý nghĩa. Đó là lần đầu ta nghiêm túc đặt câu hỏi: “Mình muốn trở thành ai?” Những giọt mồ hôi, nước mắt, những thất bại nhỏ - tất cả đều là hành trang vững chắc cho tương lai. Thanh xuân không chỉ có màu hồng, mà còn có cả mồ hôi, nỗ lực và kiên trì. Nhưng chính vì thế, nó mới trở nên đáng nhớ và đáng quý biết bao."
        },
        {
            author: "Dương Ngọc Nhi",
            content: "Có ai chưa từng ngắm hoa phượng nở mà lòng chợt bâng khuâng? Phượng nở báo hiệu mùa chia tay, mùa thi, mùa trưởng thành. Cấp 3 gắn với những cánh phượng đỏ rực, với ve kêu râm ran trong sân trường đầy nắng. Những cánh hoa ép vào trang vở, gửi gắm bao điều chưa nói. Dưới tán phượng ấy, biết bao cuộc trò chuyện thầm kín, những lời hứa hẹn, những giọt nước mắt ngày cuối cùng bên nhau. Mỗi mùa hè đi qua là một lần lớn lên, nhưng cũng là một lần mất đi điều gì đó. Và phượng, như một chứng nhân im lặng của thanh xuân, vẫn rực rỡ nở mỗi năm, nhắc ta về những năm tháng không thể nào quên."
        },
        {
            author: "Lê Ngọc Thảo Như",
            content: "Tình bạn thời cấp 3 là món quà vô giá. Đó không phải là những mối quan hệ xã giao, mà là tình bạn chân thành, dám cho đi không cần nhận lại. Là những người cùng khóc, cùng cười, cùng trải qua bao thăng trầm của tuổi trẻ. Là đứa bạn giận dỗi vài ngày rồi lại làm hòa vì nhớ nhau quá. Là đứa sẵn sàng chép bài hộ, nhường ghế đá, hay chờ nhau về mỗi buổi tan học. Có thể sau này ta sẽ gặp nhiều người mới, kết bạn nhiều nơi, nhưng không ai có thể thay thế những người bạn đã cùng ta đi qua thanh xuân ấy - một cách tự nhiên, trong trẻo và đầy thương mến."
        },
        {
            author: "Nguyễn Phạm Quỳnh Như",
            content: "Tuổi học trò là những buổi sinh hoạt lớp đầy màu sắc. Có lớp nghiêm túc, có lớp náo loạn, nhưng tất cả đều mang nét riêng không thể lẫn. Những lần tổ chức sinh nhật cho bạn, diễn văn nghệ, chuẩn bị 20/11, làm báo tường - mỗi kỷ niệm đều gắn với một khoảng trời rộn ràng tiếng cười. Có khi bất đồng, có khi giận hờn, nhưng sau tất cả, tình cảm tập thể vẫn là điều đọng lại. Cấp 3 dạy ta cách làm việc nhóm, cách yêu thương và quan tâm đến người khác. Chính những sinh hoạt lớp đời thường ấy lại là chất liệu nuôi dưỡng tình cảm gắn bó mà ta không thể tìm lại lần thứ hai."
        },
        {
            author: "Vương Quý Phi",
            content: "Những buổi học cuối cùng luôn khiến tim người ta nghẹn lại. Lúc ấy, dù muốn hay không, ta vẫn phải đối diện với sự chia tay. Nhìn bạn bè ký tên lên áo, trao nhau những lời chúc, mà lòng cứ rưng rưng. Đứa cười thật to để che giấu nước mắt, đứa ngồi lặng thinh không nói được câu nào. Có lẽ phải đến khi xa nhau thật rồi, ta mới hiểu hết giá trị của từng khoảnh khắc. Những ngày cuối cấp là dịp để ta trân trọng, để nói lời cảm ơn và xin lỗi. Và cũng là lúc nhận ra: mỗi con đường sẽ dẫn đến một chân trời riêng, nhưng ký ức về những ngày bên nhau - sẽ mãi còn trong tim."
        },
        {
            author: "Đặng Phương Quỳnh",
            content: "Thanh xuân học trò là khi chỉ cần một lời khen từ thầy cô cũng đủ khiến ta vui suốt cả ngày. Là khi bị mắng nhưng vẫn âm thầm cố gắng để không làm thầy cô buồn. Tình cảm thầy trò cấp 3 không còn đơn thuần như tiểu học, mà dần trở thành sự gắn bó sâu sắc. Họ không chỉ dạy kiến thức, mà còn dạy ta cách sống, cách đứng lên sau vấp ngã. Có những câu nói của thầy cô ta sẽ nhớ suốt đời, vì nó chạm vào trái tim non trẻ của ta đúng lúc nhất. Có thể khi trưởng thành, ta không còn gặp lại họ, nhưng bóng dáng thầy cô vẫn mãi ở đó - như người dẫn đường thầm lặng, đầy yêu thương."
        },
        {
            author: "Huỳnh Phát Tài",
            content: "Sáng sớm đến trường là khoảnh khắc đẹp của tuổi học trò. Con đường quen thuộc, hàng cây rợp bóng, tiếng chim líu lo hòa vào tiếng cười nói. Những buổi sớm ấy, ai cũng mang trong mình sự háo hức, dù đôi mắt còn ngái ngủ. Có khi lén ăn sáng trong lớp, có khi tranh thủ ôn bài trước tiết kiểm tra. Mỗi buổi sáng là một bắt đầu mới, mang theo niềm hy vọng nhỏ bé của tuổi trẻ. Những ngày đi học tưởng như bình thường, nhưng rồi sau này, ta lại khao khát được quay về. Để một lần nữa đi giữa sân trường trong cái nắng dịu nhẹ, để thấy mình vẫn còn trẻ, vẫn còn mộng mơ."
        },
        {
            author: "Hoàng Phạm Duy Tân",
            content: "Giờ kiểm tra luôn là một “trận chiến” không thể thiếu trong thanh xuân cấp 3. Những ánh mắt lo âu, những cái liếc nhìn đáp án đầy hồi hộp, hay tiếng giấy sột soạt vang lên trong không khí im lặng căng thẳng. Có đứa làm xong trước, tự tin ra về; có đứa ngồi cắn bút đến phút cuối cùng. Nhưng rồi sau khi chuông reo, mọi lo lắng tan biến, thay vào đó là tiếng cười bàn tán: “Câu đó ra rồi! Tao sai rồi!”... Những buổi kiểm tra ấy giúp ta hiểu giá trị của sự chuẩn bị, của nỗ lực. Và trên hết, nó dạy ta bài học về việc chấp nhận kết quả - dù tốt hay xấu - với sự trưởng thành."
        },
        {
            author: "Trịnh Thị Kim Thanh",
            content: "Thanh xuân học trò là cả một bầu trời ước mơ. Có đứa muốn làm bác sĩ, có đứa mơ làm nhà văn, có đứa chỉ muốn học giỏi để cha mẹ vui lòng. Mỗi người một hướng đi, một khát vọng riêng. Dù ước mơ ấy sau này có thay đổi, thì chính thời cấp 3 đã khơi dậy cho ta tinh thần dám mơ ước, dám vượt qua bản thân. Ta từng ngồi vẽ sơ đồ tương lai, viết nhật ký đầy hy vọng, hay đơn giản là nhìn lên bảng điểm và hứa sẽ cố gắng hơn nữa. Thanh xuân không phải lúc nào cũng thành công, nhưng nó chính là nơi những ước mơ đầu tiên bắt đầu, và theo ta đến mãi về sau."
        },
        {
            author: "Bùi Phương Thảo",
            content: "Tuổi học trò có những “bí mật” nhỏ giấu trong ngăn bàn. Đó có thể là một lá thư chưa kịp gửi, một bức ảnh chụp cả lớp, hay đơn giản là mảnh giấy nhắn vội của người bạn ngồi cạnh. Những điều tưởng chừng bé xíu ấy lại chứa cả một vùng trời kỷ niệm. Ta từng lén lút đọc thư, giấu bài kiểm tra kém, hay bí mật trao nhau những dòng động viên trước kỳ thi. Những chiếc ngăn bàn cũ kỹ giờ đây đã bị thay thế, nhưng cảm xúc mà nó lưu giữ thì vẫn còn nguyên. Thanh xuân là thế - dung dị, vụn vặt, nhưng lại khiến ta mãi không thể quên."
        },
        {
            author: "Nguyễn Võ Hồng Thi",
            content: "Có một loại cảm xúc mang tên “chờ tan học” - đặc biệt chỉ có ở tuổi học trò. Đó là khi tiếng trống vang lên cuối buổi, cả lớp ào ra như ong vỡ tổ. Người thì vội vã về nhà, người nán lại nói chuyện, người rủ nhau ra quán trước cổng trường. Đôi khi chỉ là đứng đợi ai đó đi cùng một đoạn về. Tan học là lúc trường học ồn ào nhất, rộn ràng nhất và cũng ấm áp nhất. Nó không chỉ đánh dấu kết thúc một ngày học, mà còn mở ra những khoảnh khắc tự do, thân thương. Sau này, khi đi làm, ta sẽ chẳng còn được nghe tiếng trống ấy nữa - tiếng trống của tự do, của tuổi trẻ."
        },
        {
            author: "Lê Ngọc Quỳnh Thư",
            content: "Có những ngày đi học chỉ để gặp một người. Chẳng cần nói nhiều, chỉ cần thấy họ cười là đủ làm ta vui cả buổi. Cảm xúc đó, ngây ngô mà chân thành, là đặc sản của tuổi học trò. Chúng ta từng viết thư tay, từng lén nhìn từ phía sau lớp, từng đỏ mặt khi vô tình chạm tay nhau. Tình yêu tuổi học trò không ồn ào, không vội vàng, chỉ đơn giản là thích một người và mong người ấy luôn hạnh phúc. Dù chẳng đi đến đâu, dù sau này có quên tên nhau, nhưng thứ cảm xúc ấy sẽ luôn sống mãi trong tim - như đóa hoa đầu đời nở trong vườn ký ức."
        },
        {
            author: "Nguyễn Hà Minh Thư",
            content: "Cấp 3 là quãng thời gian ta học cách sống thật với chính mình. Không còn là những đứa trẻ ngây ngô như tiểu học, nhưng cũng chưa đủ bản lĩnh như người lớn. Ta bắt đầu có suy nghĩ riêng, có chính kiến và dám bảo vệ quan điểm của mình. Có lúc bồng bột, có lúc sai lầm, nhưng ta đã trưởng thành qua từng bài học, từng va vấp nhỏ. Những năm ấy, ta đã dần hiểu được thế nào là tự lập, là trách nhiệm, là ước mơ. Dù chặng đường ấy không dễ đi, nhưng chính nó đã làm nên con người ta hôm nay - mạnh mẽ, dũng cảm và biết trân trọng chính mình."
        },
        {
            author: "Nguyễn Thị Anh Thư",
            content: "Những ngày mưa đến lớp mang theo một nỗi buồn man mác. Tiếng mưa rơi trên mái tôn, bàn tay lạnh giá cầm bút viết vội. Có hôm ướt sũng áo mưa, vẫn cười đùa bên nhau dưới mái hiên trường. Mưa gắn với những lần trốn học, những chiều ngồi bó gối bên cửa sổ lớp nhìn trời xám xịt. Mưa khiến không khí lớp học trở nên lặng lẽ hơn, nhưng cũng khiến tâm hồn thêm sâu lắng. Tuổi học trò không chỉ có nắng vàng mà còn có những cơn mưa - dịu dàng, dai dẳng, và đầy cảm xúc như chính trái tim non trẻ đang lớn dần lên."
        },
        {
            author: "Nguyễn Song Bích Thy",
            content: "Buổi ngoại khóa là khoảnh khắc bứt khỏi nhịp học đều đặn để sống hết mình. Những chuyến dã ngoại, cắm trại, những đêm đốt lửa trại, chơi trò chơi lớn… đều trở thành hồi ức đáng nhớ. Có bạn lần đầu nấu ăn tập thể, lần đầu ngủ lều, lần đầu đứng hát giữa đám đông. Ngoại khóa không chỉ giúp ta thư giãn mà còn dạy ta làm việc nhóm, gắn kết với nhau hơn. Tiếng cười vang trong rừng, trong sân trường, trong những buổi chiều rộn ràng - chính là âm thanh của thanh xuân rực rỡ. Ai đã từng sống trọn trong những ngày ấy sẽ chẳng thể quên được."
        },
        {
            author: "Phạm Thanh Tuyết Thy",
            content: "Có một cảm giác khó tả vào những ngày mưa nơi sân trường. Cơn mưa bất chợt làm ướt đôi vai áo trắng, làm ta phải núp dưới mái hiên cùng lũ bạn, cùng cười khúc khích. Mưa khiến mọi thứ như chậm lại - bài giảng trở nên dịu hơn, tiếng giảng bài vang lên trong nền nhạc mưa rơi thật lạ. Có đứa lặng im ngắm mưa, có đứa lén vẽ lên kính cửa sổ những hình thù ngộ nghĩnh. Mưa học trò không lạnh, chỉ gợi nên chút gì đó bâng khuâng, man mác. Sau này, mỗi lần trời mưa, ta lại thấy lòng mình se lại - vì nhớ một thời áo trắng, nhớ những cơn mưa tuổi học trò."
        },
        {
            author: "Tạ Thủy Tiên",
            content: "Thanh xuân học trò cũng có những nỗi cô đơn thật đẹp. Đó là khi một mình ngồi ở hành lang, nghe bản nhạc yêu thích, hay ngắm hoàng hôn phủ vàng sân trường. Là cảm giác ngẩn ngơ khi bạn thân có nhóm chơi riêng, hay khi người mình thích chẳng để ý đến mình. Nhưng chính những khoảnh khắc cô đơn ấy lại giúp ta hiểu mình hơn, học cách mạnh mẽ, học cách yêu thương bản thân. Tuổi học trò đâu chỉ có tiếng cười, mà còn có nước mắt, có nỗi buồn - và nhờ vậy, nó mới thật, mới quý giá, mới làm nên một thanh xuân trọn vẹn."
        },
        {
            author: "Đỗ Văn Đức Tình",
            content: "Có một điều khiến người ta day dứt mãi - đó là những lời chưa kịp nói trong năm cuối cấp. Là lời xin lỗi vì một lần vô tâm, là lời cảm ơn chưa dám thốt ra, hay lời tỏ tình còn dang dở. Cấp 3 kết thúc quá nhanh, khiến ta chưa kịp làm hết những điều mình muốn. Rồi mỗi lần nhìn lại, lại tiếc nuối: “Giá như ngày ấy mình dũng cảm hơn.” Nhưng chính sự dang dở ấy lại làm thanh xuân trở nên trọn vẹn - bởi nếu điều gì cũng hoàn hảo, ta sẽ không có gì để khắc khoải, để nhớ nhung. Tuổi học trò là vậy - dẫu có bỏ lỡ, vẫn là ký ức đẹp nhất đời."
        },
        {
            author: "Lê Ngọc Yến Trang",
            content: "Hành lang trường học là nơi chứa đầy tiếng bước chân thanh xuân. Đó là nơi ta chạy vội đến lớp khi trễ giờ, nơi đứng nói chuyện cùng bạn mỗi giờ ra chơi, nơi thầm nhìn ai đó đi ngang qua. Những bức tường trắng, những ô cửa sổ đầy nắng - tất cả đều là nhân chứng cho những năm tháng vô tư. Mỗi bước chân nơi hành lang ấy là một bước lớn lên, một chút trưởng thành. Đến khi xa rồi, ta sẽ nhớ tiếng giày vang lên trong buổi sáng vội vàng, nhớ những ánh mắt ngại ngùng trao nhau, nhớ cả khoảng không yên tĩnh mỗi khi tan trường. Một không gian giản dị, nhưng lại chứa cả bầu trời ký ức."
        },
        {
            author: "Nguyễn Ngọc Quỳnh Trâm",
            content: "Kỳ nghỉ hè cấp 3 không giống bất kỳ kỳ nghỉ nào khác. Đó là khoảng thời gian chuyển giao giữa sự hồn nhiên và trưởng thành. Có người tranh thủ học thêm, luyện thi; có người dành trọn cho những chuyến đi xa, những phút thư giãn bên gia đình. Hè là lúc ta tạm xa bạn bè, xa lớp học để nhìn lại một năm đã qua. Nhưng cũng là lúc nỗi nhớ thầy cô, bạn bè len lỏi vào từng khoảnh khắc. Kỳ nghỉ ấy chẳng dài, nhưng đủ để tiếp thêm năng lượng cho năm học mới. Và với học sinh cuối cấp, đó là mùa hè cuối cùng bên mái trường - mùa hè đầy tiếc nuối, nhưng cũng đầy hứa hẹn."
        },
        {
            author: "Lâm Huyền Trân",
            content: "Có một góc nhỏ trong trường mà ai cũng có kỷ niệm riêng - có thể là bồn cây, bậc cầu thang hay góc thư viện vắng. Nơi đó từng chứng kiến ta ngồi ôn bài, lặng lẽ khóc vì điểm kém, hay thì thầm những câu chuyện không dám nói lớn. Chúng ta không nhận ra mình đã gắn bó với những nơi ấy nhiều đến thế cho đến khi phải rời đi. Cái ghế cũ, cái quạt kêu to, cái cửa sổ gỉ sét… tất cả tưởng chừng vô tri lại trở nên đáng nhớ lạ thường. Bởi nơi chốn nào từng gắn với thanh xuân - nơi ấy đều trở thành một phần ký ức không thể phai."
        },
        {
            author: "Nguyễn Quang Tú",
            content: "Có một thứ không thể thiếu trong đời học trò: nhật ký. Đó là nơi ta giấu những tâm sự không dám nói ra, những nỗi buồn thầm lặng, hay cả những niềm vui nhỏ nhoi. Những trang giấy ố vàng, nét chữ xiêu vẹo ấy từng là người bạn thân thiết. Mỗi dòng chữ đều là một phần của tâm hồn non trẻ đang lớn lên từng ngày. Có thể sau này đọc lại, ta sẽ bật cười vì sự ngây ngô của mình. Nhưng cũng sẽ thấy tự hào vì bản thân đã sống trọn vẹn. Nhật ký - không cần ai đọc, chỉ cần ta đã từng viết - đã từng cảm, đã từng là chính mình."
        },
        {
            author: "Nguyễn Quang Tuấn",
            content: "Sân trường sau giờ tan học luôn mang một vẻ đẹp rất riêng. Khi tiếng trống đã dứt, lớp học thưa dần, chỉ còn lại ánh nắng cuối ngày đổ dài trên lối đi. Những bước chân vội vã, những cuộc hẹn hò nho nhỏ, những chiếc xe đạp đợi nhau… tạo nên bức tranh nhẹ nhàng mà cảm động. Có hôm trời mưa, ta nán lại trú dưới mái hiên, nhìn giọt nước rơi xuống từng giọt. Có hôm ngồi lại lâu hơn chỉ để nói thêm đôi ba câu với người mình quý. Những buổi chiều ấy, lặng lẽ mà đong đầy - là điểm dừng ấm áp trước khi mỗi người trở về thế giới riêng."
        },
        {
            author: "Nguyễn Thùy Minh Tuệ",
            content: "Ngày lễ tốt nghiệp là cột mốc thiêng liêng của học trò cấp 3. Trong tà áo dài trắng tinh khôi, từng ánh mắt, nụ cười, cái ôm đều mang theo sự xúc động khó tả. Ta nhìn lại chặng đường đã đi qua, cảm ơn thầy cô, bạn bè, và cả chính mình vì đã cố gắng. Những chiếc mũ được tung lên trời như lời hứa: chúng ta sẽ bay cao, bay xa, dù có đi đâu cũng không quên nơi mình bắt đầu. Sau lễ tốt nghiệp, ai cũng lớn thêm một chút - đủ để rời đi, nhưng cũng đủ để nhớ mãi. Thanh xuân khép lại bằng giây phút đó - đẹp, rực rỡ và đầy tự hào."
        },
        {
            author: "Nguyễn Văn Tùng",
            content: "Thanh xuân học trò có những điều nhỏ xíu mà rất đáng yêu. Là cái kẹo bạn để trong hộc bàn khi thấy ta buồn. Là bức hình lớp chụp dở khóc dở cười ai cũng nhắm mắt. Là tiếng gọi “Ê đi ăn căng-tin không?” vang lên mỗi giờ ra chơi. Những điều tưởng như vụn vặt ấy, khi cộng lại, lại trở thành ký ức ấm áp nhất. Bởi chính những điều nhỏ bé ấy làm nên sự đặc biệt của thời cấp 3 - một quãng đời không cần hoàn hảo, chỉ cần đủ chân thành. Để sau này, mỗi khi nhớ lại, ta lại mỉm cười: Hồi ấy mình đã từng vui như thế."
        },
        {
            author: "Trần Chí Tùng",
            content: "Chiếc bàn học từng là “chiến hữu” suốt những năm tháng cấp 3. Trên đó là sách vở, giấy kiểm tra, bảng điểm, và cả những dòng chữ khắc tên ai đó thật nhỏ. Bàn có thể tróc sơn, in dấu mực lem, nhưng lại lưu giữ bao kỷ niệm. Là nơi ta đặt bút viết bài thi quan trọng, là nơi ta gục đầu ngủ trưa, là nơi ta khắc tuổi tên khi trái tim bắt đầu biết rung động. Sau này, chiếc bàn ấy sẽ được thay bằng bàn làm việc, bàn họp… nhưng chẳng cái nào thay thế được cảm giác thân quen của bàn học ngày xưa - nơi thanh xuân đã từng ngồi lại."
        },
        {
            author: "Trần Lê Khánh Vân",
            content: "Tiếng trống trường là âm thanh đặc biệt của tuổi học trò. Mỗi tiếng trống vang lên không chỉ báo hiệu bắt đầu hay kết thúc tiết học, mà còn là nhịp tim của cả một thời thanh xuân. Ta từng hồi hộp chờ tiếng trống để thoát khỏi tiết kiểm tra, từng mong mãi chưa vang lên để được ở lại bên người thương thêm chút nữa. Tiếng trống ấy tưởng đơn giản, nhưng lại theo ta mãi về sau, trở thành âm thanh hoài niệm gợi nhớ bao khoảnh khắc cũ. Một ngày nào đó, giữa phố xá đông người, ta bỗng nghe một tiếng trống ngân, và bỗng thấy lòng mình xuyến xao lạ kỳ."
        },
        {
            author: "Trần Thị Hải Vy",
            content: "Buổi học cuối cùng luôn mang cảm giác kỳ lạ: vừa nhẹ nhõm, vừa lưu luyến. Cả lớp như nhận ra thời gian không còn nhiều, ai cũng cố gắng giữ cho nhau những điều đẹp nhất. Có tiếng cười vang, nhưng mắt ai cũng rưng rưng. Thầy cô giảng bài chậm hơn, dặn dò nhiều hơn. Những trang vở cuối khép lại mang theo bao cảm xúc đan xen. Đó không chỉ là tiết học, mà là lần cuối cùng được là học sinh của nhau. Sau này mỗi người một nơi, nhưng buổi học cuối ấy - với ánh nắng, tiếng ve, ánh mắt bùi ngùi - sẽ là ký ức đẹp nhất đời."
        },
        {
            author: "Phạm Hải Yến",
            content: "Có một kiểu bạn học đáng nhớ trong đời: đó là người luôn làm trò, chọc cười cả lớp. Họ khiến những tiết học khô khan trở nên rộn ràng, khiến cả lớp đoàn kết qua những tràng cười không dứt. Đôi khi cũng vì nghịch quá mà bị thầy cô la, nhưng rồi chẳng ai trách họ được lâu. Những người bạn “tấu hài học đường” ấy mang đến một phần màu sắc rất riêng cho thanh xuân ta - một phần khiến ta nhớ mãi, vì đã giúp quãng đời học sinh thêm trọn vẹn, vui vẻ và bớt áp lực. Không có họ, cấp 3 sẽ buồn biết mấy."
        }
    ];

    const messagesGrid = document.getElementById('messages-grid');
    if (!messagesGrid) return;

    messagesGrid.innerHTML = messagesData.map((message, index) => `
      <div class="message-card" onclick="showMessage('${message.author}', \`${message.content.replace(/`/g, '\\`').replace(/"/g, '\\"')}\`)" style="animation-delay: ${index * 0.1}s">
        <div class="message-author">${message.author}</div>
        <div class="message-preview">${message.content}</div>
      </div>
    `).join('');
  }

  showMemberDetail(name, avatar, age, birthday, strengths, weaknesses) {
    console.log('Showing member detail:', name);
    const modal = document.getElementById('memberModal');
    const modalName = document.getElementById('modalName');
    const modalAvatar = document.getElementById('modalAvatar');
    const modalAge = document.getElementById('modalAge');
    const modalDob = document.getElementById('modalDob');
    const modalStrength = document.getElementById('modalStrength');
    const modalWeakness = document.getElementById('modalWeakness');

    if (modal && modalName && modalAvatar) {
      modalName.textContent = name;
      modalAvatar.src = avatar;
      modalAvatar.alt = name;
      
      if (modalAge) modalAge.textContent = `Tuổi: ${age}`;
      if (modalDob) modalDob.textContent = `Ngày sinh: ${birthday}`;
      if (modalStrength) modalStrength.textContent = `Ưu điểm: ${strengths}`;
      if (modalWeakness) modalWeakness.textContent = `Nhược điểm: ${weaknesses}`;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  showVideo(src, title, description) {
    console.log('Showing video:', title);
    const modal = document.getElementById('video-modal');
    const videoSource = document.getElementById('video-modal-source');
    const videoPlayer = document.getElementById('video-modal-player');
    const videoTitle = document.getElementById('video-modal-title');
    const videoDescription = document.getElementById('video-modal-description');

    if (modal && videoSource && videoPlayer) {
      videoSource.src = src;
      videoPlayer.load();
      
      if (videoTitle) videoTitle.textContent = title;
      if (videoDescription) videoDescription.textContent = description;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Pause background music when video plays
      if (this.audio && this.isMusicPlaying) {
        this.audio.pause();
      }

      // Auto-play video
      setTimeout(() => {
        videoPlayer.play().catch(console.error);
      }, 300);
    }
  }

  showImage(src, title, description) {
    console.log('Showing image:', title);
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('image-modal-img');
    const modalTitle = document.getElementById('image-modal-title');
    const modalDescription = document.getElementById('image-modal-description');

    if (modal && modalImg) {
      modalImg.src = src;
      modalImg.alt = title;
      
      if (modalTitle) modalTitle.textContent = title;
      if (modalDescription) modalDescription.textContent = description;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  showMessage(author, content) {
    console.log('Showing message from:', author);
    const modal = document.getElementById('message-modal');
    const modalName = document.getElementById('modal-name');
    const modalMessage = document.getElementById('modal-message');

    if (modal && modalName && modalMessage) {
      modalName.textContent = author;
      modalMessage.textContent = content;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeMemberModal() {
    this.closeModal('memberModal');
  }

  closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('video-modal-player');

    if (videoPlayer) {
      videoPlayer.pause();
      videoPlayer.currentTime = 0;
    }

    this.closeModal('video-modal');

    // Resume background music
    if (this.audio && this.isMusicPlaying) {
      this.audio.play().catch(console.error);
    }
  }

  closeImageModal() {
    this.closeModal('image-modal');
  }

  closeMessageModal() {
    this.closeModal('message-modal');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';

    // Stop any playing videos
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.pause();
      video.currentTime = 0;
    });
  }

  toggleMusic() {
    console.log('Toggling music...');
    if (!this.audio) {
      this.showNotification('Không tìm thấy file nhạc', 'error');
      return;
    }

    if (this.isMusicPlaying) {
      this.audio.pause();
      this.isMusicPlaying = false;
      this.showNotification('Đã tắt nhạc nền', 'info');
      console.log('Music paused');
    } else {
      this.audio.play().then(() => {
        this.isMusicPlaying = true;
        this.showNotification('Đã bật nhạc nền', 'success');
        console.log('Music playing');
      }).catch(error => {
        console.error('Audio play failed:', error);
        this.showNotification('Không thể phát nhạc', 'error');
      });
    }
  }

  showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.add('show');
    }
  }

  hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.remove('show');
    }
  }

  showNotification(message, type = 'info') {
    console.log('Notification:', message, type);
    
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Hide and remove notification
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }

  handleResize() {
    // Handle any resize-specific logic
    console.log('Window resized');
  }

  // Utility methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Global functions for backward compatibility
window.toggleMusic = () => {
  if (window.app) {
    window.app.toggleMusic();
  }
};

window.showMemberDetail = (name, avatar, age, birthday, strengths, weaknesses) => {
  if (window.app) {
    window.app.showMemberDetail(name, avatar, age, birthday, strengths, weaknesses);
  }
};

window.showVideo = (src, title, description) => {
  if (window.app) {
    window.app.showVideo(src, title, description);
  }
};

window.showImage = (src, title, description) => {
  if (window.app) {
    window.app.showImage(src, title, description);
  }
};

window.showMessage = (author, content) => {
  if (window.app) {
    window.app.showMessage(author, content);
  }
};

window.closeMemberModal = () => {
  if (window.app) {
    window.app.closeMemberModal();
  }
};

window.closeVideoModal = () => {
  if (window.app) {
    window.app.closeVideoModal();
  }
};

window.closeImageModal = () => {
  if (window.app) {
    window.app.closeImageModal();
  }
};

window.closeMessageModal = () => {
  if (window.app) {
    window.app.closeMessageModal();
  }
};

window.showNotification = (message, type = 'info') => {
  if (window.app) {
    window.app.showNotification(message, type);
  }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing app...');
  window.app = new MemoryWebsite();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (window.app && window.app.audio) {
    if (document.hidden && window.app.isMusicPlaying) {
      window.app.audio.pause();
    } else if (!document.hidden && window.app.isMusicPlaying) {
      window.app.audio.play().catch(console.error);
    }
  }
});

// Service Worker for better performance (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // navigator.serviceWorker.register('/sw.js')
    //   .then((registration) => {
    //     console.log('SW registered: ', registration);
    //   })
    //   .catch((registrationError) => {
    //     console.log('SW registration failed: ', registrationError);
    //   });
  });
}

// Error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  if (window.app) {
    window.app.showNotification('Đã xảy ra lỗi, vui lòng thử lại', 'error');
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  if (window.app) {
    window.app.showNotification('Đã xảy ra lỗi mạng', 'error');
  }
});

console.log('Script loaded successfully');
