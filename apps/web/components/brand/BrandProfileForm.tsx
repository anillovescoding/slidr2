"use client";

import { useState, useEffect } from "react";
import { useBrandStore } from "../../store/useBrandStore";
import { Sparkles, Palette, Type, Globe, Save, Loader2 } from "lucide-react";

export function BrandProfileForm() {
  const { profile, fetchProfile, updateProfile, isLoading } = useBrandStore();
  const [formData, setFormData] = useState({
    brand_name: "",
    colors: { primary: "#6366f1", secondary: "#8b5cf6", accent: "#f43f5e" },
    typography: { heading: "Epilogue", body: "Inter" },
    social_handles: { linkedin: "", twitter: "" }
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        brand_name: profile.brand_name || "",
        colors: profile.colors || { primary: "#6366f1", secondary: "#8b5cf6", accent: "#f43f5e" },
        typography: profile.typography || { heading: "Epilogue", body: "Inter" },
        social_handles: profile.social_handles || { linkedin: "", twitter: "" }
      });
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      // We could use a toast here, but for now just a simple success state
    } catch {
      console.error("Error saving profile");
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Brand Identity Section */}
      <div className="glass-dark border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
                <Sparkles className="w-6 h-6 text-primary" />
             </div>
             <div>
                <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Core Identity</h2>
                <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.2em] mt-1">Foundational Brand Assets</p>
             </div>
          </div>
        </div>
        
        <div className="p-10 space-y-8">
           <div className="space-y-3">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-1">Official Brand Name</label>
              <input 
                type="text"
                value={formData.brand_name} 
                onChange={(e) => setFormData({...formData, brand_name: e.target.value})} 
                className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-lg font-medium text-white placeholder-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 shadow-inner"
                placeholder="e.g. Lumina Prism AI" 
              />
           </div>
        </div>
      </div>

      {/* Visual Ethos Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Colors */}
        <div className="glass-dark border border-white/10 rounded-[40px] overflow-hidden relative group">
          <div className="p-8 border-b border-white/5 flex items-center gap-3">
             <Palette className="w-5 h-5 text-primary" />
             <h3 className="text-sm font-bold text-white uppercase tracking-widest">Color Spectrum</h3>
          </div>
          <div className="p-8 space-y-6">
            {(['primary', 'secondary', 'accent'] as const).map((key) => (
              <div key={key} className="space-y-3">
                <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-tighter ml-1 capitalize">{key} Intent</label>
                <div className="flex gap-4">
                  <div className="relative group/color">
                    <input 
                      type="color" 
                      className="w-16 h-16 rounded-2xl cursor-pointer bg-white/5 border-none p-0 overflow-hidden appearance-none" 
                      value={formData.colors[key]} 
                      onChange={(e) => setFormData({...formData, colors: {...formData.colors, [key]: e.target.value}})} 
                    />
                    <div className="absolute inset-0 rounded-2xl border-2 border-white/5 pointer-events-none group-hover/color:border-white/20 transition-all" />
                  </div>
                  <input 
                    className="flex-1 px-5 bg-transparent border-b border-white/10 text-sm font-bold text-foreground/60 focus:outline-none focus:border-primary transition-all font-mono"
                    value={formData.colors[key]} 
                    onChange={(e) => setFormData({...formData, colors: {...formData.colors, [key]: e.target.value}})} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="glass-dark border border-white/10 rounded-[40px] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center gap-3">
             <Type className="w-5 h-5 text-secondary" />
             <h3 className="text-sm font-bold text-white uppercase tracking-widest">Type Architecture</h3>
          </div>
          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-tight ml-1">Heading System</label>
              <select 
                className="w-full px-5 py-5 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer"
                value={formData.typography.heading}
                onChange={(e) => setFormData({...formData, typography: {...formData.typography, heading: e.target.value}})}
              >
                <option value="Epilogue">Epilogue (Premium)</option>
                <option value="Inter">Inter (Modern)</option>
                <option value="Playfair Display">Playfair (Serif)</option>
                <option value="Montserrat">Montserrat (Bold)</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-tight ml-1">Body/Reading System</label>
              <select 
                className="w-full px-5 py-5 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer"
                value={formData.typography.body}
                onChange={(e) => setFormData({...formData, typography: {...formData.typography, body: e.target.value}})}
              >
                <option value="Inter">Inter (Rational)</option>
                <option value="Epilogue">Epilogue (Emotional)</option>
                <option value="Roboto">Roboto (Technical)</option>
                <option value="Open Sans">Open Sans (Friendly)</option>
              </select>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-dashed border-white/10">
               <p style={{ fontFamily: formData.typography.heading }} className="text-xl font-bold mb-1 text-white">The Header Sample</p>
               <p style={{ fontFamily: formData.typography.body }} className="text-xs text-foreground/40 leading-relaxed">
                 The quick brown fox jumps over the lazy dog. A testament to clarity and design excellence.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Section */}
      <div className="glass-dark border border-white/10 rounded-[40px] overflow-hidden shadow-xl">
        <div className="p-10 border-b border-white/5 flex items-center gap-3">
           <Globe className="w-5 h-5 text-accent" />
           <h3 className="text-sm font-bold text-white uppercase tracking-widest">Global Reach</h3>
        </div>
        <div className="p-10 grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest ml-1">LinkedIn Profile</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-5 flex items-center text-foreground/20 text-xs font-bold font-mono">linkedin.com/in/</div>
              <input 
                placeholder="username" 
                className="w-full pl-36 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                value={formData.social_handles.linkedin} 
                onChange={(e) => setFormData({...formData, social_handles: {...formData.social_handles, linkedin: e.target.value}})} 
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest ml-1">X / Twitter Profile</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-5 flex items-center text-foreground/20 text-xs font-bold font-mono">x.com/</div>
              <input 
                placeholder="username" 
                className="w-full pl-20 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                value={formData.social_handles.twitter} 
                onChange={(e) => setFormData({...formData, social_handles: {...formData.social_handles, twitter: e.target.value}})} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end p-2">
         <button 
           type="submit" 
           disabled={isLoading}
           className="inline-flex items-center gap-3 px-12 py-5 rounded-3xl bg-linear-to-br from-primary to-secondary disabled:opacity-50 text-white font-bold tracking-tight shadow-2xl shadow-primary/20 hover:shadow-primary/40 transform hover:scale-[1.02] transition-all duration-500 text-base"
         >
           {isLoading ? (
             <Loader2 className="w-5 h-5 animate-spin" />
           ) : (
             <Save className="w-5 h-5" />
           )}
           {isLoading ? "Synchronizing..." : "Preserve Identity"}
         </button>
      </div>
    </form>
  );
}
