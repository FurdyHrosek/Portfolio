import { globalTransition, 
         treeHeightOffset, 
         treeOriginalHeight, 
         treeAnimationDuration } from '../_config.js';

import Helpers from '../_helpers.js';

export default class Resume {
    constructor() {
        this.helpers = new Helpers();
    
        this.resumeButtons = document.querySelectorAll('.resume-btn');
        this.trees = document.querySelectorAll('.tree');
        this.treeContents = document.querySelectorAll('.tree-content');
        this.treeDescriptions = document.querySelectorAll('.tree-description');
    
        this.shouldTriggerResize = false;
        
        this.handleInfoboxesPositioning();
        this.handleTreePositioning();
        this.handleVisibleTree();
        this.setupTreeHelpers();
        this.setupWindowHandler();
    }

    setupWindowHandler() {
        this.checkWindowWidth();
        
        this.handleWindowResize(true);

        this.resumeButtons.forEach(btn => btn.addEventListener('click', this.resetHelpersHeight.bind(this)))
        
        this.handleWindowResize = this.handleWindowResize.bind(this);

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', event => {
                const targetId = event.target.getAttribute('href').substring(1);

                if (targetId === 'resume') {
                    window.addEventListener('resize', this.handleWindowResize);
                } else {
                    window.removeEventListener('resize', this.handleWindowResize);
                }
            })
        })
    }

    handleWindowResize(force) {
        if (this.shouldTriggerResize || force) {
            this.setResumeTreesHeight();
            this.resetHelpersHeight();
        }
    }

    checkWindowWidth() {
        const windowWidth = window.innerWidth;

        if (windowWidth === 1200) {
            this.shouldTriggerResize = true;
        } else {
            this.shouldTriggerResize = false;
        }

        setTimeout(() => {
            this.checkWindowWidth();
        }, 1000);
    }

    resetHelpersHeight() {
        document.querySelectorAll('.tree-helper').forEach(helper => {
            if (window.innerWidth >= 1199) {
                helper.classList.remove('static');
                helper.style.setProperty('--tree-helper-height', treeOriginalHeight + 'px');
            } else {
                helper.classList.add('static');
                const closeTreeWrapper = helper.parentElement;
                const wrapperHeight = closeTreeWrapper.clientHeight;
    
                helper.style.setProperty('--tree-helper-height', wrapperHeight + 20 + 'px');
            }
        })
    }


    /**
     * Setup hover effect on work-helper elements
     */
    setupTreeHelpers() {
        const treeHelpers = document.querySelectorAll('.tree-helper');
        treeHelpers.forEach(helper => {
            const closeTree = helper.closest('.tree');

            this.createGlowpoint(helper);

            helper.addEventListener('mouseover', event => {
                this.handleMouseOver(event, closeTree, helper);
            });

            helper.addEventListener('mouseout', event => {
                this.handleMouseOut(event, closeTree, helper);
            });
        });

        const treePositions = document.querySelectorAll('.tree-position');
        treePositions.forEach(position => {
            const closeTree = position.closest('.tree');
            const closeTreeHelper = closeTree.querySelector('.tree-helper')

            position.addEventListener('mouseover', event => {
                this.handleMouseOver(event, closeTree, closeTreeHelper);
            });

            position.addEventListener('mouseout', event => {
                this.handleMouseOut(event, closeTree, closeTreeHelper);
            });
        })
    }


    /**
     * Handle mouseover event on work-helper elements
     */
    handleMouseOver(event, closestWork, workHelper) {
        const closeDesc = event.target.closest('.tree').querySelector('.tree-description');

        if (!closeDesc) return;

        this.trees.forEach(tree => {
            if (tree === event.target.closest('.tree')) return;
            tree.classList.add('blocked');
        });

        const workDescWrapper = closeDesc.querySelector('.tree-description-wrapper');

        const workDescHeight = this.getWorkDescriptionHeight(closeDesc);
    
        closeDesc.style.display = 'block';

        clearTimeout(this.mouseOutTimeout);

        const offset = this.calculateWorkOffset(closestWork, workDescHeight);

        workDescWrapper.style.maxHeight = '0';
        workDescWrapper.style.overflow = 'hidden';

        const newHeight = offset > 0 ? treeOriginalHeight + offset : treeOriginalHeight;
        workHelper.style.setProperty('--tree-helper-height', newHeight + 'px');

        const workDescScrollHeight = workDescWrapper.scrollHeight;
        this.startDescriptionAnimation(workDescWrapper, workDescScrollHeight, treeAnimationDuration, 'over');

        this.moveFollowingWorks(offset, closestWork);
    }
    
    
    /**
     * Handle mouseout event on work-helper elements
     */
    handleMouseOut(event, closestWork, workHelper) {
        const closeDesc = event.target.closest('.tree').querySelector('.tree-description');
    
        if (!closeDesc) return;
    
        const workDescWrapper = closeDesc.querySelector('.tree-description-wrapper');
    
        this.mouseOutTimeout = setTimeout(() => {
            closeDesc.style.display = 'none';

            this.trees.forEach(tree => {
                tree.classList.remove('blocked');
            });
        }, globalTransition);
    
        this.startDescriptionAnimation(workDescWrapper, 0, treeAnimationDuration, 'out');
        workHelper.style.setProperty('--tree-helper-height', treeOriginalHeight + 'px');
    
        this.moveFollowingWorks(0, closestWork);
    }


    /**
     * Start animation for work description to slowly appear from top
     */
    startDescriptionAnimation(element, targetHeight, duration, type) {
        const startTime = performance.now();
        const startHeight = parseFloat(element.style.maxHeight.replace('px', ''));
        
        const descriptionAnimation = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            let newHeight;
    
            if (type === 'out') {
                newHeight = startHeight - (startHeight * progress);
            } else if (type === 'over') {
                newHeight = startHeight + ((targetHeight - startHeight) * progress);
            }
    
            element.style.maxHeight = `${newHeight}px`;
    
            if (progress < 1) {
                requestAnimationFrame(descriptionAnimation);
            }
        };
    
        requestAnimationFrame(descriptionAnimation);
    }

    
    /**
     * Move other works by the specified height offset
     */
    moveFollowingWorks(offset, currentWork) {
        const currentIndex = [...this.trees].indexOf(currentWork);
    
        for (let i = currentIndex + 1; i < this.trees.length; i++) {
            const work = this.trees[i];
            const translateY = offset > 0 ? `translateY(${offset}px)` : '';
            work.style.transform = translateY;
        }
    }    


    /**
     * Display description, get its height and revert back to original display
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
                : offset = descHeight - treeOriginalHeight;
        });

        return offset;
    }

    
    /**
     * Creates glowpoint for each tree helper to animate pulsing in SCSS
     */
    createGlowpoint(helper) {
        const glowpoint = this.helpers.createDOMElement('tr', {
            classes: ['glowpoint']
        });
        helper.appendChild(glowpoint);

        for (let i = 1; i <= 10; i++) {
            const styleSpan = this.helpers.createDOMElement('td', {
                style: `--i:${i};`
            });
            glowpoint.appendChild(styleSpan);
        }
    }


    /**
     * Handle visible tree class based on the clicked tree button
     */
    handleVisibleTree() {
        this.resumeButtons.forEach(button => {
            button.addEventListener('click', event => {
                const targetId = event.target.getAttribute('data-target');
                if (targetId) {
                    this.resumeButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });
                    event.target.classList.add('active');
                    
                    this.treeContents.forEach(content => {
                        content.classList.remove('visible');
                    });
                    document.getElementById(targetId).classList.add('visible');
                }

                this.handleTreePositioning();
                this.setResumeTreesHeight();
            });
        });
    }


    /**
     * Assign left/right classes for inactive trees to determine their position relative to the current active tree/button
     */
    handleTreePositioning() {
        const activeButton = document.querySelector('.resume-btn.active');
    
        this.resumeButtons.forEach(button => {
            button.classList.remove('left-btn', 'right-btn');
        });
    
        if (activeButton) {
            const activeIndex = [...this.resumeButtons].indexOf(activeButton);
    
            this.resumeButtons.forEach((button, index) => {
                if (button !== activeButton) {
                    if (index < activeIndex) {
                        button.classList.add('left-btn');
                    } else if (index > activeIndex) {
                        button.classList.add('right-btn');
                    }
                }
            });
    
            this.treeContents.forEach(content => {
                const contentId = content.getAttribute('id');
                const associatedButton = document.querySelector(`.resume-btn[data-target="${contentId}"]`);
                
                if (associatedButton.classList.contains('left-btn')) {
                    content.classList.add('left-tree');
                    content.classList.remove('right-tree', 'was-left', 'was-right');
                } else if (associatedButton.classList.contains('right-btn')) {
                    content.classList.add('right-tree');
                    content.classList.remove('left-tree', 'was-left', 'was-right');
                } else if (associatedButton.classList.contains('active')) {
                    if (content.classList.contains('left-tree')) {
                        content.classList.remove('left-tree');
                        content.classList.add('was-left');
                    } else if (content.classList.contains('right-tree')) {
                        content.classList.remove('right-tree');
                        content.classList.add('was-right');
                    }
                }
            });
        }
    }


    /**
     * Assign left/right classes to infoboxes based on their parity
     */
    handleInfoboxesPositioning() {
        this.trees.forEach((infobox, index) => 
            infobox.classList.add(index % 2 === 0 ? 'left' : 'right'));
    }


    /**
     * Sets height of the entire resume-trees container as the trees are positioned absolutely
     */
    setResumeTreesHeight() {
        const resumeTrees = document.querySelector('.resume-trees');
        const visibleTree = document.querySelector('.tree-content.visible');

        const visibleTreeHeight = visibleTree.clientHeight;

        resumeTrees.style.height = visibleTreeHeight + treeHeightOffset + 'px';
    }
}