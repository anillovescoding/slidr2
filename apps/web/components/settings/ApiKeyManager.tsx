"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { pb } from "../../lib/pocketbase";
import { Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronUp, ShieldCheck, Zap, Image as ImageIcon, Search, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ApiKey {
  id: string;
  provider: string;
}

interface ProviderConfig {
  id: string;
  label: string;
  placeholder: string;
  helpUrl: string;
  description: string;
  icon: React.ElementType;
}

const PROVIDER_GROUPS: { group: string; icon: React.ElementType; providers: ProviderConfig[] }[] = [
  {
    group: "Intelligence Engines",
    icon: Zap,
    providers: [
      { id: "OpenAI",    label: "OpenAI",         placeholder: "sk-...",       helpUrl: "https://platform.openai.com/api-keys",          description: "GPT-4o, DALL-E 3", icon: Zap },
      { id: "Anthropic", label: "Anthropic",       placeholder: "sk-ant-...",   helpUrl: "https://console.anthropic.com/settings/keys",   description: "Claude 3.5 Sonnet", icon: Zap },
      { id: "Gemini",    label: "Google Gemini",   placeholder: "AIza...",      helpUrl: "https://aistudio.google.com/app/apikey",         description: "Gemini 1.5 Pro", icon: Zap },
    ],
  },
  {
    group: "Visual Generation",
    icon: ImageIcon,
    providers: [
      { id: "StabilityAI", label: "Stability AI",  placeholder: "sk-...",   helpUrl: "https://platform.stability.ai/account/keys", description: "Stable Diffusion 3", icon: ImageIcon },
      { id: "Replicate",   label: "Replicate",      placeholder: "r8_...",   helpUrl: "https://replicate.com/account/api-tokens",   description: "Open Source Models", icon: ImageIcon },
    ],
  },
  {
    group: "Media & Assets",
    icon: ImageIcon,
    providers: [
      { id: "Pexels",    label: "Pexels",     placeholder: "...", helpUrl: "https://www.pexels.com/api/",                      description: "Stock Photos", icon: ImageIcon },
      { id: "Unsplash",  label: "Unsplash",   placeholder: "...", helpUrl: "https://unsplash.com/developers",                  description: "High-res Imagery", icon: ImageIcon },
    ],
  },
  {
    group: "Research & Data",
    icon: Search,
    providers: [
      { id: "Tavily",  label: "Tavily",   placeholder: "tvly-...", helpUrl: "https://app.tavily.com/",          description: "AI Web Search", icon: Search },
      { id: "Serper",  label: "Serper",   placeholder: "...",      helpUrl: "https://serper.dev/api-key",       description: "Google Search", icon: Search },
    ],
  },
];

function ProviderRow({ provider, isConfigured, onAdd, onDelete }: {
  provider: ProviderConfig;
  isConfigured: boolean;
  onAdd: (id: string, key: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!value.trim()) return;
    setSaving(true);
    await onAdd(provider.id, value.trim());
    setValue('');
    setExpanded(false);
    setSaving(false);
  };

  return (
    <div className={`glass-dark border rounded-3xl overflow-hidden transition-all duration-300 ${isConfigured ? 'border-primary/20 bg-primary/5' : 'border-white/5 hover:border-white/10'}`}>
      <div
        className="flex items-center gap-4 px-6 py-5 cursor-pointer"
        onClick={() => !isConfigured && setExpanded((e) => !e)}
      >
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${isConfigured ? 'bg-primary/20 border-primary/20 text-primary' : 'bg-white/5 border-white/5 text-foreground/20'}`}>
          <provider.icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white tracking-tight">{provider.label}</p>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-0.5">{provider.description}</p>
        </div>
        {isConfigured ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
               <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(provider.id); }}
              className="p-2.5 rounded-2xl hover:bg-red-500/10 text-foreground/20 hover:text-red-400 transition-all border border-transparent hover:border-red-400/20"
              title="Remove key"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded((ex) => !ex); }}
            className="p-2.5 rounded-2xl hover:bg-white/5 text-foreground/20 hover:text-white transition-all border border-transparent hover:border-white/10"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        )}
      </div>

      {!isConfigured && expanded && (
        <div className="px-6 pb-6 pt-2 bg-white/5 border-t border-white/5 space-y-4 animate-in slide-in-from-top-2 duration-300">
          <div className="relative group">
            <input
              type={show ? 'text' : 'password'}
              placeholder={provider.placeholder || 'Paste your secure token...'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full pr-12 pl-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white placeholder-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-white transition-colors"
            >
              {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center justify-between px-1">
            <a
              href={provider.helpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-primary hover:text-primary-light uppercase tracking-widest"
            >
              Master API Dashboard →
            </a>
            <button
              onClick={handleAdd}
              disabled={!value.trim() || saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-br from-primary to-secondary disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              {saving ? 'Synchronizing...' : 'Validate & Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const { isAuthenticated } = useAuthStore();

  const fetchKeys = async () => {
    try {
      const res = await fetch(`${API_URL}/keys`, {
        headers: { Authorization: `Bearer ${pb.authStore.token}` },
      });
      if (res.ok) setKeys(await res.json());
    } catch (e) {
      console.error('Failed to fetch keys:', e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchKeys();
  }, [isAuthenticated]);

  const handleAdd = async (provider: string, key: string) => {
    try {
      const res = await fetch(`${API_URL}/keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pb.authStore.token}`,
        },
        body: JSON.stringify({ provider, key }),
      });
      if (res.ok) await fetchKeys();
    } catch (e) {
      console.error('Failed to save key:', e);
    }
  };

  const handleDelete = async (provider: string) => {
    const key = keys.find((k) => k.provider === provider);
    if (!key) return;
    try {
      await fetch(`${API_URL}/keys/${key.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${pb.authStore.token}` },
      });
      await fetchKeys();
    } catch (e) {
      console.error('Failed to delete key:', e);
    }
  };

  const configuredSet = new Set(keys.map((k) => k.provider));
  const configuredCount = configuredSet.size;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Summary */}
      <div className="glass-dark border border-white/10 rounded-[40px] p-10 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 p-10 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity">
           <ShieldCheck className="w-32 h-32 text-primary" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">API Infrastructure</h2>
            {configuredCount > 0 && (
              <div className="flex items-center gap-2 py-2 px-4 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                  {configuredCount} Nodes Active
                </span>
              </div>
            )}
          </div>
          <p className="text-foreground/40 text-sm font-medium max-w-xl leading-relaxed">
            Architect your AI pipeline. Connect your proprietary API nodes to unleash automated creativity, deep synthesis, and visual generation. All transmissions are AES-256 encrypted.
          </p>
        </div>
      </div>

      {/* Groups */}
      <div className="grid gap-12">
        {PROVIDER_GROUPS.map(({ group, providers }) => (
          <div key={group} className="space-y-6">
            <div className="flex items-center gap-3 px-2">
               <div className="w-px h-4 bg-primary/40" />
               <h3 className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.3em]">{group}</h3>
            </div>
            <div className="grid gap-4">
              {providers.map((provider) => (
                <ProviderRow
                  key={provider.id}
                  provider={provider}
                  isConfigured={configuredSet.has(provider.id)}
                  onAdd={handleAdd}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
