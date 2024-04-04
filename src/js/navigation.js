export default class Header {
    constructor() {
        this.handleNavigation();
    }

    handleNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');
        const header = document.querySelector('header');

        let isHomeSection = true;

        sections.forEach(section => {
            section.style.display = 'none';
        });

        const removeActiveClass = () => {
            navLinks.forEach(navLink => {
                navLink.parentElement.classList.remove('active');
            });
        };

        const addActiveClass = (link) => {
            link.parentElement.classList.add('active');
        };

        const addShownClass = (section) => {
            if (isHomeSection) {
                setTimeout(() => {
                    section.classList.add('shown');
                }, 300);
            } else {
                section.classList.add('shown');
            }
        };

        const removeShownClass = (section, delay = 0) => {
            if (isHomeSection) {
                setTimeout(() => {
                    section.classList.remove('shown');
                }, delay);
            } else {
                section.classList.remove('shown');
            }
        };

        navLinks.forEach(navLink => {
            navLink.addEventListener('click', (e) => {
                e.preventDefault();

                const targetSectionId = navLink.getAttribute('href').substring(1);

                sections.forEach(section => {
                    section.style.display = 'none';
                    removeShownClass(section);
                });

                const targetSection = document.getElementById(targetSectionId);

                if (targetSection) {
                    targetSection.style.display = 'block';
                    addShownClass(targetSection);
                    header.classList.toggle('header-top', targetSectionId !== 'home');

                    removeActiveClass();
                    addActiveClass(navLink);
                    isHomeSection = navLink === homeLink;
                }
            });
        });

        const homeLink = document.querySelector('.nav-link[href="#home"]');

        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            header.classList.remove('header-top');
            removeActiveClass();
            addActiveClass(homeLink);

            sections.forEach(section => {
                removeShownClass(section, 300);
            });
            
            isHomeSection = true;
        });
    }
}
