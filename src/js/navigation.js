export default class Header {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        this.header = document.querySelector('header');

        this.isHomeSection = true;
        this.sectionAppearanceDelay = 250;

        this.setupNavigation();
    }

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

    handleNavigationClick(navLink) {
        const targetSectionId = navLink.getAttribute('href').substring(1);
        this.hideAllSections();
        const targetSection = document.getElementById(targetSectionId);
        
        if (targetSection) {
            this.showSection(targetSection);
            this.toggleHeaderTop(targetSectionId);
            this.removeActiveClass();
            this.addActiveClass(navLink);
            this.isHomeSection = navLink === document.querySelector('.nav-link[href="#home"]');
        }
    }

    handleHomeLinkClick(homeLink) {
        this.header.classList.remove('header-top');
        this.removeActiveClass();
        this.addActiveClass(homeLink);
        this.hideAllSections();
        this.isHomeSection = true;
    }

    hideAllSections() {
        this.sections.forEach(section => {
            section.style.display = 'none';
            this.removeShownClass(section, this.sectionAppearanceDelay);
        });
    }

    showSection(section) {
        section.style.display = 'block';
        this.addShownClass(section);
    }

    toggleHeaderTop(targetSectionId) {
        this.header.classList.toggle('header-top', targetSectionId !== 'home');
    }

    removeActiveClass() {
        this.navLinks.forEach(navLink => {
            navLink.parentElement.classList.remove('active');
        });
    }

    addActiveClass(link) {
        link.parentElement.classList.add('active');
    }

    addShownClass(section) {
        const delay = this.isHomeSection ? this.sectionAppearanceDelay : 0;
        setTimeout(() => {
            section.classList.add('shown');
        }, delay);
    }

    removeShownClass(section, delay = 0) {
        const delayTime = this.isHomeSection ? delay : 0;
        setTimeout(() => {
            section.classList.remove('shown');
        }, delayTime);
    }
}
