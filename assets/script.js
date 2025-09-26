const toggleButton = document.getElementById("mobileToggle");
const navLinks = document.getElementById("navbarLinks");

if (toggleButton && navLinks) {
  toggleButton.addEventListener("click", () => {
    navLinks.classList.toggle("is-open");
    toggleButton.classList.toggle("is-active");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      toggleButton.classList.remove("is-active");
    });
  });
}

const counters = document.querySelectorAll(".counter");

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target || 0);
  const duration = Number(counter.dataset.duration || 2000);
  const prefix = counter.dataset.prefix || "";
  const suffix = counter.dataset.suffix || "";
  const start = Number(counter.dataset.start || 0);
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(progress * (target - start) + start);
    counter.textContent = `${prefix}${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
};

if (counters.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!entry.target.dataset.animated) {
            animateCounter(entry.target);
            entry.target.dataset.animated = "true";
          }
        }
      });
    },
    {
      threshold: 0.4,
    }
  );

  counters.forEach((counter) => {
    observer.observe(counter);
  });
}

const aboutTabs = document.querySelectorAll(".about-tabs__item");
const aboutSections = document.querySelectorAll(".about-section");
const galleryFilters = document.querySelectorAll("#galleryFilters button");
const galleryItems = document.querySelectorAll("#galleryGrid .gallery-item");
const pdfSearch = document.getElementById("pdfSearch");
const pdfList = document.getElementById("pdfList");
const gallerySlides = document.querySelectorAll('.gallery-slide');
const heroSlides = document.querySelectorAll(".hero__slide");

if (heroSlides.length) {
  heroSlides.forEach((slide) => {
    const src = slide.dataset.heroSrc;
    if (src) {
      slide.style.backgroundImage = `url("${src}")`;
    }
  });

  let activeIndex = 0;

  const activateSlide = (index) => {
    heroSlides.forEach((slide) => slide.classList.remove("is-active"));
    heroSlides[index].classList.add("is-active");
  };

  setInterval(() => {
    activeIndex = (activeIndex + 1) % heroSlides.length;
    activateSlide(activeIndex);
  }, 6000);
}

const revealSections = () => {
  aboutSections.forEach((section) => {
    if (section.getBoundingClientRect().top < window.innerHeight * 0.9) {
      section.classList.add("is-revealed");
    }
  });
};

if (aboutTabs.length) {
  revealSections();
  window.addEventListener("scroll", revealSections);

  aboutTabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      const targetSelector = tab.dataset.target;
      const targetSection = document.querySelector(targetSelector);

      if (!targetSection) return;

      aboutTabs.forEach((item) => item.classList.remove("is-active"));
      tab.classList.add("is-active");

      aboutSections.forEach((section) => section.classList.remove("is-active"));
      targetSection.classList.add("is-active");

      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

if (galleryFilters.length && galleryItems.length) {
  galleryFilters.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;

      galleryFilters.forEach((filter) => filter.classList.remove("is-active"));
      button.classList.add("is-active");

      galleryItems.forEach((item) => {
        const matches = category === "all" || item.dataset.category === category;
        item.style.display = matches ? "grid" : "none";
      });
    });
  });
}

// Gallery Slider with 0.5 second delay
if (gallerySlides.length) {
  let currentSlide = 0;
  
  const showSlide = (index) => {
    gallerySlides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev');
      if (i === index) {
        slide.classList.add('active');
      } else if (i === (index - 1 + gallerySlides.length) % gallerySlides.length) {
        slide.classList.add('prev');
      }
    });
  };
  
  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % gallerySlides.length;
    showSlide(currentSlide);
  };
  
  // Auto-slide every 0.5 seconds (500ms)
  setInterval(nextSlide, 2000);
  
  // Initialize first slide
  showSlide(0);
}

if (pdfSearch && pdfList) {
  pdfSearch.addEventListener("input", (event) => {
    const value = event.currentTarget.value.toLowerCase().trim();
    const cards = pdfList.querySelectorAll(".mandate-card");

    cards.forEach((card) => {
      const text = card.dataset.title || card.textContent || "";
      const isVisible = text.toLowerCase().includes(value);
      card.style.display = isVisible ? "flex" : "none";
    });
  });
}

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxOverlay = document.querySelector('.lightbox__overlay');
const galleryImageItems = document.querySelectorAll('.gallery-item');

if (lightbox && galleryImageItems.length) {
  let currentImageIndex = 0;
  let galleryImages = [];

  // Collect all gallery images
  galleryImageItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const caption = item.querySelector('figcaption');
    
    if (img) {
      galleryImages.push({
        src: img.src,
        alt: img.alt,
        caption: caption ? caption.textContent : img.alt
      });

      // Add click event to each gallery item
      item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox();
      });
    }
  });

  const openLightbox = () => {
    const currentImage = galleryImages[currentImageIndex];
    lightboxImage.src = currentImage.src;
    lightboxImage.alt = currentImage.alt;
    lightboxCaption.textContent = currentImage.caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const showPrevImage = () => {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    const currentImage = galleryImages[currentImageIndex];
    lightboxImage.src = currentImage.src;
    lightboxImage.alt = currentImage.alt;
    lightboxCaption.textContent = currentImage.caption;
  };

  const showNextImage = () => {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    const currentImage = galleryImages[currentImageIndex];
    lightboxImage.src = currentImage.src;
    lightboxImage.alt = currentImage.alt;
    lightboxCaption.textContent = currentImage.caption;
  };

  // Event listeners
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrevImage);
  lightboxNext.addEventListener('click', showNextImage);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
      switch(e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          showPrevImage();
          break;
        case 'ArrowRight':
          showNextImage();
          break;
      }
    }
  });

  // Prevent closing when clicking on the image
  lightboxImage.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// Notices Page Functionality
const noticeSearch = document.getElementById('noticeSearch');
const filterButtons = document.querySelectorAll('.filter-btn');
const noticeCards = document.querySelectorAll('.notice-card');
const noticeModal = document.getElementById('noticeModal');
const closeModal = document.getElementById('closeModal');
const noticeModalBody = document.getElementById('noticeModalBody');

// Notice data for modal content
const noticeData = {
  1: {
    title: "Academic Calendar 2024-25 - Second Semester",
    date: "January 15, 2025",
    category: "Academic",
    priority: "Important",
    content: `<p>The academic calendar for the second semester 2024-25 has been finalized. Key highlights include:</p>
    <ul>
      <li>Semester starts: February 1, 2025</li>
      <li>Mid-semester examinations: March 15-20, 2025</li>
      <li>End-semester examinations: May 10-25, 2025</li>
      <li>Clinical postings: As per hospital schedule</li>
      <li>Semester break: May 26 - June 15, 2025</li>
    </ul>
    <p>All students are advised to plan their academic activities accordingly.</p>`
  },
  2: {
    title: "B.Sc. Nursing Admission 2025-26",
    date: "January 12, 2025",
    category: "Admissions",
    priority: "Urgent",
    content: `<p>Online applications for B.Sc. Nursing program 2025-26 are now open. Important details:</p>
    <ul>
      <li>Application start date: January 15, 2025</li>
      <li>Last date for submission: February 28, 2025</li>
      <li>Entrance examination: March 15, 2025</li>
      <li>Merit list publication: March 25, 2025</li>
      <li>Counseling dates: April 1-10, 2025</li>
    </ul>
    <p>Eligible candidates with 10+2 PCB background can apply online through our official website.</p>`
  },
  3: {
    title: "Summer Examination Schedule 2025",
    date: "January 10, 2025",
    category: "Examinations",
    priority: "Normal",
    content: `<p>The summer examination schedule for all nursing programs has been released:</p>
    <ul>
      <li>Theory examinations: May 10-20, 2025</li>
      <li>Practical examinations: May 22-28, 2025</li>
      <li>Viva-voce: May 30 - June 2, 2025</li>
      <li>Result declaration: June 15, 2025</li>
    </ul>
    <p>Students must report 30 minutes before the examination time with valid ID cards.</p>`
  },
  4: {
    title: "Internship Orientation Program",
    date: "January 8, 2025",
    category: "Events",
    priority: "Normal",
    content: `<p>Mandatory orientation program for final year B.Sc. Nursing students:</p>
    <ul>
      <li>Date: January 20, 2025</li>
      <li>Time: 9:00 AM - 4:00 PM</li>
      <li>Venue: College Auditorium</li>
      <li>Topics: Hospital protocols, patient safety, documentation</li>
    </ul>
    <p>All final year students must attend this orientation before starting their internship.</p>`
  },
  5: {
    title: "COVID-19 Safety Guidelines",
    date: "January 5, 2025",
    category: "Academic",
    priority: "Important",
    content: `<p>Updated COVID-19 safety protocols for campus activities:</p>
    <ul>
      <li>Mandatory hand sanitization at entry points</li>
      <li>Face masks recommended in crowded areas</li>
      <li>Maintain social distancing in classrooms</li>
      <li>Report any symptoms immediately to health center</li>
      <li>Follow hospital-specific protocols during clinical postings</li>
    </ul>
    <p>Your cooperation in maintaining a safe campus environment is appreciated.</p>`
  },
  6: {
    title: "Scholarship Opportunities 2025",
    date: "January 2, 2025",
    category: "Admissions",
    priority: "Normal",
    content: `<p>Various scholarship opportunities available for deserving students:</p>
    <ul>
      <li>Merit-based scholarships: For top 10% students</li>
      <li>Need-based scholarships: For economically disadvantaged students</li>
      <li>Sports scholarships: For outstanding sports achievements</li>
      <li>Government scholarships: SC/ST/OBC categories</li>
    </ul>
    <p>Application deadline: February 15, 2025. Contact the scholarship office for more details.</p>`
  }
};

// Search functionality
if (noticeSearch) {
  noticeSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    noticeCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const content = card.querySelector('p').textContent.toLowerCase();
      
      if (title.includes(searchTerm) || content.includes(searchTerm)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// Filter functionality
if (filterButtons.length) {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter notices
      noticeCards.forEach(card => {
        const category = card.dataset.category;
        
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Modal functionality
if (noticeModal) {
  const detailButtons = document.querySelectorAll('.notice-details-btn');
  
  detailButtons.forEach(button => {
    button.addEventListener('click', () => {
      const noticeId = button.dataset.notice;
      const notice = noticeData[noticeId];
      
      if (notice) {
        noticeModalBody.innerHTML = `
          <h2>${notice.title}</h2>
          <div class="modal-meta">
            <span class="notice-date">${notice.date}</span>
            <span class="notice-category ${notice.category.toLowerCase()}">${notice.category}</span>
            <span class="priority-badge ${notice.priority.toLowerCase()}">${notice.priority}</span>
          </div>
          ${notice.content}
          <div class="modal-actions">
            <button class="btn btn--outline" onclick="window.print()">Print</button>
            <button class="btn btn--primary" onclick="closeNoticeModal()">Close</button>
          </div>
        `;
        
        noticeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // Close modal events
  if (closeModal) {
    closeModal.addEventListener('click', closeNoticeModal);
  }
  
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('notice-modal__overlay')) {
      closeNoticeModal();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && noticeModal.classList.contains('active')) {
      closeNoticeModal();
    }
  });
}

function closeNoticeModal() {
  if (noticeModal) {
    noticeModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

