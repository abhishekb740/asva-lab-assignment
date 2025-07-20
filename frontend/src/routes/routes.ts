export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  PROJECT_TASKS: '/projects/:id/tasks',
  CREATE_TASK: '/projects/:id/tasks/new',
  EDIT_TASK: '/projects/:id/tasks/:taskId/edit',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
