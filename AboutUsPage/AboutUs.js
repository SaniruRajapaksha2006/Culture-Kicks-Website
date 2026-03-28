document.addEventListener("DOMContentLoaded", function() {
  // NAVIGATION SETUP
  function setupNavigation() {
      const currentPage = window.location.pathname.split('/').pop();
      const navLinks = document.querySelectorAll('.nav-links a');
      
      navLinks.forEach(link => {
          // Set active link
          if (link.getAttribute('href') === currentPage) {
              link.classList.add('active');
          }
          
          // Smooth scroll for anchor links
          link.addEventListener('click', function(e) {
              if (this.hash !== "") {
                  e.preventDefault();
                  const hash = this.hash;
                  const target = document.querySelector(hash);
                  
                  if (target) {
                      window.scrollTo({
                          top: target.offsetTop - 100,
                          behavior: 'smooth'
                      });
                      history.pushState(null, null, hash);
                  }
              }
          });
      });
  }

  // SCROLL ANIMATIONS
  function setupScrollAnimations() {
      // Set initial state for animated elements
      document.querySelectorAll('.value-box, .team-member').forEach(element => {
          element.style.opacity = '0';
          element.style.transform = 'translateY(30px)';
          element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      });
      
      document.querySelector('.about-image').style.opacity = '0';
      document.querySelector('.about-image').style.transform = 'translateX(-30px)';
      document.querySelector('.about-image').style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      document.querySelector('.about-text').style.opacity = '0';
      document.querySelector('.about-text').style.transform = 'translateX(30px)';
      document.querySelector('.about-text').style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      // Run animation check on load and scroll
      checkAnimations();
      window.addEventListener('scroll', checkAnimations);
  }
  
  function checkAnimations() {
      const elements = document.querySelectorAll('.value-box, .team-member, .about-image, .about-text');
      const windowHeight = window.innerHeight;
      
      elements.forEach(element => {
          const elementPosition = element.getBoundingClientRect().top;
          if (elementPosition < windowHeight - 100) {
              element.style.opacity = '1';
              element.style.transform = 'translateY(0)';
          }
      });
  }

  // CUSTOMER REVIEWS
  async function loadAndDisplayReviews() {
      try {
          const response = await fetch('../Data/Reviews.xml');
          const data = await response.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, "text/xml");
          
          const reviews = xmlDoc.getElementsByTagName("review");
          const reviewsSection = document.createElement('section');
          reviewsSection.className = 'reviews-section';
          reviewsSection.innerHTML = '<h2>Customer Testimonials</h2><div class="reviews-grid"></div>';
          
          const reviewsGrid = reviewsSection.querySelector('.reviews-grid');
          
          Array.from(reviews).forEach(review => {
              const reviewElement = document.createElement('div');
              reviewElement.className = 'review-card';
              reviewElement.innerHTML = `
                  <div class="review-header">
                      <span class="customer">${review.querySelector('customer').textContent}</span>
                      <span class="role">${review.querySelector('role').textContent}</span>
                  </div>
                  <div class="review-rating">
                      ${'★'.repeat(parseInt(review.querySelector('rating').textContent))}
                      ${'☆'.repeat(5 - parseInt(review.querySelector('rating').textContent))}
                  </div>
                  <blockquote class="review-comment">"${review.querySelector('comment').textContent}"</blockquote>
                  <div class="review-date">${review.querySelector('date').textContent}</div>
              `;
              reviewsGrid.appendChild(reviewElement);
          });
          
          document.querySelector('main').appendChild(reviewsSection);
      } catch (error) {
          console.error('Error loading reviews:', error);
      }
  }

  // SCROLL TO TOP BUTTON
  function setupScrollToTop() {
      function handleScroll() {
          const backToTopBtn = document.getElementById("backToTopBtn");
          if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
              backToTopBtn.style.display = "block";
          } else {
              backToTopBtn.style.display = "none";
          }
      }
      
      window.onscroll = handleScroll;
      
      document.getElementById("backToTopBtn").addEventListener("click", function() {
          window.scrollTo({
              top: 0,
              behavior: "smooth"
          });
      });
  }

  // INITIALIZE ALL FUNCTIONALITY
  setupNavigation();
  setupScrollAnimations();
  loadAndDisplayReviews();
  setupScrollToTop();
});