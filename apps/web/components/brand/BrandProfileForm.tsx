"use client";

import { useState, useEffect } from "react";
import { useBrandStore } from "../../store/useBrandStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

export function BrandProfileForm() {
  const { profile, fetchProfile, updateProfile, isLoading } = useBrandStore();
  const [formData, setFormData] = useState({
    brand_name: "",
    colors: { primary: "#0ea5e9", secondary: "#8b5cf6", accent: "#f43f5e" },
    typography: { heading: "Inter", body: "Inter" },
    social_handles: { linkedin: "", twitter: "" }
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        brand_name: profile.brand_name || "",
        colors: profile.colors || { primary: "#0ea5e9", secondary: "#8b5cf6", accent: "#f43f5e" },
        typography: profile.typography || { heading: "Inter", body: "Inter" },
        social_handles: profile.social_handles || { linkedin: "", twitter: "" }
      });
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      alert("Brand profile saved successfully!");
    } catch {
      alert("Error saving profile");
    }
  };

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Brand Profile</CardTitle>
        <CardDescription>Configure your visual identity and social handles.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSave}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input 
              id="brandName" 
              value={formData.brand_name} 
              onChange={(e) => setFormData({...formData, brand_name: e.target.value})} 
              placeholder="e.g. Acme Corp" 
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium border-b pb-2">Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Primary</Label>
                <div className="flex gap-2">
                  <Input type="color" className="w-12 h-10 p-1" value={formData.colors.primary} onChange={(e) => setFormData({...formData, colors: {...formData.colors, primary: e.target.value}})} />
                  <Input value={formData.colors.primary} onChange={(e) => setFormData({...formData, colors: {...formData.colors, primary: e.target.value}})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secondary</Label>
                <div className="flex gap-2">
                  <Input type="color" className="w-12 h-10 p-1" value={formData.colors.secondary} onChange={(e) => setFormData({...formData, colors: {...formData.colors, secondary: e.target.value}})} />
                  <Input value={formData.colors.secondary} onChange={(e) => setFormData({...formData, colors: {...formData.colors, secondary: e.target.value}})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Accent</Label>
                <div className="flex gap-2">
                  <Input type="color" className="w-12 h-10 p-1" value={formData.colors.accent} onChange={(e) => setFormData({...formData, colors: {...formData.colors, accent: e.target.value}})} />
                  <Input value={formData.colors.accent} onChange={(e) => setFormData({...formData, colors: {...formData.colors, accent: e.target.value}})} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium border-b pb-2">Typography</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Heading Font</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.typography.heading}
                  onChange={(e) => setFormData({...formData, typography: {...formData.typography, heading: e.target.value}})}
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Playfair Display">Playfair Display</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Body Font</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.typography.body}
                  onChange={(e) => setFormData({...formData, typography: {...formData.typography, body: e.target.value}})}
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium border-b pb-2">Social Profiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>LinkedIn Handle</Label>
                <Input placeholder="username" value={formData.social_handles.linkedin} onChange={(e) => setFormData({...formData, social_handles: {...formData.social_handles, linkedin: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <Label>X (Twitter) Handle</Label>
                <Input placeholder="username" value={formData.social_handles.twitter} onChange={(e) => setFormData({...formData, social_handles: {...formData.social_handles, twitter: e.target.value}})} />
              </div>
            </div>
          </div>

        </CardContent>
        <CardFooter className="bg-slate-50 border-t py-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
