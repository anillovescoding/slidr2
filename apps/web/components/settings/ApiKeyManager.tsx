"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { pb } from "../../lib/pocketbase";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface ApiKey {
  id: string;
  provider: string;
}

export function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [provider, setProvider] = useState("OpenAI");
  const [keyValue, setKeyValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const fetchKeys = async () => {
    try {
      const response = await fetch("http://localhost:8000/keys", {
        headers: {
          Authorization: `Bearer ${pb.authStore.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setKeys(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchKeys();
    }
  }, [isAuthenticated]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyValue) return;
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:8000/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pb.authStore.token}`,
        },
        body: JSON.stringify({ provider, key: keyValue }),
      });
      
      if (response.ok) {
        setKeyValue("");
        fetchKeys();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Integrations</CardTitle>
        <CardDescription>Securely store your required provider keys. Keys are fully encrypted at rest.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Configured Providers</h3>
          {keys.length === 0 ? (
            <p className="text-sm text-slate-500">No keys configured yet.</p>
          ) : (
            <ul className="space-y-2">
              {keys.map((k) => (
                <li key={k.id} className="text-sm px-3 py-2 bg-slate-50 border rounded-md flex justify-between">
                  <span className="font-semibold">{k.provider}</span>
                  <span className="text-slate-500">••••••••••••••••</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleAdd} className="space-y-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2 col-span-1">
              <Label htmlFor="provider">Provider</Label>
              <select
                id="provider"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                <option value="OpenAI">OpenAI</option>
                <option value="Anthropic">Anthropic</option>
                <option value="Tavily">Tavily</option>
              </select>
            </div>
            <div className="space-y-2 col-span-3">
              <Label htmlFor="key">API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="key"
                  type="password"
                  placeholder="sk-..."
                  value={keyValue}
                  onChange={(e) => setKeyValue(e.target.value)}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Key"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
