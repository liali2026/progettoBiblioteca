import * as Auth from './auth.js';

window.addEventListener('DOMContentLoaded',
    async () => { await Auth.initPage(true); }
);