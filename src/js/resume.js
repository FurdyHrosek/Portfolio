import { workOriginalHeight, workAnimationDuration } from './_config.js';

export default class Resume {
    constructor() {
        this.works = document.querySelectorAll('.work');
        this.workHelpers = document.querySelectorAll('.work-helper');
        this.workPositions = document.querySelectorAll('.work-position');

        this.handleInfoboxParity();
        this.setupWorkHelpers();
    }


    /**
     * Setup hover effect on work-helper elements
     */
    setupWorkHelpers() {
        this.workHelpers.forEach(workHelper => {
            const closestWork = workHelper.closest('.work');

            workHelper.addEventListener('mouseover', event => {
                this.handleMouseOver(event, closestWork, workHelper);
            });

            workHelper.addEventListener('mouseout', event => {
                this.handleMouseOut(event, closestWork, workHelper);
            });
        });

        this.workPositions.forEach(workPosition => {
            const closestWork = workPosition.closest('.work');
            const closestWorkHelper = closestWork.querySelector('.work-helper')

            workPosition.addEventListener('mouseover', event => {
                this.handleMouseOver(event, closestWork, closestWorkHelper);
            });

            workPosition.addEventListener('mouseout', event => {
                this.handleMouseOut(event, closestWork, closestWorkHelper);
            });
        })
    }


    /**
     * Handle mouseover event on work-helper elements
     */
    handleMouseOver(event, closestWork, workHelper) {
        const workDesc = event.target.closest('.work').querySelector('.work-description');
        const workDescWrapper = workDesc.querySelector('.work-description-wrapper');

        const workDescHeight = this.getWorkDescriptionHeight(workDesc);
    
        if (workDesc) {
            workDesc.style.display = 'block';
    
            const offset = this.calculateWorkOffset(closestWork, workDescHeight);

            workDescWrapper.style.maxHeight = '0';
            workDescWrapper.style.overflow = 'hidden';
    
            const newHeight = offset > 0 ? workOriginalHeight + offset : workOriginalHeight;
            workHelper.style.setProperty('--work-helper-height', newHeight + 'px');

            const workDescScrollHeight = workDescWrapper.scrollHeight;
            this.startDescriptionAnimation(workDescWrapper, workDescScrollHeight, workAnimationDuration);
    
            this.moveUpcomingWorks(offset, closestWork);
        }
    }
    

    /**
     * Start animation for work description to slowly appear from top
     */
    startDescriptionAnimation(element, targetHeight, duration) {
        const startTime = performance.now();
    
        const descriptionAnimation = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const newHeight = targetHeight * progress;
    
            element.style.maxHeight = `${newHeight}px`;
    
            if (progress < 1) {
                requestAnimationFrame(descriptionAnimation);
            }
        };
    
        requestAnimationFrame(descriptionAnimation);
    }
    
    
    /**
     * Handle mouseout event on work-helper elements
     */
    handleMouseOut(event, closestWork, workHelper) {
        const workDescription = event.target.closest('.work').querySelector('.work-description');
        if (workDescription) {
            workDescription.style.display = 'none';
            workHelper.style.setProperty('--work-helper-height', workOriginalHeight + 'px');
            this.moveUpcomingWorks(0, closestWork);
        }
    }

    
    /**
     * Move other works by the specified height offset
     */
    moveUpcomingWorks(offset, currentWork) {
        const currentIndex = [...this.works].indexOf(currentWork);
    
        for (let i = currentIndex + 1; i < this.works.length; i++) {
            const work = this.works[i];
            const translateY = offset > 0 ? `translateY(${offset}px)` : '';
            work.style.transform = translateY;
        }
    }    


    /**
     * Display description, get its height and hide it again
     */
    getWorkDescriptionHeight(workDescription) {
        const originalDisplay = workDescription.style.display;
        workDescription.style.display = 'block'; 

        let height = workDescription.dataset.height;

        if (!height) {
            height = workDescription.getBoundingClientRect().height;
            workDescription.dataset.height = height;
        }

        workDescription.style.display = originalDisplay;

        return height;
    }
    

    /**
     * Calculate the offset for moving other works
     */
    calculateWorkOffset(currentWork, descHeight) {
        let foundCurrentWork = false;
        let offset = 0;

        this.works.forEach(work => {
            (!foundCurrentWork && work === currentWork)
                ? foundCurrentWork = true
                : offset = descHeight - workOriginalHeight;
        });

        return offset;
    }


    /**
     * Add even or odd class to infoboxes
     */
    handleInfoboxParity() {
        this.works.forEach((infobox, index) => 
            infobox.classList.add(index % 2 === 0 ? 'even' : 'odd'));
    }
}