export default class Portfolio {
    constructor() {
        this.portfolioButtons = document.querySelectorAll('.portfolio-btn');
        this.allProjects = document.querySelectorAll('.projects');

        this.handleFilterClick();
    }

    handleFilterClick() {
        this.portfolioButtons.forEach(button => {
            button.addEventListener('click', this.filterProjects.bind(this));
        });
    }

    filterProjects(event) {
        const target = event.target;
        const targetData = target.getAttribute('data-target');

        this.portfolioButtons.forEach(button => {
            button.classList.remove('active');
        });

        target.classList.add('active');

        if (targetData === 'all') {
            this.showProjects(this.allProjects);
        } else {
            const matchingProjects = document.querySelectorAll('.projects-' + targetData);
            this.hideProjects(this.allProjects);
            this.showProjects(matchingProjects);
        }
    }

    showProjects(projects) {
        projects.forEach(project => {
            project.style.display = 'block';
        });
    }

    hideProjects(projects) {
        projects.forEach(project => {
            project.style.display = 'none';
        });
    }
}
