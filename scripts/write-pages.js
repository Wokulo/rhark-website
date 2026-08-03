const fs = require("fs");
const path = require("path");

const base = "c:/Users/WILLIS/Desktop/Wilson/Wilson/RHARK/src/app/admin";

function writePage(subdir, content) {
  const fp = path.join(base, subdir, "page.tsx");
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content, "utf8");
  console.log("Written:", subdir + "/page.tsx");
}

// ============================================================
// 2. PROJECTS NEW PAGE
// ============================================================
const projectsNew = `"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", location: "", county: "", description: "", objectives: "",
    budget: "", funding_partner: "", start_date: "", end_date: "",
    progress_percentage: 0, status: "upcoming", project_images: "", documents: "",
  });

  const handleSave = async (status: string) => {
    setLoading(true);
    setError("");
    try {
      const objectives = form.objectives.split("\\n").filter(Boolean);
      const project_images = form.project_images ? form.project_images.split("\\n").filter(Boolean) : [];
      const docs = form.documents ? form.documents.split("\\n").filter(Boolean) : [];
      const { error: saveError } = await (supabase.from("projects") as any).insert({
        name: form.name,
        location: form.location || null,
        county: form.county || null,
        description: form.description || null,
        objectives,
        budget: form.budget ? parseFloat(form.budget) : null,
        funding_partner: form.funding_partner || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        progress_percentage: form.progress_percentage,
        status,
        project_images,
        documents: docs,
      });
      if (saveError) throw saveError;
      router.push("/admin/projects");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-900">New Project</h1>
            <p className="mt-1 text-sm text-neutral-500">Create a new project or program</p>
          </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave("upcoming")}
            disabled={loading || !form.name}
            className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Draft
