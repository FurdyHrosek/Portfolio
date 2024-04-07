import { globalTransition,
         homeAppearanceDelay, 
         hackerEffectInterval } from '../_config.js';

export default class Header {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        this.header = document.querySelector('header');

        this.isHomeSection = true;

        this.setupNavigation();
        this.scrollOnNavigationClick();
        this.hackerEffect();
    }

    /**
     * Mouseover effect for nav links to show changing letters until they reach original text
     */
    hackerEffect() {
        const letters = 'abcdefghijklmnopqrstuvwxyz'; 
    
        this.navLinks.forEach(navLink => {
            navLink.addEventListener('mouseover', event => {
                const isActiveLink = navLink.parentElement.classList.contains('active');

                if (isActiveLink) return;
                
                let iterations = 0;
    
                if (!navLink.dataset.originalText) {
                    navLink.dataset.originalText = navLink.innerText;
                }
    
                const words = navLink.dataset.originalText.split(' ');
                const initialWords = [...words]; 
            
                const interval = setInterval(() => {
                    event.target.innerText = initialWords
                        .map(word => {
                            const slicedWord = word.slice(0, iterations);
                            const randomLetters = Array.from({ length: word.length - iterations }, 
                                () => letters[Math.floor(Math.random() * 26)]);
                            return slicedWord + randomLetters.join('');
                        })
                        .join(' ');
            
                    if (iterations >= words.reduce((acc, word) => acc + word.length, 0)) {
                        clearInterval(interval);
                    }
            
                    iterations += 1;
                }, hackerEffectInterval);
    
                navLink.addEventListener('mouseleave', () => {
                    clearInterval(interval);
                    event.target.innerText = navLink.dataset.originalText;
                });
            });
        });
    }
    
    
    /**
     * Scroll to top on nav link click
     */
    scrollOnNavigationClick() {
        this.navLinks.forEach(navLink => {
            navLink.addEventListener('click', (event) => {
                event.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
    }
    
    
    /**
     * Setup navigation
     */
    setupNavigation() {
        this.sections.forEach(section => {
            section.style.display = 'none';
        });

        this.navLinks.forEach(navLink => {
            navLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigationClick(navLink);
            });
        });

        const homeLink = document.querySelector('.nav-link[href="#home"]');
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleHomeLinkClick(homeLink);
        });
    }


    /**
     * Handle click on any navigation link
     */
    handleNavigationClick(navLink) {
        const targetSectionID = navLink.getAttribute('href').substring(1);
        this.hideAllSections(homeAppearanceDelay, globalTransition);
        
        const targetSection = document.getElementById(targetSectionID);
        
        if (targetSection) {
            this.showSection(targetSection);
            this.toggleHeaderTopClass(targetSectionID);
            this.removeActiveClass();
            this.addActiveClass(navLink);
            this.isHomeSection = navLink === document.querySelector('.nav-link[href="#home"]');
        }
    }


    /**
     * Handle click on home link
     */
    handleHomeLinkClick(homeLink) {
        this.header.classList.remove('header-top');
        this.removeActiveClass();
        this.addActiveClass(homeLink);
        this.hideAllSections(homeAppearanceDelay, 0);
        this.isHomeSection = true;
    }


    /**
     * Show or Hide all sections
     */
    hideAllSections(delayTime, fadingDelay) {
        this.sections.forEach(section => {
            if (section.classList.contains('visible')) {
                this.handleSectionFadingClass(section, fadingDelay);
            }

            section.style.display = 'none';
            this.removeVisibleClass(section, delayTime);
        });
    }

    showSection(section) {
        section.style.display = 'block';
        this.addVisibleClass(section, homeAppearanceDelay);
    }


    /**
     * Toggle header-top class for header
     */
    toggleHeaderTopClass(targetSectionId) {
        this.header.classList.toggle('header-top', targetSectionId !== 'home');
    }


    /**
     * Remove active class for current active nav link
     */
    removeActiveClass() {
        this.navLinks.forEach(navLink => {
            navLink.parentElement.classList.remove('active');
        });
    }

    /**
     * Add active class for current active nav link
     */
    addActiveClass(link) {
        link.parentElement.classList.add('active');
    }


    /**
     * Handle fading class when switching to another section
     */
    handleSectionFadingClass(section, delay) {
        section.classList.add('fading');

        this.removeVisibleClass(section, globalTransition)

        setTimeout(() => {
            section.classList.remove('fading');
        }, delay)
    }   


    /**
     * Remove visible class for current active section
     */
    removeVisibleClass(section, delayTime = 0) {
        const delay = this.isHomeSection ? delayTime : 0;
        setTimeout(() => {
            section.classList.remove('visible');
        }, delay);
    }

    /**
     * Add visible class for current active section
     */
    addVisibleClass(section, delayTime) {
        const delay = this.isHomeSection ? delayTime : 0;
        setTimeout(() => {
            section.classList.add('visible');
        }, delay);
    }
}
