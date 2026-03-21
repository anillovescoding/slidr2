"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { pb } from "../../lib/pocketbase";
import { CheckCircle2, Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";

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
}

const PROVIDER_GROUPS: { group: string; providers: ProviderConfig[] }[] = [
  {
    group: "AI Text Models",
    providers: [
      { id: "OpenAI",    label: "OpenAI",         placeholder: "sk-...",       helpUrl: "https://platform.openai.com/api-keys",          description: "GPT-4, DALL-E and more" },
      { id: "Anthropic", label: "Anthropic",       placeholder: "sk-ant-...",   helpUrl: "https://console.anthropic.com/settings/keys",   description: "Claude 3 Opus, Sonnet, Haiku" },
      { id: "Gemini",    label: "Google Gemini",   placeholder: "AIza...",      helpUrl: "https://aistudio.google.com/app/apikey",         description: "Gemini Pro, Flash" },
      { id: "Cohere",    label: "Cohere",          placeholder: "...",          helpUrl: "https://dashboard.cohere.com/api-keys",          description: "Command R and more" },
      { id: "Mistral",   label: "Mistral AI",      placeholder: "...",          helpUrl: "https://console.mistral.ai/api-keys/",           description: "Mistral Large, Small" },
    ],
  },
  {
    group: "AI Image Generation",
    providers: [
      { id: "StabilityAI", label: "Stability AI",  placeholder: "sk-...",   helpUrl: "https://platform.stability.ai/account/keys", description: "Stable Diffusion, SDXL" },
      { id: "Replicate",   label: "Replicate",      placeholder: "r8_...",   helpUrl: "https://replicate.com/account/api-tokens",   description: "Thousands of open-source models" },
      { id: "Fal",         label: "Fal.ai",         placeholder: "...",      helpUrl: "https://fal.ai/dashboard/keys",              description: "Fast image generation" },
    ],
  },
  {
    group: "Stock Media",
    providers: [
      { id: "Pexels",    label: "Pexels",     placeholder: "...", helpUrl: "https://www.pexels.com/api/",                      description: "Free stock photos & videos" },
      { id: "Pixabay",   label: "Pixabay",    placeholder: "...", helpUrl: "https://pixabay.com/api/docs/",                    description: "Free images, videos, music" },
      { id: "Unsplash",  label: "Unsplash",   placeholder: "...", helpUrl: "https://unsplash.com/developers",                  description: "Beautiful free photos" },
      { id: "Giphy",     label: "Giphy",      placeholder: "...", helpUrl: "https://developers.giphy.com/dashboard/",           description: "GIFs and stickers" },
    ],
  },
  {
    group: "Search & Research",
    providers: [
      { id: "Tavily",  label: "Tavily",   placeholder: "tvly-...", helpUrl: "https://app.tavily.com/",          description: "AI-optimised web search" },
      { id: "Serper",  label: "Serper",   placeholder: "...",      helpUrl: "https://serper.dev/api-key",       description: "Google Search API" },
      { id: "Exa",     label: "Exa",      placeholder: "...",      helpUrl: "https://exa.ai/",                  description: "Neural search engine" },
    ],
  },
  {
    group: "Audio & Voice",
    providers: [
      { id: "ElevenLabs", label: "ElevenLabs", placeholder: "...", helpUrl: "https://elevenlabs.io/app/settings/api-keys", description: "AI voice generation" },
      { id: "AssemblyAI", label: "AssemblyAI", placeholder: "...", helpUrl: "https://www.assemblyai.com/app/account",      description: "Speech-to-text AI" },
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
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div
        className="flex items-center gap-3 px-4 py-3 bg-white cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => !isConfigured && setExpanded((e) => !e)}
      >
        <div className={`w-2 h-2 rounded-full shrink-0 ${isConfigured ? 'bg-emerald-500' : 'bg-slate-200'}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800">{provider.label}</p>
          <p className="text-xs text-slate-400">{provider.description}</p>
        </div>
        {isConfigured ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Configured
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(provider.id); }}
              className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
              title="Remove key"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded((ex) => !ex); }}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {!isConfigured && expanded && (
        <div className="px-4 pb-4 pt-2 bg-slate-50 border-t border-slate-100 space-y-3">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              placeholder={provider.placeholder || 'Paste your API key...'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full pr-10 pl-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <a
              href={provider.helpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 hover:underline"
            >
              Get your API key →
            </a>
            <button
              onClick={handleAdd}
              disabled={!value.trim() || saving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save Key'}
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
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-slate-900">API Integrations</h2>
          {configuredCount > 0 && (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              {configuredCount} configured
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500">
          Connect your API keys to unlock AI generation, stock media, and more. Keys are encrypted at rest.
        </p>
      </div>

      {/* Groups */}
      {PROVIDER_GROUPS.map(({ group, providers }) => (
        <div key={group}>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{group}</h3>
          <div className="space-y-2">
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
  );
}
