import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import styles from "./hero.module.css";

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

/**
 * Hero Component
 * This component creates a hero section for the portfolio with animated text
 * and entrance effects using GSAP. It includes a title, dynamic subtitle with
 * rotating text, and call-to-action buttons.
 */
function Hero() {
  const heroRef = useRef(null); // Reference to the hero section element
  const textRef = useRef(null); // Reference to the animated text span
  const ctaRef = useRef(null); // Reference to the CTA button container
  const wordsRef = useRef([
    "an Aviation Expert",
    "a Software Developer",
    "a Project Manager",
    "a Tech Innovator",
  ]); // Array of rotating text words

  /**
   * Animation Effect
   * Sets up GSAP animations for the hero section entrance and text rotation
   * when the component mounts, with cleanup on unmount.
   */
  useEffect(() => {
    if (!heroRef.current || !textRef.current || !ctaRef.current) return; // Exit if refs are not available

    // Hero section entrance animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } }); // Create timeline with easing
    tl.from(heroRef.current, { opacity: 0, y: 80, duration: 1.4 }) // Animate hero section entrance
      .from(textRef.current, { opacity: 0, y: 20, duration: 0.8 }, "-=0.6") // Animate text entrance with delay
      .from(ctaRef.current, { opacity: 0, y: 20, duration: 0.8 }, "-=0.4"); // Animate CTA entrance with delay

    // Text rotation animation
    let currentIndex = 0; // Initialize index for word rotation
    const animateText = () => {
      gsap.to(textRef.current, {
        duration: 0.8, // Animation duration
        text: wordsRef.current[currentIndex], // Set text to current word
        ease: "power2.inOut", // Apply easing
        onComplete: () => {
          currentIndex = (currentIndex + 1) % wordsRef.current.length; // Move to next word
          gsap.delayedCall(2, animateText); // Schedule next animation after 2 seconds
        },
      });
    };
    animateText(); // Start the text animation

    return () => gsap.killTweensOf([textRef.current, ctaRef.current]); // Cleanup animations on unmount
  }, []); // Empty dependency array for mount-only effect

  return (
    <section
      id="hero"
      ref={heroRef}
      className={`${styles.heroSection} relative flex items-center justify-center min-h-screen`}
    >
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Welcome to My Portfolio</h1>
        <p className={styles.heroSubtitle}>
          I am Zinaw Shiferaw Mekonnen,
          <span ref={textRef} className={styles.animatedText}>
            {wordsRef.current[0]}
          </span>
        </p>
        <div className={styles.buttonContainer} ref={ctaRef}>
          <a href="#skills" className={styles.primaryButton}>
            View My Skills
          </a>
          {/* "Hire Me" CTA positioned prominently */}
          <a
            href="#contact"
            className={`${styles.primaryButton} ${styles.hireMeButton}`}
          >
            Hire Me
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
