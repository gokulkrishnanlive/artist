// Google Sheets API configuration
const SHEET_ID = "189JXNzfCLPD1LipJBY8EG3tLZDYMkxXhCsku-_CNhFE";
const API_KEY = "AIzaSyBAuS3Brpsw5JOJnjNJii1UlFa7ClXf8d4";

// DOM elements
const themeToggle = document.getElementById('themeToggle');
const siteLogo = document.getElementById('site-logo');
const siteName = document.getElementById('site-name');
const siteTagline = document.getElementById('site-tagline');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const navbarOverlay = document.getElementById('navbarOverlay');
const navbarToggler = document.getElementById('navbarToggler');
const navbarCollapse = document.getElementById('navbarNav');

// Debug function
function debugLog(message) {
    console.log(message);
}

// Theme detection and toggle
function detectTheme() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Theme toggle event
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
});

// Mobile menu functionality
function setupMobileMenu() {
    // Toggle menu visibility
    navbarToggler.addEventListener('click', () => {
        const isExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            navbarToggler.setAttribute('aria-expanded', 'false');
            navbarCollapse.classList.remove('show');
            navbarOverlay.classList.remove('show');
            closeMenuBtn.classList.remove('show');
            navbarToggler.classList.remove('hidden');
        } else {
            navbarToggler.setAttribute('aria-expanded', 'true');
            navbarCollapse.classList.add('show');
            navbarOverlay.classList.add('show');
            closeMenuBtn.classList.add('show');
            navbarToggler.classList.add('hidden');
        }
    });
    
    // Close menu when clicking overlay
    navbarOverlay.addEventListener('click', () => {
        navbarToggler.setAttribute('aria-expanded', 'false');
        navbarCollapse.classList.remove('show');
        navbarOverlay.classList.remove('show');
        closeMenuBtn.classList.remove('show');
        navbarToggler.classList.remove('hidden');
    });
    
    // Close menu when clicking close button
    closeMenuBtn.addEventListener('click', () => {
        navbarToggler.setAttribute('aria-expanded', 'false');
        navbarCollapse.classList.remove('show');
        navbarOverlay.classList.remove('show');
        closeMenuBtn.classList.remove('show');
        navbarToggler.classList.remove('hidden');
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (!link.getAttribute('target') || link.getAttribute('target') !== '_blank') {
                navbarToggler.setAttribute('aria-expanded', 'false');
                navbarCollapse.classList.remove('show');
                navbarOverlay.classList.remove('show');
                closeMenuBtn.classList.remove('show');
                navbarToggler.classList.remove('hidden');
            }
        });
    });
    
    // Close menu on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navbarCollapse.classList.contains('show')) {
            navbarToggler.setAttribute('aria-expanded', 'false');
            navbarCollapse.classList.remove('show');
            navbarOverlay.classList.remove('show');
            closeMenuBtn.classList.remove('show');
            navbarToggler.classList.remove('hidden');
        }
    });
}

// Scroll to About section
function scrollToAbout() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        window.scrollTo({
            top: aboutSection.offsetTop - 70,
            behavior: 'smooth'
        });
    }
}

