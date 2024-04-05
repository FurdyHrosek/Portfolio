import { workOriginalHeight, workAnimationDuration } from './_config.js';

export default class Resume {
    constructor() {
        this.trees = document.querySelectorAll('.tree');

        this.handleVisibleTree();
        this.handleInfoboxParity();
        this.setupTreeHelpers();
    }


    /**
     * Setup hover effect on work-helper elements
     */
    setupTreeHelpers() {
        const treeHelpers = document.querySelectorAll('.tree-helper');
        treeHelpers.forEach(workHelper => {
            const closestWork = workHelper.closest('.tree');

            workHelper.addEventListener('mouseover', event => {
                this.handleMouseOver(event, closestWork, workHelper);
            });

            workHelper.addEventListener('mouseout', event => {
                this.handleMouseOut(event, closestWork, workHelper);
            });
        });

        const workPositions = document.querySelectorAll('.work-position');
        workPositions.forEach(workPosition => {
            const closestWork = workPosition.closest('.tree');
            const closestWorkHelper = closestWork.querySelector('.tree-helper')

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
        const workDesc = event.target.closest('.tree').querySelector('.work-description');

        if (!workDesc) return;

        const workDescWrapper = workDesc.querySelector('.work-description-wrapper');

        const workDescHeight = this.getWorkDescriptionHeight(workDesc);
    
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
        const workDescription = event.target.closest('.tree').querySelector('.work-description');
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
        const currentIndex = [...this.trees].indexOf(currentWork);
    
        for (let i = currentIndex + 1; i < this.trees.length; i++) {
            const work = this.trees[i];
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

        this.trees.forEach(work => {
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
        this.trees.forEach((infobox, index) => 
            infobox.classList.add(index % 2 === 0 ? 'even' : 'odd'));
    }


    /**
     * Handle visible tree class based on clicked tree button
     */
    handleVisibleTree() {
        const resumeButtons = document.querySelectorAll('.resume-btn');
        const treeContents = document.querySelectorAll('.tree-content');
    
        resumeButtons.forEach(button => {
            button.addEventListener('click', event => {
                const targetId = event.target.getAttribute('data-target');
                if (targetId) {
                    resumeButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });
                    event.target.classList.add('active');
                    
                    treeContents.forEach(content => {
                        content.classList.remove('visible');
                    });
                    document.getElementById(targetId).classList.add('visible');
                }
            });
        });
    }
}