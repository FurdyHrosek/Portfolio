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
                contentWrapper.parentNode.insertBefore(newModal, contentWrapper);
    
                document.body.classList.add('modal-open');
    
                this.removeModalOnClick(newModal);
            })
            .catch(error => console.error('Error loading project HTML:', error));
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
            project.style.display = 'block';
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