// Fetch data from Google Sheets
async function fetchSheetData(sheetName, range) {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`;
        debugLog(`Fetching from: ${sheetName}!${range}`);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        debugLog(`Data from ${sheetName}: ${data.values ? data.values.length : 0} rows`);
        
        if (data.values && data.values.length > 0) {
            return data.values;
        } else {
            debugLog(`No data found for sheet "${sheetName}" with range "${range}"`);
            return [];
        }
    } catch (error) {
        console.error(`Error fetching data from sheet "${sheetName}":`, error);
        debugLog(`Error fetching ${sheetName}: ${error.message}`);
        return [];
    }
}

// LOAD LOCAL HERO SLIDER IMAGES - SIMPLE VERSION
async function loadHeroSlider() {
    try {
        debugLog("Loading hero slider images from local folder...");
        const heroSlidesContainer = document.getElementById('hero-slides');
        const heroIndicators = document.getElementById('hero-indicators');
        
        // Clear existing slides and indicators
        heroSlidesContainer.innerHTML = '';
        heroIndicators.innerHTML = '';
        
        // Define local images array
        const localImages = [
            './images/hero-slider/01.jpg',
            './images/hero-slider/02.jpg', 
            './images/hero-slider/03.png',
            './images/hero-slider/04.jpg',
            './images/hero-slider/05.jpg'
        ];
        
        // Create slides and indicators
        localImages.forEach((img, index) => {
            debugLog(`Creating slide ${index + 1}: ${img}`);
            
            // Create slide
            const slide = document.createElement('div');
            slide.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            slide.innerHTML = `
                <div class="hero-slide">
                    <img src="${img}" class="hero-slide-img" alt="Hero Slide ${index + 1}">
                </div>
            `;
            heroSlidesContainer.appendChild(slide);
            
            // Create indicator
            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.setAttribute('data-bs-target', '#heroCarousel');
            indicator.setAttribute('data-bs-slide-to', index.toString());
            indicator.className = index === 0 ? 'active' : '';
            indicator.setAttribute('aria-current', index === 0 ? 'true' : 'false');
            indicator.setAttribute('aria-label', `Slide ${index + 1}`);
            heroIndicators.appendChild(indicator);
        });
        
        debugLog(`Total slides created: ${heroSlidesContainer.children.length}`);
        
        // Initialize carousel WITH auto-scroll
        const heroCarousel = document.getElementById('heroCarousel');
        if (heroCarousel) {
            const carousel = new bootstrap.Carousel(heroCarousel, {
                interval: 5000, // Auto-scroll every 5 seconds
                wrap: true,
                ride: 'carousel'
            });
            
            debugLog("Hero slider initialized successfully (with auto-scroll)");
        }
    } catch (error) {
        console.error("Error loading hero slider:", error);
        debugLog(`Error loading hero slider: ${error.message}`);
        
        // Fallback: Create at least one slide
        const heroSlidesContainer = document.getElementById('hero-slides');
        heroSlidesContainer.innerHTML = `
            <div class="carousel-item active">
                <div class="hero-slide">
                    <img src="./images/hero-slider/01.jpg" class="hero-slide-img" alt="Hero Slide">
                </div>
            </div>
        `;
    }
}

// Create custom carousel with single row for all devices
function createCustomCarousel(containerId, items, type) {
    const container = document.getElementById(containerId);
    if (!container || !items || items.length === 0) {
        container.innerHTML = '<div class="alert alert-info text-center">No content available</div>';
        return;
    }
    
    container.innerHTML = '';
    
    // Create carousel wrapper
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'card-carousel-container';
    carouselContainer.id = `${containerId}-container`;
    
    // Create inner carousel
    const carouselInner = document.createElement('div');
    carouselInner.className = 'card-carousel-inner';
    carouselInner.id = `${containerId}-inner`;
    
    // Create cards
    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'carousel-card';
        
        // Set content based on type
        if (type === 'video') {
            card.innerHTML = `
                <div class="video-container">
                    <iframe src="${item.url}" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen
                            loading="lazy"
                            title="${item.title || 'Video'}">
                    </iframe>
                </div>
                <div class="carousel-card-body">
                    <h5 class="carousel-card-title">${item.title || 'Video'}</h5>
                    <p class="carousel-card-text">${item.description || ''}</p>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="position-relative overflow-hidden">
                    <img src="${item.image || 'https://images.unsplash.com/photo-1540835296355-c04f7a063cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}" 
                         class="carousel-card-img" 
                         alt="${item.title}"
                         onerror="this.src='https://images.unsplash.com/photo-1540835296355-c04f7a063cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'">
                </div>
                <div class="carousel-card-body">
                    <h5 class="carousel-card-title">${item.title}</h5>
                    <p class="carousel-card-text">${item.content}</p>
                </div>
                <div class="carousel-card-footer">
                    <a href="${item.link || '#'}" class="view-btn" target="_blank">View</a>
                </div>
            `;
        }
        
        carouselInner.appendChild(card);
    });
    
    carouselContainer.appendChild(carouselInner);
    
    // Create navigation arrows
    const prevArrow = document.createElement('button');
    prevArrow.className = 'simple-carousel-control prev';
    prevArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevArrow.setAttribute('aria-label', 'Previous');
    
    const nextArrow = document.createElement('button');
    nextArrow.className = 'simple-carousel-control next';
    nextArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextArrow.setAttribute('aria-label', 'Next');
    
    // Add arrows to container
    carouselContainer.appendChild(prevArrow);
    carouselContainer.appendChild(nextArrow);
    
    // Add to main container
    container.appendChild(carouselContainer);
    
    // Initialize carousel functionality
    initCustomCarousel(`${containerId}-container`, `${containerId}-inner`);
}

// Initialize custom carousel functionality
function initCustomCarousel(containerId, innerId) {
    const container = document.getElementById(containerId);
    const inner = document.getElementById(innerId);
    const prevBtn = container.querySelector('.prev');
    const nextBtn = container.querySelector('.next');
    const cards = inner.querySelectorAll('.carousel-card');
    
    if (!cards.length) return;
    
    // Calculate card width including gap
    const cardStyle = window.getComputedStyle(cards[0]);
    const cardWidth = cards[0].offsetWidth + parseInt(cardStyle.marginRight || 0);
    
    let currentPosition = 0;
    const maxPosition = -(cardWidth * (cards.length - 1));
    
    // Function to update carousel position
    function updateCarousel() {
        inner.style.transform = `translateX(${currentPosition}px)`;
        
        // Show/hide buttons based on position
        prevBtn.style.opacity = currentPosition === 0 ? '0.3' : '0.7';
        nextBtn.style.opacity = currentPosition === maxPosition ? '0.3' : '0.7';
    }
    
    // Previous button click
    prevBtn.addEventListener('click', () => {
        if (currentPosition < 0) {
            currentPosition += cardWidth;
            updateCarousel();
        }
    });
    
    // Next button click
    nextBtn.addEventListener('click', () => {
        if (currentPosition > maxPosition) {
            currentPosition -= cardWidth;
            updateCarousel();
        }
    });
    
    // Initialize
    updateCarousel();
    
    // Auto-scroll functionality
    let autoScrollInterval;
    
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            if (currentPosition > maxPosition) {
                currentPosition -= cardWidth;
                updateCarousel();
            } else {
                // Reset to first card
                currentPosition = 0;
                updateCarousel();
            }
        }, 4000); // Scroll every 4 seconds
    }
    
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    // Start auto-scroll
    startAutoScroll();
    
    // Pause auto-scroll on hover
    container.addEventListener('mouseenter', stopAutoScroll);
    container.addEventListener('mouseleave', startAutoScroll);
    
    // Pause auto-scroll on touch
    container.addEventListener('touchstart', stopAutoScroll);
    container.addEventListener('touchend', startAutoScroll);
}

// Load about me content from Google Sheets
async function loadAboutMe() {
    try {
        const aboutData = await fetchSheetData('about me', 'A2:C');
        const aboutContent = document.getElementById('about-content');
        
        if (aboutData.length === 0) {
            aboutContent.innerHTML = `
                <div class="card border-0 shadow-sm">
                    <div class="card-body p-4">
                        <p class="lead">Hello! I'm Gokul G., a passionate individual who seamlessly blends professional dedication with creative expression. My journey reflects a harmonious balance between a stable government career and deep artistic pursuits.</p>
                        
                        <div id="more-about" class="hidden-content mt-4">
                            <h5>My Journey</h5>
                            <p>Started my journey in 2018 with a simple camera and a dream to create engaging content.</p>
                            
                            <h5>My Mission</h5>
                            <p>To inspire and entertain through authentic storytelling and creative expression.</p>
                            
                            <h5>My Vision</h5>
                            <p>Building a community where creativity flourishes and connections are made.</p>
                        </div>
                        
                        <div class="text-center mt-4">
                            <span class="read-more-toggle" onclick="toggleReadMore()">Read More <i class="fas fa-chevron-down"></i></span>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <p class="lead">${aboutData[0] ? aboutData[0][0] : 'No content available'}</p>
        `;
        
        if (aboutData.length > 1) {
            html += '<div id="more-about" class="hidden-content mt-4">';
            
            for (let i = 1; i < aboutData.length; i++) {
                const heading = aboutData[i][1] || '';
                const content = aboutData[i][2] || '';
                
                if (heading || content) {
                    html += `<h5 class="mt-3">${heading}</h5><p>${content}</p>`;
                }
            }
            
            html += '</div>';
            html += `
                <div class="text-center mt-4">
                    <span class="read-more-toggle" onclick="toggleReadMore()">Read More <i class="fas fa-chevron-down"></i></span>
                </div>
            `;
        }
        
        html += '</div></div>';
        aboutContent.innerHTML = html;
    } catch (error) {
        console.error("Error loading about me:", error);
        debugLog(`Error loading about me: ${error.message}`);
    }
}

// Load news content from Google Sheets
async function loadNews() {
    try {
        const newsData = await fetchSheetData('In news', 'A2:D');
        
        if (newsData.length === 0) {
            const fallbackNews = [
                {
                    image: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    title: 'Latest Project Launch',
                    content: 'Excited to announce my latest creative project.',
                    link: '#'
                },
                {
                    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    title: 'Upcoming Event',
                    content: 'Join me for an exclusive online event.',
                    link: '#'
                }
            ];
            
            createCustomCarousel('news-cards', fallbackNews, 'news');
        } else {
            const newsItems = newsData.map(row => ({
                image: row[0] || '',
                title: row[1] || 'Untitled',
                content: row[2] || 'No content available',
                link: row[3] || '#'
            }));
            
            createCustomCarousel('news-cards', newsItems, 'news');
        }
    } catch (error) {
        console.error("Error loading news:", error);
        debugLog(`Error loading news: ${error.message}`);
    }
}

// Load image gallery from Google Sheets
async function loadImageGallery() {
    try {
        const galleryData = await fetchSheetData('Image gallery', 'A2:D');
        
        if (galleryData.length === 0) {
            const fallbackGallery = [
                {
                    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    title: 'Mountain Adventure',
                    content: 'Beautiful landscapes from recent adventures.',
                    link: '#'
                },
                {
                    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    title: 'Urban Exploration',
                    content: 'Exploring the hidden corners of the city.',
                    link: '#'
                }
            ];
            
            createCustomCarousel('gallery-cards', fallbackGallery, 'gallery');
        } else {
            const galleryItems = galleryData.map(row => ({
                image: row[0] || '',
                title: row[1] || 'Untitled',
                content: row[2] || 'No description available',
                link: row[3] || '#'
            }));
            
            createCustomCarousel('gallery-cards', galleryItems, 'gallery');
        }
    } catch (error) {
        console.error("Error loading image gallery:", error);
        debugLog(`Error loading image gallery: ${error.message}`);
    }
}

// Load video gallery from Google Sheets
async function loadVideoGallery() {
    try {
        const videoData = await fetchSheetData('Video gallery', 'A2:A');
        
        if (videoData.length === 0) {
            const fallbackVideos = [
                {
                    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    title: 'Creative Process',
                    description: 'Behind the scenes'
                },
                {
                    url: 'https://www.youtube.com/embed/9bZkp7q19f0',
                    title: 'Latest Performance',
                    description: 'Musical highlights'
                }
            ];
            
            createCustomCarousel('video-cards', fallbackVideos, 'video');
        } else {
            const videoItems = videoData.map(row => {
                if (!row[0]) return null;
                
                let videoUrl = row[0].trim();
                // Convert YouTube URLs to embed URLs
                if (videoUrl.includes('youtu.be/')) {
                    const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
                    videoUrl = `https://www.youtube.com/embed/${videoId}`;
                } else if (videoUrl.includes('youtube.com/watch?v=')) {
                    const videoId = videoUrl.split('v=')[1].split('&')[0];
                    videoUrl = `https://www.youtube.com/embed/${videoId}`;
                }
                
                return {
                    url: videoUrl,
                    title: 'Video Content',
                    description: 'Check out this video'
                };
            }).filter(item => item !== null);
            
            createCustomCarousel('video-cards', videoItems, 'video');
        }
    } catch (error) {
        console.error("Error loading video gallery:", error);
        debugLog(`Error loading video gallery: ${error.message}`);
    }
}

// Toggle read more functionality
function toggleReadMore() {
    const moreContent = document.getElementById('more-about');
    const toggleBtn = document.querySelector('.read-more-toggle');
    
    if (!moreContent || !toggleBtn) return;
    
    if (moreContent.classList.contains('hidden-content')) {
        moreContent.classList.remove('hidden-content');
        toggleBtn.innerHTML = 'Read Less <i class="fas fa-chevron-up"></i>';
    } else {
        moreContent.classList.add('hidden-content');
        toggleBtn.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    debugLog("DOM loaded, initializing...");
    
    // Detect and set theme
    detectTheme();
    
    // Setup mobile menu functionality
    setupMobileMenu();
    
    // Load all content
    debugLog("Loading hero slider...");
    await loadHeroSlider();
    
    debugLog("Loading about me...");
    await loadAboutMe();
    
    debugLog("Loading news...");
    await loadNews();
    
    debugLog("Loading image gallery...");
    await loadImageGallery();
    
    debugLog("Loading video gallery...");
    await loadVideoGallery();
    
    debugLog("All content loaded successfully");
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            if (this.getAttribute('target') === '_blank') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});