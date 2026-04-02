// ==================== CONFIGURATION ====================
const DATABASE_ID = "189JXNzfCLPD1LipJBY8EG3tLZDYMkxXhCsku-_CNhFE";
const API_KEY = "AIzaSyBAuS3Brpsw5JOJnjNJii1UlFa7ClXf8d4";

// DOM references
const themeToggle = document.getElementById('themeToggle');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const navbarOverlay = document.getElementById('navbarOverlay');
const navbarToggler = document.getElementById('navbarToggler');
const navbarCollapse = document.getElementById('navbarNav');

// Helper debug
function debugLog(msg) { console.log(msg); }

// Theme handling
function detectTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const current = localStorage.getItem('theme');
    if (current === 'dark' || (!current && prefersDark.matches)) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}
themeToggle.addEventListener('click', () => {
    const curr = document.documentElement.getAttribute('data-bs-theme');
    if (curr === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
});

// Mobile menu
function setupMobileMenu() {
    navbarToggler.addEventListener('click', () => {
        const expanded = navbarToggler.getAttribute('aria-expanded') === 'true';
        if (expanded) {
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
    navbarOverlay.addEventListener('click', closeMenu);
    closeMenuBtn.addEventListener('click', closeMenu);
    document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => { if(!link.getAttribute('target')) closeMenu(); }));
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && navbarCollapse.classList.contains('show')) closeMenu(); });
    function closeMenu() {
        navbarToggler.setAttribute('aria-expanded', 'false');
        navbarCollapse.classList.remove('show');
        navbarOverlay.classList.remove('show');
        closeMenuBtn.classList.remove('show');
        navbarToggler.classList.remove('hidden');
    }
}

async function fetchSheetData(sheetName, range) {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${DATABASE_ID}/values/${sheetName}!${range}?key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data.values || [];
    } catch(e) { console.error(e); return []; }
}

