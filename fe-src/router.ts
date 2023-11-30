import {Router} from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
    {path: '/', component: 'inicio-page'},
    {path: '/home', component: 'inicio-page'},
    {path: '/signup', component: 'registrarse-page'},
    {path: '/login', component: 'iniciar-page'},
    {path: '/my-data', component: 'my-data-page'},
    {path: '/report-pet', component: 'report-pet-page'},
    {path: '/password', component: 'password-page'},
    {path: '/lost-pets', component: 'lost-pets-page'},
    {path: '/report', component: 'report-page'},
    {path: '/my-reports', component: 'my-reports-page'},
    {path: '/edit-report', component: 'edit-report-page'},
    {path: '/menu', component: 'menu-page'},
    {path: '/info', component: 'info-page'},
    // {path: '/prueba', component: 'prueba-page'},
    // {path: '/dropzone', component: 'dropzone-page'},
]);