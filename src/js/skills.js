import { skills } from './_config.js';
import Helpers from './_helpers.js';

export default class Skills {
    constructor() {
        this.helpers = new Helpers();
        this.skillsParent = document.querySelector('.languages-content');

        this.createSkills(skills);
        this.handleProgressBar();
    }

    createSkills(skillsObject) {
        skillsObject.forEach(skill => {
            const [name, percentage] = skill;
            const skillElement = this.helpers.createDOMElement('div', {
                classes: ['language-wrapper'],
                html: `
                    <div class="language-title">
                        <span class="language-name">${name}</span>
                        <i class="language-progress">${percentage}</i>
                    </div>
                    <div class="progress-bar-wrap">
                        <div class="progress-bar"></div>
                    </div>
                `
            });
            this.skillsParent.appendChild(skillElement);
        });
    }

    handleProgressBar() {
        const languages = document.querySelectorAll('.language-wrapper');

        languages.forEach(language => {
            const percentage = parseInt(language.querySelector('.language-progress').textContent);
            const progressBar = language.querySelector('.progress-bar');
            progressBar.style.width = percentage + '%';
        });
    }
}
