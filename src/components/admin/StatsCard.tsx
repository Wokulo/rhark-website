"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  bg?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  color = "text-primary-600",
  bg = "bg-primary-50",
  trend,
  onClick,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-200 bg-white p-5 transition-all",
        onClick && "cursor-pointer hover:shadow-md"
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      <div className="flex items-center justify-between">
        <div className={cn("rounded-xl p-2.5", bg)}>
          <Icon size={20} className={color} />
        </div>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
              trend.isPositive
                ? "bg-success-50 text-success-700"
                : "bg-error-50 text-error-700"
            )}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-neutral-900">{value}</p>
      <p className="mt-1 text-sm text-neutral-500">{label}</p>
    </div>
  );
}