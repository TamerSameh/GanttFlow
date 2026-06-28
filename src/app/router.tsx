import { lazy, Suspense, useState, useCallback } from 'react';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { AppShell } from '@/components/layout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const ProjectListPage = lazy(() => import('@/features/project/ProjectListPage'));
const GanttPage = lazy(() => import('@/features/gantt/GanttPage'));
const ResourcePage = lazy(() => import('@/features/resources/ResourcePage'));
const PortfolioPage = lazy(() => import('@/features/portfolio/PortfolioPage'));
const TemplatePage = lazy(() => import('@/features/templates/TemplatePage'));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'));

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary-500" />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  );
}

function lazyPage(Component: React.ComponentType<unknown>) {
  return <LazyPageWrapper Component={Component} />;
}

function LazyPageWrapper({ Component }: { Component: React.ComponentType<unknown> }) {
  const [key, setKey] = useState(0);
  const handleReset = useCallback(() => setKey((k) => k + 1), []);
  return (
    <ErrorBoundary onReset={handleReset}>
      <Suspense fallback={<PageLoader />}>
        <Component key={key} />
      </Suspense>
    </ErrorBoundary>
  );
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: lazyPage(DashboardPage) },
      {
        path: 'projects',
        children: [
          { index: true, element: lazyPage(ProjectListPage) },
          { path: ':projectId', element: lazyPage(GanttPage) },
        ],
      },
      { path: 'resources', element: lazyPage(ResourcePage) },
      { path: 'portfolio', element: lazyPage(PortfolioPage) },
      { path: 'templates', element: lazyPage(TemplatePage) },
      { path: 'settings', element: lazyPage(SettingsPage) },
    ],
  },
];

export const router = createBrowserRouter(routes);