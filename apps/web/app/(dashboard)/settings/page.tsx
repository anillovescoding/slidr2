import { ApiKeyManager } from '../../../components/settings/ApiKeyManager';

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage your API integrations and preferences.</p>
      </div>
      <ApiKeyManager />
    </div>
  );
}
