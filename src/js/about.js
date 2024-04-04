import { skills } from './_config.js';
import { homeAppearanceDelay } from './_config.js';
import { progressAnimationDuration } from './_config.js';

import Helpers from './_helpers.js';

export default class About {
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
    
        console.log("Progress bar animation started");
    
        languages.forEach(language => {
            const percentage = parseInt(language.querySelector('.language-progress').textContent);
            const progressBar = language.querySelector('.progress-bar');
            const initialWidth = 0;
            const finalWidth = percentage;
    
            let startTime;
    
            function startAnimation() {
                startTime = performance.now();
                requestAnimationFrame(loadingAnimation);
            }
    
            function loadingAnimation(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / progressAnimationDuration, 1);
                const newWidth = initialWidth + (finalWidth - initialWidth) * progress;
    
                progressBar.style.width = newWidth + '%';
    
                if (progress < 1) {
                    requestAnimationFrame(loadingAnimation);
                }
            }
    
            const observer = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    setTimeout(startAnimation, homeAppearanceDelay);
                    observer.unobserve(language);
                }
            });
    
            observer.observe(language);
        });
    }
    
    
}
