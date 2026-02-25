import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient, persister } from '@/lib/query-client';

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {/* your app */}
    </PersistQueryClientProvider>
  );
}
