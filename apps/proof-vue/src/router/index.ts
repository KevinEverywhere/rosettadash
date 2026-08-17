import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';

const routes = [
  { path: '/', component: App },
  { path: '/overview', component: App },
  { path: '/destinations', component: App },
  { path: '/maps', component: App },
  { path: '/maps/globe', component: App },
  { path: '/media', component: App },
  { path: '/authoring', component: App },
  { path: '/intel', component: App },
  { path: '/plan', component: App },
  { path: '/views', component: App },
  { path: '/stack', component: App },
  { path: '/settings', component: App },
  { path: '/map', component: App },
  { path: '/globe', component: App },
  { path: '/scout', component: App },
  { path: '/:pathMatch(.*)*', component: App },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
