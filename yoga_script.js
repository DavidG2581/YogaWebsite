// Store yoga style data
let yogaData = {
    hatha: { images: [], description: '' },
    vinyasa: { images: [], description: '' },
    yin: { images: [], description: '' },
    restorative: { images: [], description: '' }
};

/**
 * Show/hide pages and update navigation
 * @param {string} pageId - The ID of the page to show
 */
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Find and activate the clicked nav link
    const activeLink = document.querySelector(`.nav-links a[onclick*="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Close mobile menu if open
    const navLinksContainer = document.getElementById('navLinks');
    if (navLinksContainer) {
        navLinksContainer.classList.remove('active');
    }
}

/**
 * Toggle mobile navigation menu
 */
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

/**
 * Handle image upload for yoga styles
 * @param {string} style - The yoga style (hatha, vinyasa, yin, restorative)
 * @param {FileList} files - The uploaded files
 */
function handleImageUpload(style, files) {
    if (files.length > 2) {
        alert('Please select only 2 images maximum.');
        return;
    }
    
    const preview = document.getElementById(style + '-preview');
    if (!preview) {
        console.error('Preview element not found for style:', style);
        return;
    }
    
    const slots = preview.querySelectorAll('.image-slot');
    
    // Clear existing images in yogaData
    yogaData[style].images = [];
    
    // Process each uploaded file
    Array.from(files).forEach((file, index) => {
        if (index < 2 && slots[index]) { // Ensure we don't exceed 2 images
            const reader = new FileReader();
            reader.onload = function(e) {
                const slot = slots[index];
                slot.innerHTML = `<img src="${e.target.result}" alt="${style} yoga image ${index + 1}">`;
                yogaData[style].images[index] = e.target.result;
            };
            reader.onerror = function(e) {
                console.error('Error reading file:', e);
                alert('Error reading file. Please try again.');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Reset empty slots
    for (let i = files.length; i < 2; i++) {
        if (slots[i]) {
            slots[i].innerHTML = `<div class="image-placeholder">Click to upload image ${i + 1}</div>`;
            yogaData[style].images[i] = null;
        }
    }
}

/**
 * Save yoga style information
 * @param {string} style - The yoga style to save
 */
function saveYogaStyle(style) {
    const descriptionElement = document.getElementById(style + '-description');
    if (!descriptionElement) {
        console.error('Description element not found for style:', style);
        return;
    }
    
    const description = descriptionElement.value.trim();
    yogaData[style].description = description;
    
    // Provide feedback to user
    const styleName = style.charAt(0).toUpperCase() + style.slice(1);
    const imageCount = yogaData[style].images.filter(img => img !== null