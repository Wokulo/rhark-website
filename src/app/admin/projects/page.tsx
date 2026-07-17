"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/admin-utils";
import { FolderKanban, Plus, Edit, Trash2, AlertCircle, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils";

export default function AdminProjectsPage() {
  const supabase = createClient();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProjects();
  }, [supabase, search]);

  async function loadProjects() {
    setLoading(true);
    try {
      let query = supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (search) query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);
      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setProjects(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    loadProjects();
  };

  const statusColors: Record<string, string> = {
    active: "bg-success-50 text-success-700",
    completed: "bg-info-50 text-info-700",
    upcoming: "bg-warning-50 text-warning-700",
    "on-hold": "bg-neutral-100 text-neutral-600",
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Projects</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage projects and programs</p>
        </div>
        <Link href="/admin/projects/new" className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600">
          <Plus size={16} /> New Project
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
        </div>
      </div>

      {error && <div className="mb-6 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-sm text-error-700"><AlertCircle size={18} className="mt-0.5 shrink-0" /><p>{error}</p></div>}

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderKanban size={40} className="text-neutral-300" />
          <p className="mt-4 text-lg font-medium text-neutral-500">No projects</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-neutral-900">{project.name}</h3>
                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", statusColors[project.status] || "bg-neutral-100")}>{project.status}</span>
                  </div>
                  {project.location && <p className="mt-1 text-sm text-neutral-500">{project.location}{project.county ? `, ${project.county}` : ""}</p>}
                  <div className="mt-2 flex items-center gap-4 text-xs text-neutral-400">
                    {project.start_date && <span>Start: {formatDate(project.start_date)}</span>}
                    {project.budget && <span>Budget: KES {Number(project.budget).toLocaleString()}</span>}
                    <span>Progress: {project.progress_percentage}%</span>
                  </div>
                  {project.progress_percentage > 0 && (
                    <div className="mt-2 h-1.5 w-full max-w-xs rounded-full bg-neutral-200">
                      <div className="h-1.5 rounded-full bg-primary-500" style={{ width: `${project.progress_percentage}%` }} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/admin/projects/${project.id}`} className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100"><Edit size={16} /></Link>
                  <button onClick={() => handleDelete(project.id)} className="rounded-lg p-2 text-neutral-400 hover:bg-error-50 hover:text-error-600"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}