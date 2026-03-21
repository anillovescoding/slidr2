import { ApiKeyManager } from '../../../components/settings/ApiKeyManager';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl max-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-slate-800">Settings</h1>
        <p className="text-slate-500">Manage your profile and API integrations.</p>
      </div>
      
      <div className="grid gap-6">
        <ApiKeyManager />
      </div>
    </div>
  );
}
