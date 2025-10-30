"use client";

import { Users, TrendingUp, CheckCircle, DollarSign } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { api } from "@emalify/trpc/react";
import { LoadingSpinner } from "../components/loading-spinner";

const COLORS = {
  "High Budget Lead": "#0e75bc",
  "Medium Budget Lead": "#fcd11f",
  "Low Budget Lead": "#34A853",
  "Form Submitted": "#4285F4",
  "Demo Call Booked": "#0e75bc",
  "Potential Lead": "#fcd11f",
  Converted: "#34A853",
  "Dead Lead": "#9AA0A6",
} as const;

export function DashboardPageClient() {
  const { data: stats } = api.lead.getStats.useQuery();
  if (!stats)
    throw new Error("Stats should be available from server side prefetch");

  // Prepare data for charts
  const labelChartData =
    stats?.labelStats.map((stat) => ({
      name: stat.label.replace(" Budget Lead", ""),
      value: stat.count,
      fullName: stat.label,
    })) || [];

  const progressChartData =
    stats?.progressStats.map((stat) => ({
      name: stat.progress,
      count: stat.count,
    })) || [];

  // Group leads by date for line chart
  const leadsOverTimeData =
    stats?.leadsOverTime.reduce((acc: any[], lead) => {
      const dateStr = format(new Date(lead.submissionDate), "MMM dd");
      const existing = acc.find((item) => item.date === dateStr);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ date: dateStr, count: 1 });
      }
      return acc;
    }, []) || [];

  const totalConverted =
    stats?.progressStats.find((s) => s.progress === "Converted")?.count || 0;
  const conversionRate = stats?.totalLeads
    ? ((totalConverted / stats.totalLeads) * 100).toFixed(1)
    : "0";

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your lead pipeline and performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {stats?.totalLeads || 0}
              </p>
            </div>
            <div
              className="rounded-full p-3"
              style={{ backgroundColor: "#0e75bc20" }}
            >
              <Users className="h-6 w-6" style={{ color: "#0e75bc" }} />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Converted</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {totalConverted}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {conversionRate}%
              </p>
            </div>
            <div
              className="rounded-full p-3"
              style={{ backgroundColor: "#0e75bc20" }}
            >
              <TrendingUp className="h-6 w-6" style={{ color: "#0e75bc" }} />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Budget</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {stats?.labelStats.find((s) => s.label === "High Budget Lead")
                  ?.count || 0}
              </p>
            </div>
            <div
              className="rounded-full p-3"
              style={{ backgroundColor: "#fcd11f40" }}
            >
              <DollarSign className="h-6 w-6" style={{ color: "#d4a000" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Lead Labels Distribution */}
        <div className="rounded-lg bg-gray-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Lead Budget Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={labelChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) =>
                  `${entry.name} ${(entry.percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {labelChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.fullName as keyof typeof COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Status */}
        <div className="rounded-lg bg-gray-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Lead Progress Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0e75bc" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leads Over Time */}
      <div className="mb-8 rounded-lg bg-gray-50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Leads Over Time (Last 30 Days)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={leadsOverTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#0e75bc"
              strokeWidth={2}
              dot={{ fill: "#0e75bc" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
