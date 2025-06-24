// Global Variables
let isLoggedIn = false;
let currentProjects = [];

// DOM Elements
const adminLogin = document.getElementById('adminLogin');
const adminPanel = document.getElementById('adminPanel');
const loginForm = document.getElementById('loginForm');
const addProjectBtn = document.getElementById('addProjectBtn');
const logoutBtn = document.getElementById('logoutBtn');
const addProjectModal = document.getElementById('addProjectModal');
const editProjectModal = document.getElementById('editProjectModal');
const addProjectForm = document.getElementById('addProjectForm');
const editProjectForm = document.getElementById('editProjectForm');
const projectsGrid = document.getElementById('projectsGrid');
const adminProjects = document.getElementById('adminProjects');
const contactForm = document.getElementById('contactForm');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadProjects();
    checkAdminStatus();
    setupSmoothScrolling();
    setupProjectFilters();
    setupMobileMenu();
    setupScrollAnimations();
}

// Event Listeners Setup
function setupEventListeners() {
    // Admin Login
    loginForm.addEventListener('submit', handleLogin);
    
    // Admin Actions
    addProjectBtn.addEventListener('click', openAddProjectModal);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Forms
    addProjectForm.addEventListener('submit', handleAddProject);
    editProjectForm.addEventListener('submit', handleEditProject);
    contactForm.addEventListener('submit', handleContactForm);
    
    // Modal Controls
    setupModalControls();
    
    // Navigation
    setupNavigation();
}

// Navigation Setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Mobile Menu Setup
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Smooth Scrolling Setup
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Project Filters Setup
function setupProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter projects
            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
}

// Filter Projects
function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Modal Controls
function setupModalControls() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    
    // Close modal when clicking close button
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal);
                }
            });
        }
    });
}

// Open/Close Modal Functions
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Admin Authentication
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (in production, this should be more secure)
    if (username === 'admin' && password === 'password123') {
        isLoggedIn = true;
        localStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
        loadAdminProjects();
    } else {
        alert('Invalid credentials!');
    }
}

function handleLogout() {
    isLoggedIn = false;
    localStorage.removeItem('adminLoggedIn');
    showAdminLogin();
}

function checkAdminStatus() {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (loggedIn === 'true') {
        isLoggedIn = true;
        showAdminPanel();
        loadAdminProjects();
    }
}

function showAdminPanel() {
    adminLogin.style.display = 'none';
    adminPanel.style.display = 'block';
}

function showAdminLogin() {
    adminLogin.style.display = 'block';
    adminPanel.style.display = 'none';
    document.getElementById('loginForm').reset();
}

// Project Management
function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
    currentProjects = projects;
    displayProjects(projects);
}

function displayProjects(projects) {
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', project.category);
    
    const technologies = project.technologies.map(tech => 
        `<span class="tech-tag">${tech}</span>`
    ).join('');
    
    const links = [];
    if (project.liveUrl) {
        links.push(`<a href="${project.liveUrl}" target="_blank" class="project-link">
            <i class="fas fa-external-link-alt"></i> Live Demo
        </a>`);
    }
    if (project.githubUrl) {
        links.push(`<a href="${project.githubUrl}" target="_blank" class="project-link">
            <i class="fab fa-github"></i> Source Code
        </a>`);
    }
    
    card.innerHTML = `
        <img src="${project.image}" alt="${project.title}" class="project-image">
        <div class="project-info">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-technologies">${technologies}</div>
            <div class="project-links">${links.join('')}</div>
        </div>
    `;
    
    return card;
}

// Admin Project Management
function loadAdminProjects() {
    if (!adminProjects) return;
    
    const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
    adminProjects.innerHTML = '';
    
    if (projects.length === 0) {
        adminProjects.innerHTML = '<p style="text-align: center; color: #a1a1aa;">No projects added yet.</p>';
        return;
    }
    
    projects.forEach(project => {
        const projectCard = createAdminProjectCard(project);
        adminProjects.appendChild(projectCard);
    });
}

function createAdminProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'admin-project-card';
    
    const technologies = project.technologies.slice(0, 3).join(', ');
    const techDisplay = project.technologies.length > 3 ? 
        `${technologies} +${project.technologies.length - 3} more` : technologies;
    
    card.innerHTML = `
        <div class="project-admin-info">
            <h3 class="project-admin-title">${project.title}</h3>
            <p class="project-description">${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}</p>
            <div class="project-admin-meta">
                <span class="meta-item">${project.category}</span>
                <span class="meta-item">${techDisplay}</span>
                <span class="meta-item">Created: ${new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
        <div class="project-actions">
            <button class="edit-btn" onclick="editProject('${project.id}')">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="delete-btn" onclick="deleteProject('${project.id}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    
    return card;
}

// Add Project Modal
function openAddProjectModal() {
    openModal(addProjectModal);
}

function handleAddProject(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const imageFile = document.getElementById('projectImage').files[0];
    
    if (!imageFile) {
        alert('Please select an image for the project.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const project = {
            id: generateId(),
            title: formData.get('title') || document.getElementById('projectTitle').value,
            description: formData.get('description') || document.getElementById('projectDescription').value,
            technologies: (formData.get('technologies') || document.getElementById('projectTechnologies').value)
                .split(',').map(tech => tech.trim()).filter(tech => tech),
            category: formData.get('category') || document.getElementById('projectCategory').value,
            liveUrl: formData.get('liveUrl') || document.getElementById('projectLiveUrl').value,
            githubUrl: formData.get('githubUrl') || document.getElementById('projectGithubUrl').value,
            image: e.target.result,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        saveProject(project);
        closeModal(addProjectModal);
        addProjectForm.reset();
        loadProjects();
        loadAdminProjects();
        
        showNotification('Project added successfully!', 'success');
    };
    
    reader.readAsDataURL(imageFile);
}

// Edit Project Functions
function editProject(projectId) {
    const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
        alert('Project not found!');
        return;
    }
    
    // Populate form fields with existing data
    document.getElementById('editProjectId').value = project.id;
    document.getElementById('editTitle').value = project.title;
    document.getElementById('editDescription').value = project.description;
    document.getElementById('editTechnologies').value = project.technologies.join(', ');
    document.getElementById('editCategory').value = project.category;
    document.getElementById('editLiveUrl').value = project.liveUrl || '';
    document.getElementById('editGithubUrl').value = project.githubUrl || '';
    
    // Show current image
    const currentImagePreview = document.getElementById('currentImagePreview');
    currentImagePreview.innerHTML = `
        <p style="color: #a1a1aa; margin-bottom: 10px;">Current Image:</p>
        <img src="${project.image}" alt="Current project image" style="max-width: 200px; max-height: 150px; border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.3);">
    `;
    
    // Show modal
    openModal(editProjectModal);
}

function handleEditProject(e) {
    e.preventDefault();
    
    const projectId = document.getElementById('editProjectId').value;
    const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
        alert('Project not found!');
        return;
    }
    
    const imageFile = document.getElementById('editImageUpload').files[0];
    
    const updateProjectData = () => {
        // Update project properties
        projects[projectIndex] = {
            ...projects[projectIndex],
            title: document.getElementById('editTitle').value,
            description: document.getElementById('editDescription').value,
            technologies: document.getElementById('editTechnologies').value
                .split(',').map(tech => tech.trim()).filter(tech => tech),
            category: document.getElementById('editCategory').value,
            liveUrl: document.getElementById('editLiveUrl').value,
            githubUrl: document.getElementById('editGithubUrl').value,
            updatedAt: new Date().toISOString()
        };
        
        // Save updated projects array
        localStorage.setItem('portfolioProjects', JSON.stringify(projects));
        
        // Refresh views
        loadProjects();
        loadAdminProjects();
        closeModal(editProjectModal);
        editProjectForm.reset();
        
        showNotification('Project updated successfully!', 'success');
    };
    
    // If new image is selected, read it and update
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            projects[projectIndex].image = e.target.result;
            updateProjectData();
        };
        reader.readAsDataURL(imageFile);
    } else {
        // No new image, just update other data
        updateProjectData();
    }
}

// Delete Project
function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) {
        return;
    }
    
    const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
    const filteredProjects = projects.filter(p => p.id !== projectId);
    
    localStorage.setItem('portfolioProjects', JSON.stringify(filteredProjects));
    
    loadProjects();
    loadAdminProjects();
    
    showNotification('Project deleted successfully!', 'success');
}

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveProject(project) {
    const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
    projects.push(project);
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Contact Form Handler
function handleContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Here you would typically send the form data to a server
    // For now, we'll just show a success message
    showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
    
    // Reset form
    contactForm.reset();
}

// Initialize some sample projects if none exist
function initializeSampleProjects() {
    const existingProjects = localStorage.getItem('portfolioProjects');
    if (!existingProjects || JSON.parse(existingProjects).length === 0) {
        const sampleProjects = [
            {
                id: 'sample-1',
                title: 'Portfolio Website',
                description: 'A modern, responsive portfolio website built with HTML, CSS, and JavaScript featuring 3D elements and dark theme.',
                technologies: ['HTML', 'CSS', 'JavaScript', '3D CSS'],
                category: 'web',
                liveUrl: '#',
                githubUrl: '#',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMEIxNDI2Ii8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfNDVfMTIzIiB4MT0iMCIgeTE9IjAiIHgyPSI0MDAiIHkyPSIyMDAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzA2YjZkNCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4YjVjZjYiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB4PSI1MCIgeT0iNTAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl80NV8xMjMpIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8dGV4dCB4PSIyMDAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkludGVyIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qb3J0Zm9saW88L3RleHQ+Cjwvc3ZnPg==',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('portfolioProjects', JSON.stringify(sampleProjects));
    }
}

// Initialize sample projects on first load
initializeSampleProjects();

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(11, 20, 38, 0.98)';
    } else {
        navbar.style.background = 'rgba(11, 20, 38, 0.95)';
    }
});

// Cursor following effect for 3D elements
document.addEventListener('mousemove', function(e) {
    const cursor = { x: e.clientX, y: e.clientY };
    const cubes = document.querySelectorAll('.cube, .sphere');
    
    cubes.forEach((cube, index) => {
        const rect = cube.getBoundingClientRect();
        const cubeCenterX = rect.left + rect.width / 2;
        const cubeCenterY = rect.top + rect.height / 2;
        
        const deltaX = (cursor.x - cubeCenterX) * 0.01;
        const deltaY = (cursor.y - cubeCenterY) * 0.01;
        
        cube.style.transform += ` translate3d(${deltaX}px, ${deltaY}px, 0)`;
    });
});
