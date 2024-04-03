import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

import '../scss/style.scss';

import Navigation from './navigation.js';
import Skills from './skills.js';

document.addEventListener('DOMContentLoaded', function() {
    const navigation = new Navigation();
    const skills = new Skills();
});
