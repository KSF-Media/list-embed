import Vue from 'vue'
import VueRouter from 'vue-router'
import List from "../views/List";
import Generate from "../views/Generate"
import Help from "../views/Help"

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Generate,
    },
    {
        path: '/list/:gSheetId',
        props: true,
        name: 'List',
        component: List,
    },
    {
        path: '/help',
        name: 'Help',
        component: Help,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
