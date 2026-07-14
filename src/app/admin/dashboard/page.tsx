"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  MessageSquare,
  Mail,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/utils";
import type { DashboardStats, Notification } from "@/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data.stats);
          setNotifications(data.data.notifications);
        } else {
          setError("Failed to load dashboard data");
        }
      })
      .catch(() => setError("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={40} className="text-error-500" />
        <p className="mt-4 text-lg font-medium text-neutral-700">{error}</p>
        <p className="mt-2 text-sm text-neutral-500">Refresh the page to try again.</p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Donations",
      value: stats?.totalDonations ?? 0,
      icon: Heart,
      color: "text-accent-600",
      bg: "bg-accent-50",
    },
    {
      label: "Total Amount",
      value: `KES ${(stats?.totalDonationAmount ?? 0).toLocaleString("en-KE")}`,
      icon: DollarSign,
      color: "text-success-600",
      bg: "bg-success-50",
    },
    {
      label: "Pending Donations",
      value: stats?.pendingDonations ?? 0,
      icon: Clock,
      color: "text-warning-600",
      bg: "bg-warning-50",
    },
    {
      label: "Successful Donations",
      value: stats?.successfulDonations ?? 0,
      icon: CheckCircle2,
      color: "text-success-600",
      bg: "bg-success-50",
    },
    {
      label: "Total Contacts",
      value: stats?.totalContacts ?? 0,
      icon: MessageSquare,
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      label: "New Contacts",
      value: stats?.newContacts ?? 0,
      icon: TrendingUp,
      color: "text-info-600",
      bg: "bg-info-50",
    },
    {
      label: "Emails Sent",
      value: stats?.totalEmailsSent ?? 0,
      icon: Mail,
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      label: "Failed Emails",
      value: stats?.failedEmails ?? 0,
      icon: AlertCircle,
      color: stats?.failedEmails ? "text-error-600" : "text-neutral-400",
      bg: stats?.failedEmails ? "bg-error-50" : "bg-neutral-50",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Overview of RHARK communication and donation activity.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className={cn("rounded-xl p-2.5", card.bg)}>
                <card.icon size={20} className={card.color} />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-neutral-900">{card.value}</p>
            <p className="mt-1 text-sm text-neutral-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <Link
          href="/admin/contacts"
          className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:border-primary-200 hover:shadow-sm"
        >
          <div>
            <p className="font-semibold text-neutral-900">Contact Requests</p>
            <p className="mt-1 text-sm text-neutral-500">View and reply to inquiries</p>
          </div>
          <div className="rounded-xl bg-primary-50 p-2.5 text-primary-600">
            <MessageSquare size={20} />
          </div>
        </Link>

        <Link
          href="/admin/donations"
          className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:border-accent-200 hover:shadow-sm"
        >
          <div>
            <p className="font-semibold text-neutral-900">Donations</p>
            <p className="mt-1 text-sm text-neutral-500">Manage and export donations</p>
          </div>
          <div className="rounded-xl bg-accent-50 p-2.5 text-accent-600">
            <Heart size={20} />
          </div>
        </Link>

        <Link
          href="/admin/emails"
          className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:border-info-200 hover:shadow-sm"
        >
          <div>
            <p className="font-semibold text-neutral-900">Email History</p>
            <p className="mt-1 text-sm text-neutral-500">Track sent communications</p>
          </div>
          <div className="rounded-xl bg-info-50 p-2.5 text-info-600">
            <Mail size={20} />
          </div>
        </Link>
      </div>

      {/* Recent notifications */}
      {notifications.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 font-display text-lg font-bold text-neutral-900">Recent Activity</h2>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start gap-4 rounded-2xl border p-4",
                  notification.isRead
                    ? "border-neutral-200 bg-white"
                    : "border-primary-200 bg-primary-50"
                )}
              >
                <div className="mt-0.5">
                  {notification.type === "new-donation" || notification.type === "donation-success" ? (
                    <div className="rounded-lg bg-success-50 p-2 text-success-600">
                      <Heart size={16} />
                    </div>
                  ) : notification.type === "new-contact" ? (
                    <div className="rounded-lg bg-primary-50 p-2 text-primary-600">
                      <MessageSquare size={16} />
                    </div>
                  ) : (
                    <div className="rounded-lg bg-error-50 p-2 text-error-600">
                      <AlertCircle size={16} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">{notification.title}</p>
                  <p className="mt-0.5 text-sm text-neutral-500">{notification.message}</p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {new Date(notification.createdAt).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}