import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ToastContainer } from '@/components/ui';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
