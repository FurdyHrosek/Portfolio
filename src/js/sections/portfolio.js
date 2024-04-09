import Helpers from '../_helpers.js';

export default class Portfolio {
    constructor() {
        this.helpers = new Helpers();

        this.portfolioButtons = document.querySelectorAll('.portfolio-btn');
        this.projectWrappers = document.querySelectorAll('.projects');
        this.projects = document.querySelectorAll('.project');

        this.setupFilterProjects();
        this.setupProjectModals();
    }


    /**
     * Sets up modals for each project
     */
    setupProjectModals() {
        this.projects.forEach(project => {
            project.addEventListener('click', () => this.openProjectModal(project));
        });
    }


    /**
     * Fetch html based on folder and project name, then create the modal element
     */
    openProjectModal(project) {
        const projectName = project.querySelector('.project-name').textContent;
        const projectType = project.parentElement.parentElement.querySelector('.section-title h2').textContent.toLowerCase().replace('-', '');
    
        const projectHTML = `dist/html/${projectType}/${projectName.toLowerCase()}.html`;
    
        fetch(projectHTML)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch project HTML');
                }
                return response.text();
            })
            .then(html => {
                if (!html.trim()) {
                    throw new Error('Empty HTML content');
                }
    
                const newModal = this.helpers.createDOMElement('div', {
                    classes: ['project-modal']
                });
                newModal.innerHTML = html;
    
                const contentWrapper = document.querySelector('.content-wrapper');
                contentWrapper.prepend(newModal);
                //contentWrapper.parentNode.insertBefore(newModal, contentWrapper);
    
                document.body.classList.add('modal-open');
    
                this.removeModalOnClick(newModal);
                this.modalCarousel();
            })
            .catch(error => console.error('Error loading project HTML:', error));
    }


    modalCarousel() {
        // Select all modal images
        const modalImages = document.querySelectorAll('.modal-img');

        // Get the total number of images
        const totalImages = modalImages.length;

        // Initialize the current image index
        let currentImageIndex = 0;

        // Function to show the current image and hide others
        const showCurrentImage = () => {
            modalImages.forEach((image, index) => {
                if (index === currentImageIndex) {
                    image.classList.add('active');
                } else {
                    image.classList.remove('active');
                }
            });
        };

        // Function to navigate to the next image
        const nextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % totalImages;
            showCurrentImage();
        };

        // Function to navigate to the previous image
        const prevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
            showCurrentImage();
        };

        // Attach event listeners to handle navigation
        document.querySelector('.modal-prev-btn').addEventListener('click', prevImage);
        document.querySelector('.modal-next-btn').addEventListener('click', nextImage);

    }


    /**
     * Remove open modal on close btn click
     */
    removeModalOnClick(modal) {
        const closeBtn = modal.querySelector('.modal-close-btn');

        const closeModal = () => {
            modal.remove();
            document.body.classList.remove('modal-open');

            document.removeEventListener('click', outsideClickHandler);
        };

        const outsideClickHandler = (event) => {
            if (!modal.contains(event.target)) {
                closeModal();
            }
        };
    
        closeBtn.addEventListener('click', () => {
            closeModal();
        });
    
        document.addEventListener('click', outsideClickHandler);
    }


    /**
     * Sets up filtering based on the project type
     */
    setupFilterProjects() {
        this.portfolioButtons.forEach(button => {
            button.addEventListener('click', this.filterProjects.bind(this));
        });
    }


    /**
     * Filter projects based on the project type (eshop, website, games...)
     */
    filterProjects(event) {
        const target = event.target;
        const targetData = target.getAttribute('data-target');

        this.portfolioButtons.forEach(button => {
            button.classList.remove('active');
        });

        target.classList.add('active');

        if (targetData === 'all') {
            this.showProjects(this.projectWrappers);
        } else {
            const matchingProjects = document.querySelectorAll('.projects-' + targetData);
            this.hideProjects(this.projectWrappers);
            this.showProjects(matchingProjects);
        }
    }


    /**
     * Shows every project
     */
    showProjects(projects) {
        projects.forEach(project => {
            project.style.display = 'flex';
        });
    }


    /**
     * Hides every project
     */
    hideProjects(projects) {
        projects.forEach(project => {
            project.style.display = 'none';
        });
    }
}
