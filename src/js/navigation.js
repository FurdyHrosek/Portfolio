export default class Navigation {
    constructor() {
        this.handleNavigation();
    }

    handleNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');
        const header = document.querySelector('header');

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
            setTimeout(() => {
                section.classList.add('shown');
            }, 300);
        };

        const removeShownClass = (section) => {
            setTimeout(() => {
                section.classList.remove('shown');
            }, 300);
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
                removeShownClass(section);
            });
        });
    }
}
