"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { StatsCard } from "@/components/admin/StatsCard";
import {
  Heart,
  MessageSquare,
  Newspaper,
  Images,
  Users,
  Handshake,
  Mail,
  CalendarDays,
  DollarSign,
  AlertCircle,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalDonationAmount: 0,
    activeProjects: 0,
    publishedNews: 0,
    galleryPhotos: 0,
    registeredVolunteers: 0,
    contactMessages: 0,
    newsletterSubscribers: 0,
    upcomingEvents: 0,
  });
  const [monthlyDonations, setMonthlyDonations] = useState<
    { month: string; amount: number; count: number }[]
  >([]);
  const [projectStatus, setProjectStatus] = useState<
    { name: string; value: number }[]
  >([]);
  const [volunteerGrowth, setVolunteerGrowth] = useState<
    { month: string; count: number }[]
  >([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Fetch all stats in parallel
        const results = await Promise.all([
          supabase.from("donations").select("*", { count: "exact", head: true }),
          supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "active"),
          supabase.from("news").select("*", { count: "exact", head: true }).eq("status", "published"),
          supabase.from("gallery").select("*", { count: "exact", head: true }),
          supabase.from("volunteers").select("*", { count: "exact", head: true }),
          supabase.from("contact_messages").select("*", { count: "exact", head: true }),
          supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
          supabase.from("events").select("*", { count: "exact", head: true }).gte("event_date", new Date().toISOString().split("T")[0]),
          supabase.from("donations").select("amount, created_at").eq("status", "successful").order("created_at", { ascending: true }),
          supabase.from("projects").select("status").in("status", ["active", "completed", "upcoming", "on-hold"]),
          supabase.from("volunteers").select("created_at").order("created_at", { ascending: true }),
        ]);

        const totalAmount = results[8].data?.reduce((sum: number, d: any) => sum + Number(d.amount), 0) || 0;

        setStats({
          totalDonations: results[0].count || 0,
          totalDonationAmount: totalAmount,
          activeProjects: results[1].count || 0,
          publishedNews: results[2].count || 0,
          galleryPhotos: results[3].count || 0,
          registeredVolunteers: results[4].count || 0,
          contactMessages: results[5].count || 0,
          newsletterSubscribers: results[6].count || 0,
          upcomingEvents: results[7].count || 0,
        });

        // Process monthly donations
        const monthlyMap: Record<string, { amount: number; count: number }> = {};
        results[8].data?.forEach((d: any) => {
          const month = new Date(d.created_at).toLocaleDateString("en-KE", {
            month: "short",
            year: "2-digit",
          });
          if (!monthlyMap[month]) {
            monthlyMap[month] = { amount: 0, count: 0 };
          }
          monthlyMap[month].amount += Number(d.amount);
          monthlyMap[month].count += 1;
        });
        setMonthlyDonations(
          Object.entries(monthlyMap).map(([month, data]) => ({
            month,
            amount: data.amount,
            count: data.count,
          }))
        );

        // Process project status
        const statusMap: Record<string, number> = {};
        results[9].data?.forEach((p: any) => {
          statusMap[p.status] = (statusMap[p.status] || 0) + 1;
        });
        setProjectStatus(
          Object.entries(statusMap).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
          }))
        );

        // Process volunteer growth
        const volunteerMap: Record<string, number> = {};
        results[10].data?.forEach((v: any) => {
          const month = new Date(v.created_at).toLocaleDateString("en-KE", {
            month: "short",
            year: "2-digit",
          });
          volunteerMap[month] = (volunteerMap[month] || 0) + 1;
        });
        setVolunteerGrowth(
          Object.entries(volunteerMap).map(([month, count]) => ({
            month,
            count,
          }))
        );
      } catch {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [supabase]);

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
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-neutral-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Overview of RHARK activities and content
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Total Donations"
          value={stats.totalDonations}
          icon={Heart}
          color="text-accent-600"
          bg="bg-accent-50"
        />
        <StatsCard
          label="Total Amount"
          value={`KES ${stats.totalDonationAmount.toLocaleString("en-KE")}`}
          icon={DollarSign}
          color="text-success-600"
          bg="bg-success-50"
        />
        <StatsCard
          label="Active Projects"
          value={stats.activeProjects}
          icon={Activity}
          color="text-primary-600"
          bg="bg-primary-50"
        />
        <StatsCard
          label="Published News"
          value={stats.publishedNews}
          icon={Newspaper}
          color="text-info-600"
          bg="bg-info-50"
        />
        <StatsCard
          label="Gallery Photos"
          value={stats.galleryPhotos}
          icon={Images}
          color="text-accent-600"
          bg="bg-accent-50"
        />
        <StatsCard
          label="Volunteers"
          value={stats.registeredVolunteers}
          icon={Handshake}
          color="text-success-600"
          bg="bg-success-50"
        />
        <StatsCard
          label="Contact Messages"
          value={stats.contactMessages}
          icon={MessageSquare}
          color="text-warning-600"
          bg="bg-warning-50"
        />
        <StatsCard
          label="Newsletter Subscribers"
          value={stats.newsletterSubscribers}
          icon={Mail}
          color="text-primary-600"
          bg="bg-primary-50"
        />
        <StatsCard
          label="Upcoming Events"
          value={stats.upcomingEvents}
          icon={CalendarDays}
          color="text-info-600"
          bg="bg-info-50"
        />
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Monthly Donations Chart */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-neutral-900">
            Monthly Donations
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyDonations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="amount" fill="#0088FE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status Chart */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-neutral-900">
            Project Status
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }: any) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884D8"
                  dataKey="value"
                >
                  {projectStatus.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volunteer Growth Chart */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-neutral-900">
            Volunteer Growth
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volunteerGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#00C49F"
                  strokeWidth={2}
                  dot={{ fill: "#00C49F", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-neutral-900">
            Quick Actions
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/admin/news/new"
              className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition-colors hover:border-primary-200 hover:bg-primary-50"
            >
              <Newspaper size={20} className="text-primary-600" />
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  New Article
                </p>
                <p className="text-xs text-neutral-500">
                  Create news or blog post
                </p>
              </div>
            </Link>
            <Link
              href="/admin/events/new"
              className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition-colors hover:border-accent-200 hover:bg-accent-50"
            >
              <CalendarDays size={20} className="text-accent-600" />
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  New Event
                </p>
                <p className="text-xs text-neutral-500">
                  Add upcoming event
                </p>
              </div>
            </Link>
            <Link
              href="/admin/team/new"
              className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition-colors hover:border-success-200 hover:bg-success-50"
            >
              <Users size={20} className="text-success-600" />
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  Add Team Member
                </p>
                <p className="text-xs text-neutral-500">
                  Add staff or board member
                </p>
              </div>
            </Link>
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition-colors hover:border-info-200 hover:bg-info-50"
            >
              <Activity size={20} className="text-info-600" />
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  New Project
                </p>
                <p className="text-xs text-neutral-500">
                  Add project or program
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}