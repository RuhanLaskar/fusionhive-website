  window.addEventListener('scroll', function () {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });




const statboxes = document.querySelectorAll('.statbox');

statboxes.forEach(statbox => {
  const valueEl = statbox.querySelector('.statbox-value');
  const target = +statbox.getAttribute('data-target');
  // Get speed from data-speed attribute, default to 1 if not set
  const speed = +statbox.getAttribute('data-speed') || 1;

  let count = 0;

  const updateCount = () => {
    const increment = target / (100 / speed);

    if (count < target) {
      count += increment;

      let displayValue;
      if (target >= 1000000000) {
        // Special case: billions → format like "4,8B"
        const billions = (count / 1000000000).toFixed(1).replace('.', ',');
        displayValue = `${billions}B`;
      } else if (target >= 1000) {
        displayValue = Math.floor(count).toLocaleString();
      } else {
        displayValue = Math.floor(count);
      }

      valueEl.textContent = displayValue;
      requestAnimationFrame(updateCount);
    } else {
      // Final value
      if (target >= 1000000000) {
        valueEl.textContent = (target / 1000000000).toFixed(1).replace('.', ',') + 'B+';
      } else {
        valueEl.textContent = target.toLocaleString() + '+';
      }
    }
  };

  updateCount();
});




function initMobileCarousel() {
  if (window.innerWidth > 468) return; // Only for ≤468px

  const container = document.querySelector('.cards-slider');
  const cards = document.querySelectorAll('.service-card');
  const dotsContainer = document.querySelector('.mobile-dots');

  // Clear previous dots if any
  dotsContainer.innerHTML = '';

  // Create dots
  cards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      container.scrollTo({
        left: container.clientWidth * index,
        behavior: 'smooth'
      });
    });
    dotsContainer.appendChild(dot);
  });

  // Update active dot on scroll
  container.addEventListener('scroll', () => {
    const index = Math.round(container.scrollLeft / container.clientWidth);
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  });
}

document.addEventListener('DOMContentLoaded', initMobileCarousel);











/* Recipe Cards Animation
 * Uses Intersection Observer to animate cards when they come into view
 */

// === YouTube Iframe API ===
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let players = {};

function onYouTubeIframeAPIReady() {
    const cards = document.querySelectorAll('.card-content2');

    cards.forEach((card, index) => {
        const videoId = card.getAttribute('data-video-id');
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&showinfo=0`;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;

        card.appendChild(iframe);

        players[videoId] = new YT.Player(iframe, {
            events: {
                'onReady': event => setupHover(card, event.target)
            }
        });
    });
}

function setupHover(container, player) {
    const thumbnail = container.querySelector('.thumbnail2');
    const iframe = container.querySelector('iframe');

    container.addEventListener('mouseenter', () => {
        thumbnail.style.display = 'none';
        iframe.style.display = 'block';
        player.playVideo();
    });

    container.addEventListener('mouseleave', () => {
        player.pauseVideo();
        iframe.style.display = 'none';
        thumbnail.style.display = 'block';
    });
}

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = [
        {
            el: document.querySelector(".card-left2"),
            entryFrom: { x: -300, y: -300, rotate: -75 },
            exitTo: { x: -400, y: 0, rotate: 0 }
        },
        {
            el: document.querySelector(".card-bottom-left2"),
            entryFrom: { x: 0, y: 300, rotate: 75 },
            exitTo: { x: 0, y: -400, rotate: 0 }
        },
        {
            el: document.querySelector(".card-right2"),
            entryFrom: { x: 300, y: -300, rotate: 25 },
            exitTo: { x: 400, y: 0, rotate: 0 }
        }
    ];

    cards.forEach(card => {
        if (!card.el) return;

        // Animate in (scroll into view)
        gsap.fromTo(card.el,
            { 
                x: card.entryFrom.x, 
                y: card.entryFrom.y, 
                opacity: 0, 
                scale: 0.9, 
                rotate: card.entryFrom.rotate 
            },
            {
                x: 0, y: 0, opacity: 1, scale: 1, rotate: 0,
                duration: 0.5,               // faster than before
                ease: "expo.out",            // smoother + faster feel
                scrollTrigger: {
                    trigger: card.el,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play reverse play reverse"
                }
            }
        );

        // Animate out (scatter/disperse)
        ScrollTrigger.create({
            trigger: card.el,
            start: "bottom 20%",
            end: "bottom top",
            onEnter: () => {
                gsap.to(card.el, {
                    x: card.exitTo.x, 
                    y: card.exitTo.y, 
                    opacity: 0, 
                    scale: 0.7, 
                    rotate: card.exitTo.rotate,
                    duration: 0.3,            // faster than before
                    ease: "expo.inOut"        // smooth in and out
                });
            },
            onLeaveBack: () => {
                gsap.to(card.el, {
                    x: card.entryFrom.x, 
                    y: card.entryFrom.y, 
                    opacity: 0, 
                    scale: 0.7, 
                    rotate: card.entryFrom.rotate,
                    duration: 0.3,            // faster than before
                    ease: "expo.inOut"        // smooth in and out
                });
            }
        });
    });
});



/* js for the reels section */

document.querySelectorAll('.mob-frame').forEach(frame => {
  const video = frame.querySelector('video');
  const speakerIcon = frame.querySelector('.speaker-icon');

  speakerIcon.addEventListener('click', () => {
    video.muted = !video.muted;
    speakerIcon.src = video.muted
      ? "https://fusionhive.in/assets/1/speaker-slash.svg"
      : "https://fusionhive.in/assets/1/speaker-high.svg";
  });
});



  document.addEventListener("DOMContentLoaded", function () {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let intervalTime = 3000; // 3 seconds
    let sliderInterval;

    function showTestimonial(index) {
      testimonials.forEach((testimonial, i) => {
        testimonial.classList.remove('active');
        dots[i].classList.remove('active');
      });
      testimonials[index].classList.add('active');
      dots[index].classList.add('active');
    }

    function nextTestimonial() {
      currentIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(currentIndex);
    }

    function startAutoSlide() {
      sliderInterval = setInterval(nextTestimonial, intervalTime);
    }

    function stopAutoSlide() {
      clearInterval(sliderInterval);
    }

    // Click on dots to change testimonial manually
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopAutoSlide();
        showTestimonial(i);
        currentIndex = i;
        startAutoSlide();
      });
    });

    // Optional: pause on hover for better UX
    const slider = document.querySelector('.testimonial-slider');
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // Start autoplay
    startAutoSlide();
  });
