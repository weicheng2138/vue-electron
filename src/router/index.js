import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Navigation from "../views/Navigation.vue";
import LineToken from "../views/LineToken.vue";
import MonitorWindows from "../views/MonitorWindows.vue";
import AutoTradingData from "../views/AutoTradingData.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: MonitorWindows,
    },
    {
        path: "/monitorWindows",
        name: "MonitorWindows",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: MonitorWindows,
    },
    {
        path: "/linetoken",
        name: "LineToken",
        component: LineToken,
    },
    {
        path: "/autoTradingData",
        name: "AutoTradingData",
        component: AutoTradingData,
    },
];

const router = new VueRouter({
    routes,
});

export default router;
