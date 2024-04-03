import { skills } from './_config.js';

import Helpers from './helpers.js';

const helpers = new Helpers();

export default class Skills {
    constructor() {
        this.createSkills(skills);
        this.handleProgressBar();
    }

    createSkills(skillsObject) {
        skillsObject.forEach(skill => {
            const [name, percentage] = skill;
            const skillElement = helpers.createDOMElement('div', {
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

            const skillsParent = document.querySelector('.languages-content');
            skillsParent.appendChild(skillElement);
        });
    }

    handleProgressBar() {
        const languages = document.querySelectorAll('.language-wrapper');

        languages.forEach(language => {
            const percentage = parseInt(language.querySelector('.language-progress').textContent);

            console.log(percentage)

            const progressBar = language.querySelector('.progress-bar');
            progressBar.style.width = percentage + '%';
        });
    }
}
