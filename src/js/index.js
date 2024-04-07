import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

import '../scss/style.scss';

import Helpers from './_helpers.js';
import Navigation from './sections/navigation.js';


const init = () => {
    const navigation = new Navigation();

    const aboutLink = document.querySelector('a.nav-link[href="#about"]');
    const resumeLink = document.querySelector('a.nav-link[href="#resume"]');
    const portfolioLink = document.querySelector('a.nav-link[href="#portfolio"]');
    const contactLink = document.querySelector('a.nav-link[href="#contact"]');

    initAboutSection(aboutLink);

    initSection(resumeLink, 'resume');
    initSection(portfolioLink, 'portfolio');
    initSection(contactLink, 'contact');
}

document.addEventListener('DOMContentLoaded', () => init());


/**
 * Initialize section only once on navLink click
 */
function initSection(link, script) {
    link.addEventListener('click', function clickHandler(e) {
        e.preventDefault();

        Helpers.loadSection(script);
        link.removeEventListener('click', clickHandler);
    });
}

/**
 * Initialize section each time on navLink click with a condition
 */
function initAboutSection(link) {
    link.addEventListener('click', function clickHandler(e) {
        e.preventDefault();

        if (!window.skillsLoaded) {
            Helpers.loadSection('about');
        }
    });
}
