"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Plus, Edit, Trash2, AlertCircle, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils";

export default function AdminTeamPage() {
  const supabase = createClient();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadMembers();
  }, [supabase, search]);

  async function loadMembers() {
    setLoading(true);
    try {
      let query = supabase
        .from("members")
        .select("*, department:departments(name)")
        .order("display_order", { ascending: true });

      if (search) {
        query = query.or(
          `name.ilike.%${search}%,position.ilike.%${search}%`
        );
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setMembers(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    const { error: deleteError } = await supabase
      .from("members")
      .delete()
      .eq("id", id);
    if (deleteError) {
      alert("Failed to delete");
      return;
    }
    loadMembers();
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await supabase.from("members").update({ status: newStatus }).eq("id", id);
    loadMembers();
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            Team Members
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage staff, board, and leadership
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600"
        >
          <Plus size={16} />
          Add Member
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-error-50 p-4 text-sm text-error-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users size={40} className="text-neutral-300" />
          <p className="mt-4 text-lg font-medium text-neutral-500">No team members</p>
          <Link href="/admin/team/new" className="mt-4 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600">
            <Plus size={16} className="inline mr-2" />
            Add Member
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div key={member.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                  {member.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 truncate">{member.name}</h3>
                  <p className="text-sm text-neutral-500 truncate">{member.position}</p>
                  {member.department && (
                    <p className="text-xs text-neutral-400">{member.department.name}</p>
                  )}
                  <span
                    className={cn(
                      "mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      member.status === "active"
                        ? "bg-success-50 text-success-700"
                        : "bg-neutral-100 text-neutral-500"
                    )}
                  >
                    {member.status}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(member.id, member.status)}
                    className="rounded-lg p-1.5 text-xs text-neutral-500 hover:bg-neutral-100"
                  >
                    {member.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/team/${member.id}`}
                    className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                  >
                    <Edit size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="rounded-lg p-1.5 text-neutral-400 hover:bg-error-50 hover:text-error-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}