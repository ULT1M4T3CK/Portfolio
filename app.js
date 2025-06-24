// Portfolio Website JavaScript

// Sample projects data
const sampleProjects = [
    {
        id: 1,
        title: "3D Interactive Portfolio",
        description: "A modern portfolio website featuring 3D elements, animations, and responsive design built with Three.js and modern web technologies.",
        tech_stack: ["HTML5", "CSS3", "JavaScript", "Three.js"],
        category: "Web Development",
        image: "placeholder_project1.jpg",
        demo_url: "#",
        github_url: "#"
    },
    {
        id: 2,
        title: "E-commerce Platform",
        description: "Full-stack e-commerce solution with user authentication, payment processing, and admin dashboard.",
        tech_stack: ["React", "Node.js", "MongoDB", "Stripe"],
        category: "Full Stack",
        image: "placeholder_project2.jpg",
        demo_url: "#",
        github_url: "#"
    },
    {
        id: 3,
        title: "Mobile Game Application",
        description: "Cross-platform mobile game with physics engine, multiplayer support, and in-app purchases.",
        tech_stack: ["Unity", "C#", "Firebase", "AdMob"],
        category: "Game Development",
        image: "placeholder_project3.jpg",
        demo_url: "#",
        github_url: "#"
    },
    {
        id: 4,
        title: "Data Visualization Dashboard",
        description: "Interactive dashboard for data analysis with real-time charts, filtering, and export functionality.",
        tech_stack: ["D3.js", "Python", "Flask", "PostgreSQL"],
        category: "Data Science",
        image: "placeholder_project4.jpg",
        demo_url: "#",
        github_url: "#"
    }
];

// Global variables
let projects = [];
let isLoggedIn = false;
let currentFilter = 'all';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing Portfolio');
    
    // Initialize all components
    initializeProjects();
    setupNavigation();
    setupScrollAnimations();
    setupSkillBars();
    setupProjectFilters();
    setupContactForm();
    setupAdminPanel();
    createParticles();
    setupResponsiveMenu();
    
    // Make sure floating shapes are visible
    setTimeout(() => {
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach(shape => {
            shape.style.display = 'block';
            shape.style.opacity = '0.3';
        });
    }, 100);
    
    console.log('Portfolio initialization complete');
});

// Initialize projects from localStorage or use sample data
function initializeProjects() {
    console.log('Initializing projects...');
    const storedProjects = localStorage.getItem('portfolioProjects');
    if (storedProjects) {
        projects = JSON.parse(storedProjects);
    } else {
        projects = [...sampleProjects];
        localStorage.setItem('portfolioProjects', JSON.stringify(projects));
    }
    displayProjects();
}

// Save projects to localStorage
function saveProjects() {
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
}

// Navigation setup
function setupNavigation() {
    console.log('Setting up navigation...');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            console.log('Navigating to:', targetId);
            scrollToSection(targetId);
            
            // Close mobile menu if open
            const navMenu = document.getElementById('nav-menu');
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Smooth scroll to section with proper offset
function scrollToSection(sectionId) {
    console.log('Scrolling to section:', sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 70;
        const offsetTop = element.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: Math.max(0, offsetTop),
            behavior: 'smooth'
        });
    } else {
        console.warn('Section not found:', sectionId);
    }
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Setup scroll animations using Intersection Observer
function setupScrollAnimations() {
    console.log('Setting up scroll animations...');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements after they're rendered
    setTimeout(() => {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach(item => observer.observe(item));

        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => observer.observe(card));
    }, 500);
}

// Setup skill bars animation
function setupSkillBars() {
    console.log('Setting up skill bars...');
    const skillItems = document.querySelectorAll('.skill-item');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItem = entry.target;
                const level = skillItem.getAttribute('data-level');
                const progressBar = skillItem.querySelector('.skill-progress');
                
                if (progressBar) {
                    setTimeout(() => {
                        progressBar.style.width = level + '%';
                    }, 200);
                }
                
                skillObserver.unobserve(skillItem);
            }
        });
    }, { threshold: 0.5 });

    skillItems.forEach(item => skillObserver.observe(item));
}

// Setup project filters
function setupProjectFilters() {
    console.log('Setting up project filters...');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Filter clicked:', this.getAttribute('data-filter'));
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter projects
            currentFilter = this.getAttribute('data-filter');
            displayProjects(currentFilter);
        });
    });
}

// Display projects with optional filtering
function displayProjects(filter = 'all') {
    console.log('Displaying projects with filter:', filter);
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) {
        console.error('Projects grid element not found');
        return;
    }

    const filteredProjects = filter === 'all' ? 
        projects : 
        projects.filter(project => project.category === filter);

    projectsGrid.innerHTML = '';

    filteredProjects.forEach((project, index) => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
        
        // Add staggered animation
        setTimeout(() => {
            projectCard.classList.add('animate');
        }, index * 100);
    });
    
    console.log(`Displayed ${filteredProjects.length} projects`);
}

