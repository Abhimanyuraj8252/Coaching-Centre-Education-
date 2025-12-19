// DOM Elements
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const overlay = document.getElementById('overlay');
const admissionForm = document.getElementById('admissionForm');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModal');

// Sticky Glass Navbar & Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('glass-nav');
    } else {
        navbar.classList.remove('glass-nav');
    }
});

// Mobile Menu Toggle logic
function toggleMenu() {
    const isOpen = !mobileMenu.classList.contains('translate-x-full');

    if (isOpen) {
        // Closing
        mobileMenu.classList.add('translate-x-full');
        overlay.classList.add('hidden', 'opacity-0');
        overlay.classList.remove('opacity-100');
        document.body.style.overflow = '';
    } else {
        // Opening
        mobileMenu.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        // Small delay to allow display:block to apply before opacity transition
        setTimeout(() => {
            overlay.classList.remove('opacity-0');
            overlay.classList.add('opacity-100');
        }, 10);
        document.body.style.overflow = 'hidden';
    }
}

mobileMenuBtn.addEventListener('click', toggleMenu);
closeMenuBtn.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', toggleMenu);
});

// Scroll Reveal Animation (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
});

// Number Counter Animation
const counters = document.querySelectorAll('.counter');
let hasCounted = false;

const startCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps

        let current = 0;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current) + "+";
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target + "+";
            }
        };
        updateCounter();
    });
};

// Use Intersection Observer for Counters too
const counterSection = document.getElementById('counter-section');
if (counterSection) {
    new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
            startCounters();
            hasCounted = true;
        }
    }, { threshold: 0.5 }).observe(counterSection);
}

// Form Validation and Submission
admissionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name');
    const mobile = document.getElementById('mobile');
    const course = document.getElementById('course');
    const submitBtn = admissionForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');

    let isValid = true;

    // Helper to set error
    const setError = (el, id, hasError) => {
        const errorMsg = document.getElementById(id);
        if (hasError) {
            el.classList.add('error');
            errorMsg.classList.remove('hidden');
            isValid = false;
        } else {
            el.classList.remove('error');
            errorMsg.classList.add('hidden');
        }
    };

    // Validation logic
    setError(name, 'nameError', name.value.trim() === '');
    setError(mobile, 'mobileError', !/^\d{10}$/.test(mobile.value.trim()));
    setError(course, 'courseError', course.value === '');

    if (isValid) {
        // Show loading state
        submitBtn.disabled = true;
        btnText.textContent = "Sending...";
        spinner.classList.remove('hidden');

        // Formsubmit.co AJAX logic
        fetch("https://formsubmit.co/ajax/gamingwarrior961@gmail.com", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: "New Admission Inquiry!",
                name: name.value,
                mobile: mobile.value,
                course: course.value
            })
        })
            .then(response => response.json())
            .then(data => {
                // Success State
                submitBtn.disabled = false;
                btnText.textContent = "Submit Application";
                spinner.classList.add('hidden');
                admissionForm.reset();

                // Show Success Modal
                successModal.classList.remove('hidden');
                setTimeout(() => {
                    successModal.classList.add('modal-active');
                }, 10);
            })
            .catch(error => {
                // Error State
                submitBtn.disabled = false;
                btnText.textContent = "Submit Application";
                spinner.classList.add('hidden');
                alert('Failed to send application. Please check your internet connection.');
                console.error('Submission Error:', error);
            });
    }
});

// Close Modal Logic
const hideModal = () => {
    successModal.classList.remove('modal-active');
    setTimeout(() => {
        successModal.classList.add('hidden');
    }, 300); // Wait for transition
};

closeModalBtn.addEventListener('click', hideModal);
document.getElementById('modalBackdrop').addEventListener('click', hideModal);
