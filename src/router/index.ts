import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'quiz-list',
      component: () => import('@/views/QuizListView.vue'),
    },
    {
      path: '/quiz/new',
      name: 'quiz-create',
      component: () => import('@/views/QuizEditorView.vue'),
    },
    {
      path: '/quiz/:id/edit',
      name: 'quiz-edit',
      component: () => import('@/views/QuizEditorView.vue'),
      props: true,
    },
    {
      path: '/quiz/:id/play',
      name: 'quiz-play',
      component: () => import('@/views/QuizPlayerView.vue'),
      props: true,
    },
  ],
})

export default router
