/* ════════════════════════════════════════════════════════
   ANKUR BISHNOI | GODMODE ANIMATION ENGINE
   ════════════════════════════════════════════════════════ */

// 1. Setup Smooth Scrolling (Lenis)
const lenis = new Lenis({
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
  smooth: true,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000) });
gsap.ticker.lagSmoothing(0);

// Helper: Split text into spans for animation
function splitTextWords(selector) {
  document.querySelectorAll(selector).forEach(el => {
    const words = el.innerText.split(" ");
    el.innerHTML = "";
    words.forEach(word => {
      const span = document.createElement("span");
      span.innerHTML = word + "&nbsp;";
      span.classList.add("word");
      el.appendChild(span);
    });
  });
}
splitTextWords(".split-text");
splitTextWords(".split-lines");

// 2. Custom Magnetic Cursor
const cursor = document.querySelector('.cursor');
if (window.innerWidth > 768) {
  window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { 
        x: e.clientX, 
        y: e.clientY, 
        duration: 0.1,
        ease: "power2.out"
    });
  });

  // Cursor scaling on links
  document.querySelectorAll('a, .proj-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(4)');
    el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
  });
}

// 3. Preloader Intro Timeline
let introTl = gsap.timeline({
  onComplete: () => document.body.classList.remove("loading")
});

let counter = { val: 0 };
introTl.to(counter, {
  val: 100, duration: 2, ease: "power2.inOut",
  onUpdate: function() {
    document.querySelector('.preloader-counter').innerHTML = Math.round(counter.val) + "%";
  }
})
.to(".preloader", {
  yPercent: -100, duration: 1.2, ease: "expo.inOut"
})
.set(".mega-bg-img", { opacity: 1 })
.fromTo(".mega-bg-img", { scale: 1.6, filter: "brightness(0)" }, { scale: 1, filter: "brightness(0.6)", duration: 2.5, ease: "power3.out" }, "-=0.5")
.fromTo(".mega-fg-inner", { width: "100vw", height: "100vh", borderRadius: "0px" }, { width: "100vw", height: "100vh", borderRadius: "0px", duration: 1 }, "-=1.5")
.to(".mega-text", { opacity: 1, y: -20, duration: 1.5, ease: "power2.out" }, "-=1");


// 4. HERO GODMODE SCROLL TRIGGER
ScrollTrigger.matchMedia({
  "(min-width: 769px)": function() {
    let heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".mega-hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: true,
      }
    });

    heroTl.to(".mega-fg-inner", {
      width: "30vw",
      height: "45vw",
      borderRadius: "30px",
      y: "10vh", 
      ease: "power2.inOut"
    }, 0);

    heroTl.to(".mega-bg-img", {
      scale: 1.3,
      filter: "brightness(0.9) blur(5px)",
      ease: "power1.inOut"
    }, 0);

    heroTl.to(".mega-text", {
      scale: 2,
      letterSpacing: "4vw",
      opacity: 0,
      ease: "power2.inOut"
    }, 0);

    heroTl.to(".scroll-down-hint", { opacity: 0 }, 0);
  }
});


// 5. INTRO KINETIC TEXT REVEAL
gsap.from(".intro-section .word", {
  scrollTrigger: {
    trigger: ".intro-section",
    start: "top 75%",
  },
  rotationX: 110,
  y: 120,
  z: -600,
  opacity: 0,
  stagger: 0.08,
  duration: 1.8,
  ease: "expo.out"
});

// 6. SKILLS 3D ARSENAL Reveal
let skillsTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".skills-3d",
    start: "top top",
    end: "bottom top",
    scrub: 1,
    pin: ".skills-sticky"
  }
});

skillsTl.to(".sara-vibe", { filter: "grayscale(0%) contrast(1) drop-shadow(0 0 20px #39FF14)", scale: 1.15, duration: 1 }, 0);

skillsTl.fromTo(".top-left", { x: -300, opacity: 0, rotateZ: -15 }, { x: 0, opacity: 1, rotateZ: -10, duration: 1 }, 0.2);
skillsTl.fromTo(".bottom-right", { x: 300, opacity: 0, rotateZ: 15 }, { x: 0, opacity: 1, rotateZ: -10, duration: 1 }, 0.4);
skillsTl.fromTo(".top-right", { y: -300, opacity: 0, rotateX: 45 }, { y: 0, opacity: 1, rotateX: 0, duration: 1 }, 0.6);
skillsTl.fromTo(".bottom-left", { y: 300, opacity: 0, rotateX: -45 }, { y: 0, opacity: 1, rotateX: 0, duration: 1 }, 0.8);

// 7. HORIZONTAL PROJECTS GALLERY
const horizontalWrapper = document.querySelector('.horizontal-wrapper');
if (horizontalWrapper) {
    gsap.to(horizontalWrapper, {
      x: () => -(horizontalWrapper.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: ".projects-horizontal",
        start: "top top",
        end: () => "+=" + (horizontalWrapper.scrollWidth - window.innerWidth),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });
}

// Hover Parallax on Project Images
document.querySelectorAll(".proj-img-wrap").forEach(wrap => {
  wrap.addEventListener("mousemove", (e) => {
    if(window.innerWidth <= 768) return;
    const { left, top, width, height } = wrap.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 40;
    const y = ((e.clientY - top) / height - 0.5) * 40;
    gsap.to(wrap.querySelector("img"), { x: x, y: y, scale: 1.2, duration: 0.6, ease: "power2.out" });
  });
  wrap.addEventListener("mouseleave", () => {
    gsap.to(wrap.querySelector("img"), { x: 0, y: 0, scale: 1, duration: 0.6, ease: "power2.out" });
  });
});

// 8. POPUP SYSTEM
const popup = document.querySelector('.insane-popup');
const popupBg = document.querySelector('.insane-popup-bg');
const popupContent = document.querySelector('.insane-popup-content');
const popupClose = document.querySelector('.popup-close');
const popupImg = document.querySelector('.popup-img');
const popupTitle = document.querySelector('.popup-title');
const popupDesc = document.querySelector('.popup-desc');

document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('click', () => {
    const imgSrc = card.querySelector('img').src;
    const title = card.querySelector('h3').innerText;
    const desc = card.querySelector('p').innerText;
    
    popupImg.src = imgSrc;
    popupTitle.innerText = title;
    popupDesc.innerText = desc;

    popup.classList.add('active');
    lenis.stop();

    const popTl = gsap.timeline();
    popTl.to(popupBg, { opacity: 1, duration: 0.5 })
         .to(popupContent, { 
            scale: 1, 
            rotationY: 0, 
            z: 0, 
            opacity: 1, 
            duration: 1, 
            ease: "power4.out" 
         }, "-=0.2");
  });
});

popupClose.addEventListener('click', () => {
  const popTl = gsap.timeline({
    onComplete: () => {
      popup.classList.remove('active');
      lenis.start();
    }
  });
  popTl.to(popupContent, { scale: 0.8, opacity: 0, duration: 0.4 })
       .to(popupBg, { opacity: 0, duration: 0.3 }, "-=0.2");
});

// 9. FINAL CONTACT REVEAL
gsap.from(".contact-ultra .word", {
  scrollTrigger: {
    trigger: ".contact-ultra",
    start: "top 85%",
  },
  y: 80,
  opacity: 0,
  stagger: 0.05,
  ease: "power3.out",
  duration: 1.2
});
