```typescript
import { useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';

function App() {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-3">Configuration Error</h2>
          <p className="text-slate-700 mb-4">{error}</p>
          <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
            <p className="font-medium mb-2">Required environment variables:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>VITE_SUPABASE_URL</li>
              <li>VITE_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <Auth />;
}

export default App;
```