// Create project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
        <div class="project-image">
            <span>Project Image</span>
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${project.tech_stack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                ${project.demo_url && project.demo_url !== '#' ? `<a href="${project.demo_url}" class="project-link" target="_blank">Live Demo</a>` : ''}
                ${project.github_url && project.github_url !== '#' ? `<a href="${project.github_url}" class="project-link" target="_blank">GitHub</a>` : ''}
            </div>
        </div>
    `;
    return card;
}

// Setup contact form
function setupContactForm() {
    console.log('Setting up contact form...');
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Simulate form submission
            alert('Thank you for your message! I\'ll get back to you soon.');
            this.reset();
        });
    }
}

// Setup admin panel
function setupAdminPanel() {
    console.log('Setting up admin panel...');
    const loginForm = document.getElementById('admin-login');
    const logoutBtn = document.getElementById('logout-btn');
    const addProjectForm = document.getElementById('add-project-form');
    
    // Check if already logged in
    isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
        showAdminDashboard();
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            console.log('Login attempt:', username);
            
            if (username === 'admin' && password === 'password123') {
                isLoggedIn = true;
                localStorage.setItem('adminLoggedIn', 'true');
                showAdminDashboard();
                console.log('Admin login successful');
            } else {
                alert('Invalid credentials. Use admin/password123');
            }
        });
    }
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            isLoggedIn = false;
            localStorage.removeItem('adminLoggedIn');
            showLoginForm();
            console.log('Admin logged out');
        });
    }
    
    // Add project form
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewProject();
        });
    }
}

// Show admin dashboard
function showAdminDashboard() {
    const loginForm = document.getElementById('login-form');
    const adminDashboard = document.getElementById('admin-dashboard');
    
    if (loginForm) loginForm.classList.add('hidden');
    if (adminDashboard) adminDashboard.classList.remove('hidden');
    
    loadAdminProjects();
}

// Show login form
function showLoginForm() {
    const loginForm = document.getElementById('login-form');
    const adminDashboard = document.getElementById('admin-dashboard');
    
    if (loginForm) loginForm.classList.remove('hidden');
    if (adminDashboard) adminDashboard.classList.add('hidden');
}

// Add new project
function addNewProject() {
    const title = document.getElementById('project-title').value;
    const description = document.getElementById('project-description').value;
    const category = document.getElementById('project-category').value;
    const techStack = document.getElementById('project-tech').value.split(',').map(tech => tech.trim());
    const demoUrl = document.getElementById('demo-url').value || '#';
    const githubUrl = document.getElementById('github-url').value || '#';
    
    if (!title || !description || !category || !techStack.length) {
        alert('Please fill in all required fields.');
        return;
    }
    
    const newProject = {
        id: Date.now(),
        title,
        description,
        tech_stack: techStack,
        category,
        image: 'placeholder_new.jpg',
        demo_url: demoUrl,
        github_url: githubUrl
    };
    
    projects.push(newProject);
    saveProjects();
    displayProjects(currentFilter);
    loadAdminProjects();
    
    // Reset form
    document.getElementById('add-project-form').reset();
    alert('Project added successfully!');
    
    console.log('New project added:', newProject);
}

// Load projects in admin panel
function loadAdminProjects() {
    const projectsList = document.getElementById('admin-projects-list');
    if (!projectsList) return;
    
    projectsList.innerHTML = '';
    
    projects.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        projectItem.innerHTML = `
            <div class="project-info">
                <h5>${project.title}</h5>
                <p>${project.category} - ${project.tech_stack.join(', ')}</p>
            </div>
            <div class="project-actions">
                <button class="btn btn-danger btn-small" onclick="deleteProject(${project.id})">Delete</button>
            </div>
        `;
        projectsList.appendChild(projectItem);
    });
}

// Delete project
function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        projects = projects.filter(project => project.id !== projectId);
        saveProjects();
        displayProjects(currentFilter);
        loadAdminProjects();
        console.log('Project deleted:', projectId);
    }
}

// Create floating particles
function createParticles() {
    console.log('Creating particles...');
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) {
        console.warn('Particles container not found');
        return;
    }
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 8 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
    
    console.log(`Created ${particleCount} particles`);
}

// Setup responsive menu
function setupResponsiveMenu() {
    console.log('Setting up responsive menu...');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            console.log('Hamburger menu clicked');
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
}

// Add navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(11, 20, 38, 0.95)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(11, 20, 38, 0.8)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    }
});

// Enhanced 3D hover effects for project cards
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        }
    });
});

// Reset card transforms when mouse leaves
document.addEventListener('mouseleave', function() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// CTA Button click handler
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection('projects');
        });
    }
});

// Performance optimization for scroll events
let ticking = false;
function updateOnScroll() {
    updateActiveNavLink();
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// Add form validation feedback
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const isValid = field.checkValidity();
    
    // Remove existing validation classes
    field.classList.remove('valid', 'invalid');
    
    if (value && isValid) {
        field.classList.add('valid');
    } else if (value && !isValid) {
        field.classList.add('invalid');
    }
}

// Initialize form validation after DOM load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupFormValidation, 1000);
});

// Add loading states for form submissions
function showLoading(button) {
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 1000);
}

// Debug function to check if all sections exist
function debugSections() {
    const sections = ['home', 'about', 'projects', 'contact', 'admin'];
    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        console.log(`Section ${sectionId}:`, element ? 'Found' : 'Not found');
    });
}

// Call debug function after DOM load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(debugSections, 500);
});

// Ensure floating shapes are visible and animated
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const shapes = document.querySelectorAll('.shape');
        console.log('Found shapes:', shapes.length);
        shapes.forEach((shape, index) => {
            shape.style.opacity = '0.3';
            shape.style.display = 'block';
            shape.style.position = 'absolute';
            shape.style.zIndex = '1';
            console.log(`Shape ${index + 1} configured`);
        });
    }, 500);
});

// Expose global functions for HTML onclick events
window.scrollToSection = scrollToSection;
window.deleteProject = deleteProject;