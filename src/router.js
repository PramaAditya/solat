import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import ShalatView from './views/ShalatView.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/shalat/:name', component: ShalatView, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router