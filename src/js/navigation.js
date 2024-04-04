import { homeAppearanceDelay } from './_config.js';

export default class Header {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        this.header = document.querySelector('header');

        this.isHomeSection = true;

        this.setupNavigation();
        this.hackerEffect();
    }

    /**
     * Mouseover effect for nav links to show changing letters until they reach original text
     */
    hackerEffect() {
        const letters = 'abcdefghijklmnopqrstuvwxyz'; 
    
        this.navLinks.forEach(navLink => {
            navLink.addEventListener('mouseover', event => {
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
                            const randomLetters = Array.from({ length: word.length - iterations }, () => letters[Math.floor(Math.random() * 26)]);
                            return slicedWord + randomLetters.join('');
                        })
                        .join(' ');
            
                    if (iterations >= words.reduce((acc, word) => acc + word.length, 0)) {
                        clearInterval(interval);
                    }
            
                    iterations += 1;
                }, 30);
    
                navLink.addEventListener('mouseleave', () => {
                    clearInterval(interval);
                    event.target.innerText = navLink.dataset.originalText;
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
        this.hideAllSections(homeAppearanceDelay);
        
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
        this.hideAllSections(homeAppearanceDelay);
        this.isHomeSection = true;
    }


    /**
     * Show or Hide all sections
     */
    hideAllSections(delayTime) {
        this.sections.forEach(section => {
            section.style.display = 'none';
            this.removeShownClass(section, delayTime);
        });
    }

    showSection(section) {
        section.style.display = 'block';
        this.addShownClass(section, homeAppearanceDelay);
    }


    /**
     * Toggle header-top class for header
     */
    toggleHeaderTopClass(targetSectionId) {
        this.header.classList.toggle('header-top', targetSectionId !== 'home');
    }


    /**
     * Handle active class for current active nav link
     */
    removeActiveClass() {
        this.navLinks.forEach(navLink => {
            navLink.parentElement.classList.remove('active');
        });
    }

    addActiveClass(link) {
        link.parentElement.classList.add('active');
    }


    /**
     * Handle shown class for current active section
     */
    removeShownClass(section, delayTime = 0) {
        const delay = this.isHomeSection ? delayTime : 0;
        setTimeout(() => {
            section.classList.remove('shown');
        }, delay);
    }

    addShownClass(section, delayTime) {
        const delay = this.isHomeSection ? delayTime : 0;
        setTimeout(() => {
            section.classList.add('shown');
        }, delay);
    }
}
