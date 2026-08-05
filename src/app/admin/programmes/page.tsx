"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  ImageIcon,
  X,
  ChevronDown,
  ChevronUp,
  Save,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/utils";
import { ROUTES } from "@/constants";
import {
  getProgrammes,
  createProgramme,
  updateProgramme,
  deleteProgramme,
  reorderProgrammes,
  type Programme,
} from "@/services/programmes";

const COLORS = ["primary", "secondary", "accent", "info", "success", "warning"];
const ICONS = ["Heart", "Brain", "Shield", "Users", "Landmark", "Leaf", "MessageCircle", "BookOpen", "Home", "GraduationCap"];

function ProgrammeForm({
  programme,
  onSave,
  onCancel,
}: {
  programme?: Programme | null;
  onSave: (data: Omit<Programme, "id">) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    slug: programme?.slug ?? "",
    title: programme?.title ?? "",
    shortTitle: programme?.shortTitle ?? "",
    description: programme?.description ?? "",
    icon: programme?.icon ?? "Heart",
    color: programme?.color ?? "primary",
    imageUrl: programme?.imageUrl ?? "",
    objectives: programme?.objectives ?? [],
    targetBeneficiaries: programme?.targetBeneficiaries ?? [],
    sortOrder: programme?.sortOrder ?? 0,
    isVisible: programme?.isVisible ?? true,
  });
  const [objectiveInput, setObjectiveInput] = useState("");
  const [beneficiaryInput, setBeneficiaryInput] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const addItem = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "objectives" | "targetBeneficiaries",
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      setForm((prev) => ({
        ...prev,
        [field]: [...prev[field], input.trim()],
      }));
      setInput("");
    }
  };

  const removeItem = (
    field: "objectives" | "targetBeneficiaries",
    index: number
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">Sort Order</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-600 mb-1">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-600 mb-1">Short Title</label>
        <input
          type="text"
          value={form.shortTitle}
          onChange={(e) => setForm((p) => ({ ...p, shortTitle: e.target.value }))}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-600 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          rows={3}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">Icon</label>
          <select
            value={form.icon}
            onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          >
            {ICONS.map((icon) => (
              <option key={icon} value={icon}>{icon}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">Color</label>
          <select
            value={form.color}
            onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          >
            {COLORS.map((color) => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-600 mb-1">Image URL</label>
        <input
          type="url"
          value={form.imageUrl}
          onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          placeholder="https://images.unsplash.com/..."
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-600 mb-1">Objectives</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.objectives.map((obj, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
              {obj}
              <button type="button" onClick={() => removeItem("objectives", i)} className="text-primary-400 hover:text-primary-600">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={objectiveInput}
          onChange={(e) => setObjectiveInput(e.target.value)}
          onKeyDown={(e) => addItem(e, "objectives", objectiveInput, setObjectiveInput)}
          placeholder="Add objective and press Enter"
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-600 mb-1">Target Beneficiaries</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.targetBeneficiaries.map((ben, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-secondary-50 px-2.5 py-1 text-xs font-medium text-secondary-700">
              {ben}
              <button type="button" onClick={() => removeItem("targetBeneficiaries", i)} className="text-secondary-400 hover:text-secondary-600">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={beneficiaryInput}
          onChange={(e) => setBeneficiaryInput(e.target.value)}
          onKeyDown={(e) => addItem(e, "targetBeneficiaries", beneficiaryInput, setBeneficiaryInput)}
          placeholder="Add beneficiary and press Enter"
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isVisible}
            onChange={(e) => setForm((p) => ({ ...p, isVisible: e.target.checked }))}
            className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
          />
          Visible on homepage
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className={cn(
            "inline-flex items-center gap-2 rounded-full bg-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow-teal-sm transition-all duration-200 hover:bg-primary-600",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
            saving && "opacity-50 cursor-not-allowed"
          )}
        >
          <Save size={14} aria-hidden="true" />
          {saving ? "Saving..." : (programme ? "Update Programme" : "Create Programme")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-5 py-2.5 text-sm font-bold text-neutral-700 backdrop-blur-sm transition-all duration-200 hover:border-primary-300 hover:text-primary-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AdminProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProgramme, setEditingProgramme] = useState<Programme | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const fetchProgrammes = useCallback(async () => {
    try {
      const data = await getAllProgrammes();
      setProgrammes(data);
    } catch {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgrammes();
  }, [fetchProgrammes]);

  const handleCreate = async (data: Omit<Programme, "id">) => {
    await createProgramme(data);
    setShowForm(false);
    await fetchProgrammes();
  };

  const handleUpdate = async (data: Omit<Programme, "id">) => {
    if (!editingProgramme) return;
    await updateProgramme(editingProgramme.slug, data);
    setEditingProgramme(null);
    await fetchProgrammes();
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this programme?")) return;
    await deleteProgramme(slug);
    await fetchProgrammes();
  };

  const handleToggleVisibility = async (programme: Programme) => {
    await updateProgramme(programme.slug, { isVisible: !programme.isVisible });
    await fetchProgrammes();
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const updated = [...programmes];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setProgrammes(updated);

    const slugs = updated.map((p) => p.slug);
    await reorderProgrammes(slugs);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-neutral-400 text-sm">Loading programmes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Programmes</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage the programmes displayed on the homepage.</p>
        </div>
        <button
          onClick={() => {
            setEditingProgramme(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-sm font-bold text-white shadow-teal-sm transition-all duration-200 hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <Plus size={14} aria-hidden="true" />
          Add Programme
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.6rem] border border-white/75 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-neutral-900">
              {editingProgramme ? "Edit Programme" : "New Programme"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingProgramme(null);
              }}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <X size={18} />
            </button>
          </div>
          <ProgrammeForm
            programme={editingProgramme}
            onSave={editingProgramme ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingProgramme(null);
            }}
          />
        </motion.div>
      )}

      {/* Programmes List */}
      <div className="space-y-3">
        {programmes.map((programme, index) => (
          <motion.div
            key={programme.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={cn(
              "group flex items-center gap-4 rounded-[1.2rem] border border-white/75 bg-white/90 p-4 shadow-[0_4px_12px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all duration-200 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]",
              !programme.isVisible && "opacity-50"
            )}
          >
            {/* Drag handle */}
            <button
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null && dragIndex !== index) {
                  handleReorder(dragIndex, index);
                  setDragIndex(null);
                }
              }}
              onDragEnd={() => setDragIndex(null)}
              className="text-neutral-300 hover:text-neutral-500 cursor-grab active:cursor-grabbing"
            >
              <GripVertical size={16} />
            </button>

            {/* Icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 shrink-0">
              <span className="text-sm font-bold">{programme.icon[0]}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-sm font-bold text-neutral-900 truncate">{programme.title}</h3>
              <p className="text-xs text-neutral-500 truncate">{programme.shortTitle}</p>
            </div>

            {/* Visibility toggle */}
            <button
              onClick={() => handleToggleVisibility(programme)}
              className={cn(
                "shrink-0 rounded-full p-1.5 transition-colors",
                programme.isVisible ? "text-primary-500 hover:bg-primary-50" : "text-neutral-300 hover:bg-neutral-50"
              )}
              title={programme.isVisible ? "Visible" : "Hidden"}
            >
              {programme.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  setEditingProgramme(programme);
                  setShowForm(true);
                }}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
                title="Edit"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => handleDelete(programme.slug)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {programmes.length === 0 && !showForm && (
        <div className="text-center py-12 text-neutral-400 text-sm">
          No programmes yet. Click &quot;Add Programme&quot; to create one.
        </div>
      )}
    </div>
  );
}