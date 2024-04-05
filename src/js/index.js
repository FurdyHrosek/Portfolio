import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

import '../scss/style.scss';

import Helpers from './_helpers.js';
import Navigation from './navigation.js';

document.addEventListener('DOMContentLoaded', function() {
    const navigation = new Navigation();

    const aboutLink = document.querySelector('a.nav-link[href="#about"]');
    aboutLink.addEventListener('click', function clickHandler(e) {
        e.preventDefault();

        if (!window.skillsLoaded) {
            Helpers.loadSection('about');
        }
    });

    const resumeLink = document.querySelector('a.nav-link[href="#resume"]');
    resumeLink.addEventListener('click', function clickHandler(e) {
        e.preventDefault();

        Helpers.loadSection('resume');
        resumeLink.removeEventListener('click', clickHandler);
    })
});