// Hero Slider - Fetches images from "Slider images" sheet columns A, B, C
async function loadHeroSlider() {
    const container = document.getElementById('hero-slides');
    const indicatorsDiv = document.getElementById('hero-indicators');
    container.innerHTML = '';
    indicatorsDiv.innerHTML = '';
    
    let sliderData = [];
    
    try {
        // Fetch images and captions from "Slider images" sheet, columns A, B, C from row 2
        const imagesData = await fetchSheetData('Slider images', 'A2:C');
        
        if (imagesData && imagesData.length > 0) {
            // Filter out rows with empty image URLs
            sliderData = imagesData
                .filter(row => row[0] && row[0].trim() !== '')
                .map(row => ({
                    image: row[0].trim(),
                    caption: row[1] ? row[1].trim() : '',
                    link: row[2] ? row[2].trim() : ''
                }));
            
            debugLog(`Found ${sliderData.length} slides from Slider images sheet`);
        }
        
        // If no images found in sheet, use fallback local images
        if (sliderData.length === 0) {
            debugLog("No images found in Slider images sheet, using fallback images");
            sliderData = [
                { image: './images/hero-slider/01.jpg', caption: 'Welcome to Gokullive', link: '' },
                { image: './images/hero-slider/02.jpg', caption: 'Carnatic Music Enthusiast', link: '' },
                { image: './images/hero-slider/03.png', caption: 'District Coordinator', link: '' },
                { image: './images/hero-slider/04.jpg', caption: 'Treasury Department Kerala', link: '' },
                { image: './images/hero-slider/05.jpg', caption: 'Cultural Journey', link: '' }
            ];
        }
        
    } catch (error) {
        console.error("Error loading slider images from sheet:", error);
        debugLog("Error fetching slider images, using fallback images");
        sliderData = [
            { image: './images/hero-slider/01.jpg', caption: 'Welcome to Gokullive', link: '' },
            { image: './images/hero-slider/02.jpg', caption: 'Carnatic Music Enthusiast', link: '' },
            { image: './images/hero-slider/03.png', caption: 'District Coordinator', link: '' },
            { image: './images/hero-slider/04.jpg', caption: 'Treasury Department Kerala', link: '' },
            { image: './images/hero-slider/05.jpg', caption: 'Cultural Journey', link: '' }
        ];
    }
    
    // Create slides and indicators
    sliderData.forEach((slide, idx) => {
        // Create slide
        const slideDiv = document.createElement('div');
        slideDiv.className = `carousel-item ${idx === 0 ? 'active' : ''}`;
        
        // Build slide HTML with caption overlay and button
        let captionHtml = '';
        if (slide.caption || slide.link) {
            captionHtml = `<div class="hero-caption">
                <div class="hero-caption-content">
                    ${slide.caption ? `<h3 class="hero-caption-title">${escapeHtml(slide.caption)}</h3>` : ''}
                    ${slide.link ? `<a href="${slide.link}" class="hero-caption-btn" target="_blank" rel="noopener noreferrer">View More <i class="fas fa-arrow-right"></i></a>` : ''}
                </div>
            </div>`;
        }
        
        slideDiv.innerHTML = `
            <div class="hero-slide">
                <img src="${slide.image}" class="hero-slide-img" alt="Hero ${idx+1}" onerror="this.src='https://placehold.co/1600x600?text=Gokullive'">
                ${captionHtml}
            </div>
        `;
        container.appendChild(slideDiv);
        
        // Create indicator
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('data-bs-target', '#heroCarousel');
        btn.setAttribute('data-bs-slide-to', idx);
        btn.className = idx === 0 ? 'active' : '';
        btn.setAttribute('aria-label', `Slide ${idx + 1}`);
        indicatorsDiv.appendChild(btn);
    });
    
    // Initialize carousel if there are slides
    if (sliderData.length > 0) {
        new bootstrap.Carousel(document.getElementById('heroCarousel'), { 
            interval: 5000, 
            wrap: true, 
            ride: 'carousel' 
        });
        debugLog(`Hero slider initialized with ${sliderData.length} slides`);
    } else {
        debugLog("No slides to display in hero slider");
        container.innerHTML = '<div class="alert alert-warning text-center">No slider images available</div>';
    }
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Custom carousel with swipe support for mobile/tablet
function createCustomCarousel(containerId, items, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!items || items.length === 0) { container.innerHTML = '<div class="alert alert-info text-center">No content available</div>'; return; }
    container.innerHTML = '';
    const carouselWrap = document.createElement('div'); carouselWrap.className = 'card-carousel-container';
    const inner = document.createElement('div'); inner.className = 'card-carousel-inner';
    const reversed = [...items].reverse();
    reversed.forEach(item => {
        const card = document.createElement('div'); card.className = 'carousel-card';
        if (type === 'video') {
            card.innerHTML = `<div class="video-container"><iframe src="${item.url}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" title="${item.title || 'Video'}"></iframe></div>
            <div class="carousel-card-body"><h5 class="carousel-card-title">${escapeHtml(item.title || '')}</h5><p class="carousel-card-text">${escapeHtml(item.description || '')}</p></div>`;
        } else {
            card.innerHTML = `<div class="position-relative overflow-hidden"><img src="${item.image || 'https://images.unsplash.com/photo-1540835296355-c04f7a063cbb?w=600'}" class="carousel-card-img" alt="${escapeHtml(item.title)}" onerror="this.src='https://placehold.co/600x400?text=Image'"></div>
            <div class="carousel-card-body"><h5 class="carousel-card-title">${escapeHtml(item.title)}</h5><p class="carousel-card-text">${escapeHtml(item.content)}</p></div>
            <div class="carousel-card-footer"><a href="${item.link || '#'}" class="view-btn" target="_blank">View</a></div>`;
        }
        inner.appendChild(card);
    });
    carouselWrap.appendChild(inner);
    const prevBtn = document.createElement('button'); prevBtn.className = 'simple-carousel-control prev'; prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    const nextBtn = document.createElement('button'); nextBtn.className = 'simple-carousel-control next'; nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    carouselWrap.appendChild(prevBtn); carouselWrap.appendChild(nextBtn);
    container.appendChild(carouselWrap);
    
    let current = 0;
    const cards = inner.querySelectorAll('.carousel-card');
    if(!cards.length) return;
    const gap = 30; let cardWidth = cards[0].offsetWidth + gap;
    const maxScroll = (cards.length - 1) * cardWidth;
    
    function updatePosition() {
        inner.style.transform = `translateX(-${current * cardWidth}px)`;
        prevBtn.style.opacity = current === 0 ? '0.3' : '0.7';
        nextBtn.style.opacity = current >= cards.length - 1 ? '0.3' : '0.7';
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current >= cards.length - 1;
    }
    
    prevBtn.addEventListener('click', () => { if(current > 0) { current--; updatePosition(); } });
    nextBtn.addEventListener('click', () => { if(current < cards.length - 1) { current++; updatePosition(); } });
    
    // SWIPE SUPPORT FOR MOBILE AND TABLET
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;
    
    carouselWrap.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        isSwiping = true;
    }, { passive: true });
    
    carouselWrap.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        // Optional: Add visual feedback while swiping
    }, { passive: true });
    
    carouselWrap.addEventListener('touchend', () => {
        if (!isSwiping) return;
        isSwiping = false;
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && current < cards.length - 1) {
                // Swipe left - next
                current++;
                updatePosition();
            } else if (diff < 0 && current > 0) {
                // Swipe right - previous
                current--;
                updatePosition();
            }
        }
        // Reset values
        touchStartX = 0;
        touchEndX = 0;
    });
    
    // Mouse drag support for desktop (optional)
    let mouseStartX = 0;
    let isDragging = false;
    
    carouselWrap.addEventListener('mousedown', (e) => {
        mouseStartX = e.clientX;
        isDragging = true;
        carouselWrap.style.cursor = 'grabbing';
    });
    
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const diff = mouseStartX - e.clientX;
        // Visual feedback while dragging
    });
    
    window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        carouselWrap.style.cursor = 'grab';
        const swipeThreshold = 50;
        const diff = mouseStartX - e.clientX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && current < cards.length - 1) {
                current++;
                updatePosition();
            } else if (diff < 0 && current > 0) {
                current--;
                updatePosition();
            }
        }
        mouseStartX = 0;
    });
    
    window.addEventListener('resize', () => { 
        cardWidth = cards[0].offsetWidth + gap; 
        updatePosition();
    });
    updatePosition();
}

