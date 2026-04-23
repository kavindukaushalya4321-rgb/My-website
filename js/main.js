/* ===========================
   MAIN JAVASCRIPT
   Deepan Portfolio Website
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 0. PAGE LOADER & REVEAL ── */
  window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    const revealContent = document.querySelector('.reveal-content');
    
    // Smoothly hide loader
    setTimeout(() => {
      if (loader) loader.classList.add('loader-hidden');
      if (revealContent) revealContent.classList.add('reveal-visible');
    }, 1000); // Small delay to appreciate the loader
  });


    /* ── 1. ANIMATED BACKGROUND ── */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const isTechTheme = document.body.classList.contains('tech-theme');
    const isProfTheme = document.body.classList.contains('professional-theme');
    let particles = [];
    let streams = [];
    let orbs = [];
    let animFrame;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let mouse = { x: null, y: null, radius: 200 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    // Particle logic (Classic Theme)
    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.color = Math.random() > 0.5 ? '139, 92, 246' : '6, 182, 212';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (mouse.x != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / distance) * force * 2;
            this.y -= (dy / distance) * force * 2;
          }
        }
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, 0.8)`;
        ctx.fill();
      }
    }

    // Data Stream logic (Tech Theme)
    class DataStream {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = Math.random() * 2 + 1;
        this.length = Math.random() * 100 + 50;
        this.opacity = Math.random() * 0.3 + 0.1;
      }
      update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
          this.y = -this.length;
          this.x = Math.random() * canvas.width;
        }
      }
      draw() {
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(0, this.y, 0, this.y + this.length);
        gradient.addColorStop(0, `rgba(6, 182, 212, 0)`);
        gradient.addColorStop(1, `rgba(6, 182, 212, ${this.opacity})`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
      }
    }

    // Professional Orb logic (Professional Theme)
    class ProfessionalOrb {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 150 + 50;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.color = Math.random() > 0.5 ? '59, 130, 246' : '16, 185, 129';
        this.opacity = Math.random() * 0.05 + 0.02;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
      }
      draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(${this.color}, 0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    const isMobile = window.innerWidth < 768;
    if (isTechTheme) {
      const streamCount = isMobile ? 30 : 60;
      for (let i = 0; i < streamCount; i++) streams.push(new DataStream());
    } else if (isProfTheme) {
      const orbCount = isMobile ? 5 : 12;
      for (let i = 0; i < orbCount; i++) orbs.push(new ProfessionalOrb());
    } else {
      const particleCount = isMobile ? 30 : 80;
      for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (isTechTheme) {
        streams.forEach(s => { s.update(); s.draw(); });
      } else if (isProfTheme) {
        orbs.forEach(o => { o.update(); o.draw(); });
      } else {
        const connectionDist = isMobile ? 80 : 150;
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectionDist) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(${particles[i].color}, ${(1 - dist/connectionDist) * 0.25})`;
              ctx.lineWidth = 0.8;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }


  /* ── 2. NAVBAR SCROLL EFFECT ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  /* ── 3. 3D TILT EFFECT ── */
  const tiltElements = document.querySelectorAll('.profile-img, .project-card, .social-icon-btn');
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  /* ── 5. LANGUAGE TRANSLATION LOGIC ── */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  menuToggle?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });

  /* ── 4. ROLE TEXT ANIMATION (Slide & Blur) ── */
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const roles = ['Developer', 'Problem Solver', 'Creative Thinker'];
    let roleIdx = 0;

    function updateRole() {
      // Phase 1: Slide Out
      typedEl.classList.remove('word-slide-up');
      typedEl.classList.add('word-slide-out');
      
      setTimeout(() => {
        // Phase 2: Change Content & Slide In
        roleIdx = (roleIdx + 1) % roles.length;
        typedEl.textContent = roles[roleIdx];
        typedEl.classList.remove('word-slide-out');
        typedEl.classList.add('word-slide-up');
      }, 600); // Matches CSS duration
    }

    // Initial set
    typedEl.textContent = roles[0];
    typedEl.classList.add('word-slide-up');
    
    // Interval for switching
    setInterval(updateRole, 3500); 
  }

  /* ── 5. SCROLL REVEAL (AOS-like) ── */
  function revealOnScroll() {
    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.classList.add('aos-animate');
      }
    });
  }
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  /* ── 6. COUNTER ANIMATION ── */
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight && !counter.classList.contains('counted')) {
        counter.classList.add('counted');
        let count = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            counter.textContent = target + '+';
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(count);
          }
        }, 25);
      }
    });
  }
  window.addEventListener('scroll', animateCounters);
  animateCounters();

  /* ── 7. SKILL BAR ANIMATION ── */
  function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    bars.forEach(bar => {
      const rect = bar.getBoundingClientRect();
      if (rect.top < window.innerHeight && !bar.classList.contains('animated')) {
        bar.classList.add('animated');
        const width = bar.getAttribute('data-width');
        setTimeout(() => { bar.style.width = width + '%'; }, 200);
      }
    });
  }
  window.addEventListener('scroll', animateSkillBars);
  animateSkillBars();

  /* ── 8. PROJECT FILTER ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-full-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active-filter'));
      btn.classList.add('active-filter');
      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ── 9. CONTACT FORM ── */
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const successMsg = document.getElementById('form-success');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    submitBtn.style.opacity = '0.7';

    const formData = {
      firstName: document.getElementById('first-name').value,
      lastName: document.getElementById('last-name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };

    try {
      const response = await fetch('http://localhost:8000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        form.style.display = 'none';
        successMsg?.classList.remove('hidden');
      } else {
        alert('Something went wrong. Please try again.');
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
        submitBtn.style.opacity = '1';
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Could not connect to the server. Is the backend running?');
      submitBtn.disabled = false;
      btnText.textContent = 'Send Message';
      submitBtn.style.opacity = '1';
    }
  });

  /* ── 10. SMOOTH SCROLL FOR ANCHOR LINKS ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 11. DOWNLOAD CV BUTTON ── */
  const cvBtn = document.getElementById('download-cv-btn');
  cvBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    // Alert since no actual CV file
    const btn = e.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check mr-2"></i>CV Coming Soon!';
    btn.style.borderColor = '#10B981';
    btn.style.color = '#10B981';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 2000);
  });

  /* ── 12. CURSOR GLOW EFFECT ── */
  const cursorGlow = document.createElement('div');
  cursorGlow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
    transform: translate(-50%, -50%);
    transition: all 0.15s ease;
  `;
  document.body.appendChild(cursorGlow);
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });

  /* ── 13. LANGUAGE TRANSLATION ── */
  const translations = {
    en: {
      'nav-home': 'Home',
      'nav-about': 'About',
      'nav-projects': 'Projects',
      'nav-contact': 'Contact',
      'hire-me': 'Hire Me',
      'hero-tag': 'Welcome to my Digital World',
      'hero-title': "I'm <span class=\"gradient-text\">Kavindu</span>,<br/> a Modern Creator.",
      'hero-desc': 'A passionate developer and creative thinker from <strong class=\"text-white\">Pimbura, Agalawatta</strong>. I specialize in crafting high-end digital experiences that blend code with art.',
      'btn-projects': 'Explore Projects',
      'btn-talk': "Let's Talk",
      'about-title': 'About <span class="text-prof-primary">Walakada Appuhamilage Kavindu Kaushalya</span>',
      'about-tag': 'Professional Profile',
      'about-story-tag': 'My Story',
      'about-story-p1': "My name is <strong class=\"text-white\">Kavindu</strong>. With a strong analytical foundation in Physical Science and a passion for modern web technologies, I specialize in building responsive, user-centric applications. Back in 2023, I served as the Technical Head of the Media Unit at <strong class=\"text-primary\">Ananda Sastralaya, Matugama</strong>.",
      'about-story-p2': "Besides that, I also do live streaming and create video content. I love combining my technical skills with creative storytelling to build engaging digital experiences.",
      'info-name': 'Full Name',
      'info-role': 'Current Role',
      'info-role-val': 'Back End Admin @ Peoples backers (Blue Lotus)',
      'info-location': 'Location',
      'info-degree': 'Degree',
      'info-degree-val': 'Pending',
      'info-status': 'Status',
      'info-available': 'Available for Work',
      'info-languages': 'Linguistic Proficiency',
      'info-languages-val': 'English, Sinhala',
      'projects-title': 'My <span class="gradient-text">Projects</span>',
      'projects-tag': "What I've Built",
      'projects-desc': 'My recent work',
      'projects-hero-desc': 'A showcase of my creative work and technical projects.',
      'btn-view-all': 'View All Projects',
      'cta-tag': "Let's Work Together",
      'cta-title': 'Ready to Build Something <span class="gradient-text">Amazing?</span>',
      'cta-desc': "I'm always open to new opportunities and exciting projects. Let's create something extraordinary together.",
      'btn-start': 'Start a Project',
      'contact-title': "Let's <span class=\"gradient-text\">Connect</span>",
      'contact-tag': 'Say Hello',
      'contact-hero-desc': "Have a project in mind? Let's talk about it. I'm always open to new opportunities.",
      'contact-touch': 'Get In <span class="gradient-text">Touch</span>',
      'contact-p': "I'm currently available for freelance work and full-time positions. Whether you have a question, a project, or just want to say hi — my inbox is always open!",
      'contact-social': 'Follow Me On',
      'contact-msg-title': 'Send a <span class="gradient-text">Message</span>',
      'label-fname': 'First Name',
      'label-lname': 'Last Name',
      'label-email': 'Email Address',
      'label-subject': 'Subject',
      'label-msg': 'Your Message',
      'btn-send': 'Send Message',
      'form-success': 'Message sent successfully!',
      'form-note': "I'll get back to you within 24 hours.",
      'loc-title': 'Based in Sri Lanka',
      'loc-desc': 'Pimbura, Agalawatta · Open to Remote Work Worldwide',
      'loc-avail': 'Available for Projects',
      'about-hero-desc': 'The story behind the code — passion, creativity, and a relentless drive to build.',
      'about-story-title': 'Passionate Developer &<br/><span class="gradient-text">Creative Problem Solver</span>',
      'info-based': 'Based in',
      'info-phone': 'Call Me',
      'info-whatsapp': 'WhatsApp',
      'btn-contact-me': 'Contact Me',
      'btn-cv': 'Download CV',
      'timeline-tag': 'Career Milestones',
      'timeline-title': 'Education & <span class="text-prof-primary">Experience</span>',
      'timeline-edu': 'Education',
      'timeline-media': 'Leadership & Media',
      'hobby-tag': 'Beyond Code',
      'hobby-title': 'Interests & <span class="gradient-text">Hobbies</span>',
      'hobby-gaming-name': 'Gaming',
      'hobby-gaming-desc': 'Passionate gamer who loves strategy and RPG games',
      'hobby-photo-name': 'Photography',
      'hobby-photo-desc': "Capturing Sri Lanka's beautiful landscapes and culture",
      'hobby-music-name': 'Music',
      'hobby-music-desc': 'Music lover who enjoys both classical and modern beats',
      'hobby-travel-name': 'Travel',
      'hobby-travel-desc': 'Exploring hidden gems across the beautiful Sri Lanka',
      'filter-all': 'All Projects',
      'filter-web': 'Web Apps',
      'filter-mobile': 'Mobile',
      'filter-design': 'Design',
      'filter-ai': 'AI / ML',
      'footer-rights': 'All rights reserved.',
      'footer-made': 'Made with ❤️ in Pimbura, Agalawatta'
    },
    si: {
      'nav-home': 'මුල් පිටුව',
      'nav-about': 'මා ගැන',
      'nav-projects': 'නිර්මාණ',
      'nav-contact': 'සම්බන්ධ වන්න',
      'hire-me': 'සේවය ලබාගන්න',
      'hero-tag': 'මගේ ඩිජිටල් ලොවට සාදරයෙන් පිළිගනිමි',
      'hero-title': "මම <span class=\"gradient-text\">කවිඳු</span>,<br/> නවීන නිර්මාණකරුවෙක්.",
      'hero-desc': '<strong class=\"text-white\">පිඹුර, අගලවත්ත</strong> ප්‍රදේශයේ වෙසෙන උද්‍යෝගිමත් සංවර්ධකයෙක් සහ නිර්මාණශීලී චින්තකයෙක්. මම කේතකරණය සහ කලාව මුසු කරමින් උසස් ඩිජිටල් අත්දැකීම් නිර්මාණය කිරීමට ප්‍රවීණයෙකි.',
      'btn-projects': 'නිර්මාණ බලන්න',
      'btn-talk': "කතා කරමු",
      'about-title': 'මා ගැන - <span class="text-prof-primary">වලකඩ අප්පුහාමිලාගේ කවිඳු කෞශල්‍ය</span>',
      'about-tag': 'වෘත්තීය පැතිකඩ',
      'about-story-tag': 'මගේ කතාව',
      'about-story-title': 'උද්‍යෝගිමත් සංවර්ධකයෙක් සහ<br/><span class="gradient-text">නිර්මාණශීලී චින්තකයෙක්</span>',
      'about-story-p1': "මගේ නම <strong class=\"text-white\">කවිඳු</strong>. භෞතික විද්‍යාව (Physical Science) පිළිබඳ ශක්තිමත් විශ්ලේෂණාත්මක පදනමක් සහ නවීන වෙබ් තාක්ෂණයන් පිළිබඳ දැඩි උනන්දුවක් ඇතිව, මම පරිශීලක-කේන්ද්‍රීය වෙබ් යෙදුම් නිර්මාණය කිරීමට ප්‍රවීණයෙකි. 2023 වසරේදී මම මතුගම <strong class=\"ආනන්ද ශාස්ත්‍රාලයේ\">ආනන්ද ශාස්ත්‍රාලයේ</strong> මාධ්‍ය ඒකකයේ තාක්ෂණික ප්‍රධානියා ලෙස කටයුතු කළෙමි.",
      'about-story-p2': "ඊට අමතරව, මම සජීවී විකාශනය (live streaming) සහ වීඩියෝ අන්තර්ගතයන් නිර්මාණය කරමි. ආකර්ශනීය ඩිජිටල් අත්දැකීම් ගොඩනැගීම සඳහා මගේ තාක්ෂණික කුසලතා නිර්මාණාත්මක කතන්දර සමඟ සම්බන්ධ කිරීමට මම ප්‍රිය කරමි.",
      'about-hero-desc': 'කේතයන් පිටුපස ඇති කතාව — උද්‍යෝගය, නිර්මාණශීලිත්වය සහ නිර්මාණය කිරීමට ඇති කැපවීම.',
      'info-name': 'සම්පූර්ණ නම',
      'info-role': 'වත්මන් තනතුර',
      'info-role-val': 'Peoples backers (Blue Lotus) හි Back End Admin',
      'info-location': 'ප්‍රදේශය',
      'info-location-val': 'පිඹුර, අගලවත්ත',
      'info-based': 'පදිංචිය',
      'info-email': 'ඊමේල්',
      'info-phone': 'දුරකථන',
      'info-whatsapp': 'වට්සැප්',
      'info-degree': 'උපාධිය',
      'info-degree-val': 'පොරොත්තු (Pending)',
      'info-status': 'තත්ත්වය',
      'info-available': 'වැඩ සඳහා සූදානම්',
      'info-languages': 'භාෂා',
      'info-languages-val': 'සිංහල, ඉංග්‍රීසි',
      'btn-contact-me': 'සම්බන්ධ වන්න',
      'btn-cv': 'CV එක බාගන්න',
      'timeline-tag': 'වෘත්තීය ගමන් මග',
      'timeline-title': 'අධ්‍යාපනය සහ <span class="text-prof-primary">අත්දැකීම්</span>',
      'timeline-edu': 'අධ්‍යාපනය',
      'timeline-media': 'නායකත්වය සහ මාධ්‍ය',
      'hobby-tag': 'කේතකරණයෙන් ඔබ්බට',
      'hobby-title': 'උනන්දුව සහ <span class="gradient-text">විනෝදාංශ</span>',
      'hobby-gaming-name': 'ගේමින්',
      'hobby-gaming-desc': 'උපාය මාර්ගික සහ RPG ක්‍රීඩා වලට ප්‍රිය කරන උද්‍යෝගිමත් ක්‍රීඩකයෙක්',
      'hobby-photo-name': 'ඡායාරූපකරණය',
      'hobby-photo-desc': 'ශ්‍රී ලංකාවේ සුන්දර භූ දර්ශන සහ සංස්කෘතිය කැමරාවට නැගීම',
      'hobby-music-name': 'සංගීතය',
      'hobby-music-desc': 'සම්භාව්‍ය සහ නවීන සංගීතයට ප්‍රිය කරන්නෙක්',
      'hobby-travel-name': 'සංචාරය',
      'hobby-travel-desc': 'ශ්‍රී ලංකාව පුරා සැඟවුණු සුන්දර ස්ථාන ගවේෂණය කිරීම',
      'projects-title': 'මගේ <span class="gradient-text">නිර්මාණ</span>',
      'projects-tag': 'මා කළ නිර්මාණ',
      'projects-desc': 'මගේ මෑතකාලීන නිර්මාණ කිහිපයක්',
      'projects-hero-desc': 'මගේ නිර්මාණාත්මක වැඩ සහ තාක්ෂණික ව්‍යාපෘති පිළිබඳ ප්‍රදර්ශනයක්.',
      'filter-all': 'සියලුම නිර්මාණ',
      'filter-web': 'වෙබ් ඇප්ස්',
      'filter-mobile': 'මොබයිල්',
      'filter-design': 'නිර්මාණකරණය',
      'filter-ai': 'කෘතිම බුද්ධිය',
      'btn-view-all': 'සියලුම නිර්මාණ බලන්න',
      'cta-tag': 'එකට වැඩ කරමු',
      'cta-title': 'අපි අලුත් දෙයක් <span class="gradient-text">නිර්මාණය කරමුද?</span>',
      'cta-desc': 'මම සැමවිටම නව අවස්ථා සහ ආකර්ෂණීය ව්‍යාපෘති සඳහා විවෘතව සිටිමි. අපි එක්ව අසාමාන්‍ය දෙයක් නිර්මාණය කරමු.',
      'btn-start': 'වැඩක් පටන් ගනිමු',
      'contact-title': "<span class=\"gradient-text\">සම්බන්ධ</span> වෙමු",
      'contact-tag': 'හායි කියන්න',
      'contact-hero-desc': 'ඔබේ හිතේ ව්‍යාපෘතියක් තියෙනවාද? ඒ ගැන කතා කරමු. මම සැමවිටම නව අවස්ථා සඳහා විවෘතව සිටිමි.',
      'contact-touch': 'සම්බන්ධ <span class="gradient-text">වන්න</span>',
      'contact-p': 'මම දැනට නිදහස් සේවය (freelance) සහ පූර්ණ කාලීන රැකියා සඳහා සූදානමින් සිටිමි. ඔබට ප්‍රශ්නයක්, ව්‍යාපෘතියක් ඇත්නම් හෝ හායි කීමට අවශ්‍ය නම් — ඕනෑම වෙලාවක පණිවිඩයක් එවන්න!',
      'contact-social': 'මාව අනුගමනය කරන්න',
      'contact-msg-title': 'පණිවිඩයක් <span class="gradient-text">එවන්න</span>',
      'label-fname': 'මුල් නම',
      'label-lname': 'වාසගම',
      'label-email': 'ඊමේල් ලිපිනය',
      'label-subject': 'විෂය',
      'label-msg': 'ඔබේ පණිවිඩය',
      'btn-send': 'පණිවිඩය එවන්න',
      'form-success': 'පණිවිඩය සාර්ථකව යවන ලදී!',
      'form-note': 'පැය 24ක් ඇතුළත මම ඔබව සම්බන්ධ කර ගන්නෙමි.',
      'loc-title': 'ශ්‍රී ලංකාවේ සිට',
      'loc-desc': 'පිඹුර, අගලවත්ත · ලොව පුරා ඕනෑම තැනක සිට වැඩ කිරීමට සූදානම්',
      'loc-avail': 'ව්‍යාපෘති සඳහා සූදානම්',
      'footer-rights': 'සියලුම හිමිකම් ඇවිරිණි.',
      'footer-made': '❤️ සමඟ පිඹුර, අගලවත්ත හිදී නිර්මාණය කරන ලදී'
    }
  };

  let currentLang = localStorage.getItem('portfolio-lang') || 'en';

  function updateLanguage() {
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      if (translations[currentLang][key]) {
        el.innerHTML = translations[currentLang][key];
      }
    });
  }

  const langBtn = document.getElementById('lang-toggle');
  const mobileLangBtn = document.getElementById('mobile-lang-toggle');

  function toggleLang() {
    currentLang = currentLang === 'en' ? 'si' : 'en';
    localStorage.setItem('portfolio-lang', currentLang);
    updateLanguage();
    if (langBtn) langBtn.innerHTML = `<i class="fas fa-globe mr-1"></i> ${currentLang === 'en' ? 'EN/සිං' : 'සිං/EN'}`;
    if (mobileLangBtn) mobileLangBtn.innerHTML = `<i class="fas fa-globe mr-1"></i> ${currentLang === 'en' ? 'EN/සිංහල' : 'සිංහල/EN'}`;
  }

  langBtn?.addEventListener('click', toggleLang);
  mobileLangBtn?.addEventListener('click', toggleLang);
  
  // Initial update
  updateLanguage();
  if (langBtn) langBtn.innerHTML = `<i class="fas fa-globe mr-1"></i> ${currentLang === 'en' ? 'EN/සිං' : 'සිං/EN'}`;

});

/* ── FADE IN UP KEYFRAME ── */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
