//Banner Slideshow
let slideIndex = 0;
const slides = document.querySelectorAll(".slide");

function showSlides() {
    slides.forEach(slide => slide.classList.remove("active")); // Hide all slides
    slides[slideIndex].classList.add("active"); // Show current slide

    slideIndex++;
    if (slideIndex >= slides.length) {
        slideIndex = 0; // Reset to first image
    }

    setTimeout(showSlides, 4000); // Change image every 4 seconds
}

// Start Slideshow on Page Load
document.addEventListener("DOMContentLoaded", showSlides);





// Scroll the logos to the left or right
document.querySelector('.left-arrow').addEventListener('click', function() {
    const scrollContainer = document.querySelector('.logos-scroll');
    scrollContainer.scrollBy({
        left: -250, // Adjust the scroll by a certain amount
        behavior: 'smooth',
    });
});

document.querySelector('.right-arrow').addEventListener('click', function() {
    const scrollContainer = document.querySelector('.logos-scroll');
    scrollContainer.scrollBy({
        left: 250, // Adjust the scroll by a certain amount
        behavior: 'smooth',
    });
});




//Promotional Box Scrolling
document.addEventListener("DOMContentLoaded", function() {
    let scrollIndex = 0;
    const promoBoxes = document.querySelectorAll(".promo-box");
    const totalBoxes = promoBoxes.length;
    const visibleBoxes = 3;
    const promotionsContainer = document.querySelector(".size-promotions");
    const boxWidth = promoBoxes[0].offsetWidth + 20;

    function scrollLeft() {
        if (scrollIndex === 0) {
            scrollIndex = totalBoxes - visibleBoxes;
        } else {
            scrollIndex--;
        }
        updateScroll();
    }

    function scrollRight() {
        if (scrollIndex >= totalBoxes - visibleBoxes) {
            scrollIndex = 0;
        } else {
            scrollIndex++;
        }
        updateScroll();
    }

    function updateScroll() {
        const offset = -(scrollIndex * 370);
        promotionsContainer.style.transform = `translateX(${offset}px)`;
    }
    
    // Attach event listeners to buttons
    document.querySelector(".scroll-btn.left").addEventListener("click", scrollLeft);
    document.querySelector(".scroll-btn.right").addEventListener("click", scrollRight);
});





//Newly Released Collections Image Carousel
document.addEventListener("DOMContentLoaded", function () {
    const carousels = document.querySelectorAll(".image-carousel");

    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll(".carousel-image");
        let currentIndex = 0;
        const intervalTime = 3000; // Display time per image
        const transitionDuration = 1000; // Smooth fade transition (1s)

        if (images.length > 1) {
            images[currentIndex].classList.add("active");

            setInterval(() => {
                let nextIndex = (currentIndex + 1) % images.length;

                // Start fading in the next image before the current one disappears
                images[nextIndex].classList.add("next");

                setTimeout(() => {
                    images[currentIndex].classList.remove("active");
                    images[nextIndex].classList.remove("next");
                    images[nextIndex].classList.add("active");

                    currentIndex = nextIndex; // Move to the next image
                }, transitionDuration); // Wait for transition to complete
            }, intervalTime);
        }
    });
});




// Update active links on page load

document.addEventListener('DOMContentLoaded', function() {
    updateActiveLinks();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');
    const profileIcon = document.getElementById('profileIcon');

    if (isLoggedIn) {
        // Hide login and signup buttons
        loginButton.style.display = 'none';
        signupButton.style.display = 'none';
        // Show profile icon
        profileIcon.style.display = 'inline-block';
    } else {
        // Show login and signup buttons
        loginButton.style.display = 'inline-block';
        signupButton.style.display = 'inline-block';
        // Hide profile icon
        profileIcon.style.display = 'none';
    }

    // Add click event to profile icon
    profileIcon.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event from bubbling up
        const logoutContainer = document.getElementById('logoutContainer');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (user) {
            // Toggle logout container visibility
            if (logoutContainer.style.display === 'none') {
                logoutContainer.style.display = 'block';
                // Show user info in logout container
                logoutContainer.innerHTML = `
                    <div style="padding: 10px; border-bottom: 1px solid #eee;">
                        <p style="margin: 0 0 5px 0; font-weight: bold;">${user.fullname}</p>
                        <p style="margin: 0; color: #666; font-size: 12px;">${user.email}</p>
                    </div>
                    <button class="logout-button" id="logoutButton">Logout</button>
                `;
                
                // Add logout functionality
                document.getElementById('logoutButton').addEventListener('click', function() {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('cart')
                    window.location.reload();
                });
            } else {
                logoutContainer.style.display = 'none';
            }
        }
    });

    // Close logout container when clicking anywhere else
    document.addEventListener('click', function() {
        const logoutContainer = document.getElementById('logoutContainer');
        if (logoutContainer) {
            logoutContainer.style.display = 'none';
        }
    });

    // Prevent logout container from closing when clicking inside it
    document.getElementById('logoutContainer')?.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Show/hide button based on scroll position
    window.onscroll = function() {
        scrollFunction();
    };
    
    function scrollFunction() {
        const backToTopBtn = document.getElementById("backToTopBtn");
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTopBtn.style.display = "block";
        } else {
        backToTopBtn.style.display = "none";
        }
    }
    
    // Smooth scroll to top when clicked
    document.getElementById("backToTopBtn").addEventListener("click", function() {
        window.scrollTo({
        top: 0,
        behavior: "smooth"
        });
    });

    // Underline the current page link
    function updateActiveLinks() {
        // Remove active class from all links
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to the current page link
        const currentPage = window.location.pathname.split('/').pop(); // Get the current page
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
});