// Load About Me + Badge from settings sheet B4
async function loadAboutMe() {
    const aboutContainer = document.getElementById('about-content');
    let badgeImageUrl = null;
    try {
        const settingsData = await fetchSheetData('settings', 'A1:B20');
        if(settingsData.length) {
            for(let row of settingsData) {
                if(row[0] && row[0].toString().toLowerCase() === 'badgeimage') {
                    badgeImageUrl = row[1] || null;
                    break;
                }
                if(row[0] && row[0].toString().toLowerCase() === 'badge image') {
                    badgeImageUrl = row[1] || null;
                    break;
                }
            }
            // fallback B4 specifically if needed: cell B4
            if(!badgeImageUrl && settingsData[3] && settingsData[3][1]) badgeImageUrl = settingsData[3][1];
        }
    } catch(e) { console.warn(e); }
    
    const aboutData = await fetchSheetData('about me', 'A2:C');
    let html = `<div class="card border-0 shadow-sm"><div class="card-body p-4">`;
    if(badgeImageUrl && badgeImageUrl.trim() !== "") {
        html += `<div class="about-badge-wrapper"><img src="${badgeImageUrl}" class="about-badge-img" alt="Profile Badge" onerror="this.style.display='none'"></div>`;
    }
    if(aboutData.length === 0) {
        html += `<p class="lead">Hello! I'm Gokul G., a passionate individual who seamlessly blends professional dedication with creative expression. My journey reflects a harmonious balance between a stable government career and deep artistic pursuits.</p>
        <div id="more-about" class="hidden-content mt-4"><h5>My Journey</h5><p>Started my journey in 2018 with a simple camera and a dream to create engaging content.</p><h5>My Mission</h5><p>To inspire and entertain through authentic storytelling.</p></div>
        <div class="text-center mt-4"><span class="read-more-toggle" onclick="toggleReadMore()">Read More <i class="fas fa-chevron-down"></i></span></div>`;
    } else {
        html += `<p class="lead">${escapeHtml(aboutData[0]?.[0] || 'No description available')}</p>`;
        if(aboutData.length > 1) {
            html += `<div id="more-about" class="hidden-content mt-4">`;
            for(let i=1; i<aboutData.length; i++) {
                const heading = aboutData[i][1] || '';
                const content = aboutData[i][2] || '';
                if(heading || content) html += `<h5 class="mt-3">${escapeHtml(heading)}</h5><p>${escapeHtml(content)}</p>`;
            }
            html += `</div><div class="text-center mt-4"><span class="read-more-toggle" onclick="toggleReadMore()">Read More <i class="fas fa-chevron-down"></i></span></div>`;
        }
    }
    html += `</div></div>`;
    aboutContainer.innerHTML = html;
}

async function loadNews() {
    const data = await fetchSheetData('In news', 'A2:D');
    if(data.length === 0) {
        createCustomCarousel('news-cards', [{image:'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1', title:'Latest Project Launch', content:'Exciting updates', link:'#'}], 'news');
        return;
    }
    const items = data.map(row => ({ image: row[0] || '', title: row[1] || 'Update', content: row[2] || '', link: row[3] || '#' }));
    createCustomCarousel('news-cards', items, 'news');
}

