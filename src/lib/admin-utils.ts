/**
 * Admin utility functions — client-safe.
 */

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function formatKES(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });
}

export function getFileTypeIcon(fileType: string): string {
  const typeMap: Record<string, string> = {
    "application/pdf": "file-text",
    "application/msword": "file-text",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "file-text",
    "application/vnd.ms-excel": "file-spreadsheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "file-spreadsheet",
    "application/vnd.ms-powerpoint": "file-presentation",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "file-presentation",
    "application/zip": "archive",
    "image/jpeg": "image",
    "image/png": "image",
    "image/webp": "image",
    "image/gif": "image",
  };
  return typeMap[fileType] || "file";
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}
