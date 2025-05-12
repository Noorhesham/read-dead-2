import { logoData } from "./logo";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const heroImgContainer = document.querySelector(".hero-img-container");
  const heroImgLogo = document.querySelector(".hero-img-logo");
  const heroImgCopy = document.querySelector(".hero-img-copy");
  const fadeOverlay = document.querySelector(".fade-overlay");
  const svgOverlay = document.querySelector(".overlay");
  const overlayCopy = document.querySelector("h1");
  const aurthurMorgan = document.querySelector(".quote-author");
  const initialOverlayScale = 211;
  const logoContainer = document.querySelector(".logo-container");
  const logoMask = document.getElementById("logoMask");
  /**في عناصر SVG، خاصية d تعني data أو path data.
هي المسؤولة عن رسم الشكل (المسار) في عنصر <path> داخل SVG.
يعني الكود ده:
 */
  logoMask.innerHTML = logoData;

  // Also populate the colored logo with the same data
  const coloredLogoContent = document.getElementById("coloredLogoContent");
  coloredLogoContent.innerHTML = logoData;

  // Apply original colors to elements in the colored logo

  const logoDimensions = logoContainer.getBoundingClientRect(); // the size of the logo container that has width and height
  const logoBoundingBox = logoMask.getBBox(); // the area of the logo

  const horizontalScaleRatio = logoDimensions.width / logoBoundingBox.width;
  // the ratio of the width of the logo container to the width of the logo
  const verticalScaleRatio = logoDimensions.height / logoBoundingBox.height;
  // the ratio of the height of the logo container to the height of the logo
  const logoScaleFactor = Math.min(horizontalScaleRatio, verticalScaleRatio);
  // the scale factor of the logo

  const logoHorizontalPosition =
    logoDimensions.left +
    (logoDimensions.width - logoBoundingBox.width * logoScaleFactor) / 2 -
    logoBoundingBox.x * logoScaleFactor;
  const logoVerticalPosition =
    logoDimensions.top +
    (logoDimensions.height - logoBoundingBox.height * logoScaleFactor) -
    logoBoundingBox.y * logoScaleFactor;

  logoMask.setAttribute(
    "transform",
    `translate(${logoHorizontalPosition}, ${logoVerticalPosition + 40}) scale(${logoScaleFactor})`
  );

  // Position the colored logo in the same place
  const coloredLogo = document.getElementById("coloredLogo");
  coloredLogo.setAttribute(
    "transform",
    `translate(${logoHorizontalPosition}, ${logoVerticalPosition + 40}) scale(${logoScaleFactor})`
  );

  gsap.to(document.getElementById("logoReveal"), {
    opacity: 0,
  });
  ScrollTrigger.create({
    trigger: ".hero",
    start: "top top",
    end: `+=${window.innerHeight * 5}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,

    onUpdate: (self) => {
      const scrollProgress = self.progress;
      const fadeOpacity = 1 - scrollProgress * (1 / 0.15);
      const fillAnimation = 1 - scrollProgress * (1 / 0.3);

      console.log(fadeOpacity);
      if (scrollProgress <= 0.15) {
        gsap.set([heroImgLogo, heroImgCopy], {
          opacity: fadeOpacity,
        });
      } else {
        gsap.set([heroImgLogo, heroImgCopy], {
          opacity: 0,
        });
      }
      let fillOpacity = 0;

      // Animation for logoReveal in first 1/3 of scroll
      if (scrollProgress >= 0.2 && scrollProgress <= 0.4) {
        // Calculate fill progress from 0 to 1 between 0.2 and 0.4
        const fillProgress = (scrollProgress - 0.2) / (0.4 - 0.2);

        // Create a color transition from transparent to #111117
        const r = 17; // From #111117
        const g = 17;
        const b = 23;
        const a = fillProgress; // Alpha from 0 to 1

        gsap.to(document.getElementById("logoReveal"), {
          opacity: 1, // Keep opacity at 1
          fill: `rgba(${r}, ${g}, ${b}, ${a})`, // Use rgba to animate the fill transparency
          duration: 0.1,
        });
      } else if (scrollProgress < 0.2) {
        // Make fill transparent when below 0.2
        gsap.to(document.getElementById("logoReveal"), {
          opacity: 1, // Keep opacity at 1
          fill: "rgba(17, 17, 23, 0)", // Transparent version of #111117
          duration: 0.1,
        });
      } else if (scrollProgress > 0.4) {
        // Keep fill solid when above 0.4
        gsap.to(document.getElementById("logoReveal"), {
          opacity: 1,
          fill: "#111117",
          duration: 0.1,
        });
      }

      // Reveal colored logo animation - starts between 0.8 and 1.0
      if (scrollProgress >= 0.8 && scrollProgress <= 1.0) {
        // Calculate reveal progress
        const revealProgress = (scrollProgress - 0.8) / 0.2;

        // Reveal the colored logo
        gsap.to(coloredLogo, {
          opacity: revealProgress,
          duration: 0.1,
        });
      } else if (scrollProgress < 0.8) {
        // Hide colored logo
        gsap.to(coloredLogo, {
          opacity: 0,
          duration: 0.1,
        });
      }

      if (scrollProgress <= 0.85) {
        /**
         * 🔍 شرح:

scrollProgress هو رقم من 0 لـ 1 بيعبر عن قد إيه المستخدم سكرول.

بنضربه في 1 / 0.85 ≈ 1.176 علشان نطبع التقدم كأنه بيكمل لحد 100% جوه 85%.

يعني مثلًا:

لو scrollProgress = 0.425 ➜ normalizedProgress = 0.5 ➜ في نص التراك ده.

لو scrollProgress = 0.85 ➜ normalizedProgress = 1.

كأننا بنقول: “ابدأ الانيميشن من 0 لحد 1 جوه أول 85% من الصفحة”.
         */
        const normalizedProgress = scrollProgress * (1 / 0.85); //the progress of the scroll according to the last 0.85 of the scroll
        const heroImgContainerScale = 1.5 - 0.5 * normalizedProgress; //the scale of the hero img container
        const overlayScale = initialOverlayScale * Math.pow(1 / initialOverlayScale, normalizedProgress); //the scale of the overlay
        let fadeOverlayOpacity = 0;

        gsap.set(heroImgContainer, {
          scale: heroImgContainerScale,
        });

        gsap.set(svgOverlay, {
          scale: overlayScale,
        });

        if (scrollProgress >= 0.25) {
          fadeOverlayOpacity = Math.min(1, (scrollProgress - 0.25) * (1 / 0.4));
        }

        gsap.set(fadeOverlay, {
          opacity: fadeOverlayOpacity,
        });
      }

      if (scrollProgress >= 0.6 && scrollProgress <= 0.85) {
        const overlayCopyRevealProgress = (scrollProgress - 0.6) * (1 / 0.25);

        const gradientSpread = 100;
        const gradientBottomPosition = 240 - overlayCopyRevealProgress * 280;
        const gradientTopPosition = gradientBottomPosition - gradientSpread;
        const overlayCopyScale = 1.25 - 0.25 * overlayCopyRevealProgress;
        const aurthurMorgan = document.querySelector(".quote-author");
        aurthurMorgan.style.background = `linear-gradient(to bottom, #111117 0%, #111117 ${gradientTopPosition}%,rgb(255, 255, 255) ${gradientBottomPosition}%,rgb(172, 132, 132) 100%)`;
        aurthurMorgan.style.backgroundClip = "text";
        overlayCopy.style.background = `linear-gradient(to bottom, #111117 0%, #111117 ${gradientTopPosition}%, #8B0000 ${gradientBottomPosition}%, #8B0000 100%)`;
        overlayCopy.style.backgroundClip = "text";

        gsap.set(overlayCopy, {
          scale: overlayCopyScale,
          opacity: overlayCopyRevealProgress,
        });
      } else if (scrollProgress < 0.6) {
        gsap.set(overlayCopy, {
          opacity: 0,
        });
      }
    },
  });
});