async function loadImageGallery() {
    const data = await fetchSheetData('Image gallery', 'A2:D');
    if(!data.length) { createCustomCarousel('gallery-cards', [{image:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', title:'Gallery', content:'Moments', link:'#'}], 'gallery'); return; }
    const items = data.map(row => ({ image: row[0] || '', title: row[1] || 'Image', content: row[2] || '', link: row[3] || '#' }));
    createCustomCarousel('gallery-cards', items, 'gallery');
}

async function loadVideoGallery() {
    const data = await fetchSheetData('Video gallery', 'A2:C');
    if(!data.length) { createCustomCarousel('video-cards', [{url:'https://www.youtube.com/embed/dQw4w9WgXcQ', title:'Sample', description:'Video content'}], 'video'); return; }
    const items = data.map(row => {
        if(!row[0]) return null;
        let url = row[0].trim();
        if(url.includes('youtu.be/')) { let id = url.split('youtu.be/')[1].split('?')[0]; url = `https://www.youtube.com/embed/${id}`; }
        else if(url.includes('youtube.com/watch?v=')) { let id = url.split('v=')[1].split('&')[0]; url = `https://www.youtube.com/embed/${id}`; }
        return { url, title: row[1] || 'Video', description: row[2] || '' };
    }).filter(v => v);
    createCustomCarousel('video-cards', items, 'video');
}

window.toggleReadMore = function() {
    const more = document.getElementById('more-about');
    const btn = document.querySelector('.read-more-toggle');
    if(!more) return;
    if(more.classList.contains('hidden-content')) {
        more.classList.remove('hidden-content');
        btn.innerHTML = 'Read Less <i class="fas fa-chevron-up"></i>';
    } else {
        more.classList.add('hidden-content');
        btn.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
    }
};

function scrollToAbout() {
    const aboutSec = document.getElementById('about');
    if(aboutSec) window.scrollTo({ top: aboutSec.offsetTop - 70, behavior: 'smooth' });
}

// ==================== MUSIC PLAYER FUNCTIONS ====================

let audioPlayer = null;
let musicPlayed = false;

async function initBackgroundMusic() {
    try {
        const settingsData = await fetchSheetData('settings', 'A1:B10');
        
        let musicUrl = null;
        
        if (settingsData && settingsData.length > 0) {
            for (let i = 0; i < settingsData.length; i++) {
                const key = settingsData[i][0] ? settingsData[i][0].toString().toLowerCase() : '';
                if (key === 'music' || key === 'bgmusic' || key === 'backgroundmusic') {
                    musicUrl = settingsData[i][1];
                    break;
                }
            }
            
            if (!musicUrl && settingsData[4] && settingsData[4][1]) {
                musicUrl = settingsData[4][1];
            }
        }
        
        if (musicUrl && musicUrl.trim() !== "") {
            debugLog("Music URL found: " + musicUrl);
            
            audioPlayer = new Audio(musicUrl);
            audioPlayer.loop = true;
            audioPlayer.volume = 0.5;
            
            const playPromise = audioPlayer.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    debugLog("Background music started successfully");
                    musicPlayed = true;
                    showMusicControl();
                }).catch(error => {
                    debugLog("Autoplay was prevented. User interaction required.");
                    showMusicHint();
                });
            }
        } else {
            debugLog("No music URL found in settings sheet B5");
        }
    } catch (error) {
        console.error("Error loading background music:", error);
        debugLog("Error loading music: " + error.message);
    }
}

function showMusicControl() {
    const musicControl = document.getElementById('music-control');
    const musicToggle = document.getElementById('music-toggle');
    if (musicControl && musicToggle) {
        musicControl.style.display = 'block';
        let isPlaying = true;
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        
        musicToggle.addEventListener('click', () => {
            if (audioPlayer) {
                if (isPlaying) {
                    audioPlayer.pause();
                    musicToggle.innerHTML = '<i class="fas fa-play"></i>';
                    isPlaying = false;
                } else {
                    audioPlayer.play();
                    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                    isPlaying = true;
                }
            }
        });
    }
}

function showMusicHint() {
    if (document.getElementById('music-hint')) return;
    
    const hint = document.createElement('div');
    hint.id = 'music-hint';
    hint.innerHTML = `
        <div style="position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); 
                    color: white; padding: 12px 20px; border-radius: 50px; cursor: pointer; z-index: 9999;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 10px;
                    font-size: 14px; backdrop-filter: blur(10px); animation: slideIn 0.5s ease;">
            <i class="fas fa-music"></i>
            <span>Click to play background music</span>
            <i class="fas fa-play-circle"></i>
        </div>
    `;
    document.body.appendChild(hint);
    
    hint.addEventListener('click', () => {
        if (audioPlayer && !musicPlayed) {
            audioPlayer.play().then(() => {
                musicPlayed = true;
                hint.style.animation = 'fadeOut 0.5s ease';
                setTimeout(() => hint.remove(), 500);
                debugLog("Music started by user interaction");
                showMusicControl();
            }).catch(err => console.log("Still cannot play:", err));
        }
    });
    
    setTimeout(() => {
        if (hint && hint.parentNode && !musicPlayed) {
            hint.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => hint.remove(), 500);
        }
    }, 10000);
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', async () => {
    detectTheme();
    setupMobileMenu();
    await loadHeroSlider();
    await loadAboutMe();
    await loadNews();
    await loadImageGallery();
    await loadVideoGallery();
    await initBackgroundMusic();
    
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if(this.getAttribute('target') === '_blank') return;
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
        });
    });
    
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 100;
            if(scrollY >= top && scrollY < top + sec.offsetHeight) current = sec.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
    });
});