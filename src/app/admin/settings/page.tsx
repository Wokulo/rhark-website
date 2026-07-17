"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2, AlertCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [settings, setSettings] = useState<Record<string, any>>({});

  useEffect(() => {
    loadSettings();
  }, [supabase]);

  async function loadSettings() {
    try {
      const { data } = await supabase.from("settings").select("*");
      const settingsMap: Record<string, any> = {};
      data?.forEach((s) => {
        settingsMap[s.key] = s.value;
      });
      setSettings(settingsMap);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      for (const [key, value] of Object.entries(settings)) {
        await supabase.from("settings").upsert(
          { key, value },
          { onConflict: "key" }
        );
      }
      setSuccess("Settings saved successfully");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Settings</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage organization settings and configuration</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>

      {error && <div className="mb-6 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-sm text-error-700"><AlertCircle size={18} className="mt-0.5 shrink-0" /><p>{error}</p></div>}
      {success && <div className="mb-6 flex items-start gap-3 rounded-xl bg-success-50 p-4 text-sm text-success-700"><p>{success}</p></div>}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Organization Info */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-neutral-900">Organization Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Organization Name</label>
              <input type="text" value={settings.organization_name || ""} onChange={(e) => updateSetting("organization_name", e.target.value)} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Tagline</label>
              <input type="text" value={settings.organization_tagline || ""} onChange={(e) => updateSetting("organization_tagline", e.target.value)} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Email</label>
              <input type="email" value={settings.organization_email || ""} onChange={(e) => updateSetting("organization_email", e.target.value)} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Phone</label>
              <input type="tel" value={settings.organization_phone || ""} onChange={(e) => updateSetting("organization_phone", e.target.value)} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Address</label>
              <input type="text" value={settings.organization_address || ""} onChange={(e) => updateSetting("organization_address", e.target.value)} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-neutral-900">Mission & Vision</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Mission</label>
              <textarea value={settings.mission || ""} onChange={(e) => updateSetting("mission", e.target.value)} rows={3} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Vision</label>
              <textarea value={settings.vision || ""} onChange={(e) => updateSetting("vision", e.target.value)} rows={3} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-neutral-900">Social Media Links</h3>
          <div className="space-y-4">
            {["facebook", "twitter", "instagram", "linkedin", "youtube"].map((platform) => (
              <div key={platform}>
                <label className="block text-sm font-medium text-neutral-700 capitalize">{platform}</label>
                <input type="url" value={settings[`social_${platform}`] || ""} onChange={(e) => updateSetting(`social_${platform}`, e.target.value)} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-neutral-900">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Contact Email</label>
              <input type="email" value={settings.contact_email || ""} onChange={(e) => updateSetting("contact_email", e.target.value)} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Contact Phone</label>
              <input type="tel" value={settings.contact_phone || ""} onChange={(e) => updateSetting("contact_phone", e.target.value)} className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}