import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import styles from "./hero.module.css";

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

function Hero() {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const ctaRef = useRef(null);
  const wordsRef = useRef([
    "an Aviation Expert",
    "a Software Developer",
    "a Project Manager",
    "a Tech Innovator",
  ]);

  useEffect(() => {
    if (!heroRef.current || !textRef.current || !ctaRef.current) return;

    // Hero section entrance animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(heroRef.current, { opacity: 0, y: 80, duration: 1.4 })
      .from(textRef.current, { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
      .from(ctaRef.current, { opacity: 0, y: 20, duration: 0.8 }, "-=0.4");

    // Text rotation animation
    let currentIndex = 0;
    const animateText = () => {
      gsap.to(textRef.current, {
        duration: 0.8,
        text: wordsRef.current[currentIndex],
        ease: "power2.inOut",
        onComplete: () => {
          currentIndex = (currentIndex + 1) % wordsRef.current.length;
          gsap.delayedCall(2, animateText);
        },
      });
    };
    animateText();

    return () => gsap.killTweensOf([textRef.current, ctaRef.current]);
  }, []);

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
