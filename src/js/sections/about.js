import Helpers from '../_helpers.js';
import { skills, 
         homeAppearanceDelay, 
         progressAnimationDuration } from '../_config.js';

export default class About {
    constructor() {
        this.helpers = new Helpers();
        this.skillsParent = document.querySelector('.languages-content');
        this.skillsCreated = false;

        this.createSkills();
        this.handleProgressAnimation();
    }

    /**
     * Animate skills progress bars to load from start til set percentage
     */
    handleProgressAnimation() {
        const languages = document.querySelectorAll('.language-wrapper');

        languages.forEach(language => {
            const percentage = parseInt(language.querySelector('.language-progress').textContent);
            const progressBar = language.querySelector('.progress-bar');
            progressBar.style.width = '0';
            const initialWidth = 0;
            const finalWidth = percentage;

            let startTime;

            const startProgressAnimation = () => {
                startTime = performance.now();
                requestAnimationFrame(progressAnimation);
            }

            const progressAnimation = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / progressAnimationDuration, 1);

                const newWidth = initialWidth + (finalWidth - initialWidth) * progress;
                progressBar.style.width = newWidth + '%';

                if (progress < 1) {
                    requestAnimationFrame(progressAnimation);
                }
            }

            const observer = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    setTimeout(startProgressAnimation, homeAppearanceDelay);
                    observer.unobserve(language);
                }
            });

            observer.observe(language);
        });
    }

    /**
     * Dynamically create skills based on skills object in config.js
     */
    createSkills() {
        if (this.skillsParent.dataset.skillsCreated) {
            return;
        }
    
        skills.forEach(skill => {
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
    
        this.skillsParent.dataset.skillsCreated = true;
    }
}