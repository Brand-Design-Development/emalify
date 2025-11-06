"use client";

import {
  Users,
  CheckCircle,
  DollarSign,
  Target,
  PhoneCall,
  Inbox,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  ComposedChart,
  Line,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { api } from "@emalify/trpc/react";

const COLORS = {
  "High Budget Lead": "#0e75bc",
  "Medium Budget Lead": "#fcd11f",
  "Low Budget Lead": "#34A853",
  "No Label": "#9AA0A6",
  "Form Submitted": "#4285F4",
  "Demo Booked": "#0e75bc",
  "Potential Lead": "#fcd11f",
  Converted: "#34A853",
  "Dead Lead": "#9AA0A6",
} as const;

export function DashboardPageClient() {
  const { data: stats } = api.lead.getStats.useQuery();

  const hasLeads = (stats?.totalLeads ?? 0) > 0;

  // Prepare data for charts
  const labelChartData =
    stats?.labelStats.map((stat) => ({
      name: stat.label
        .replace(" Budget Lead", "")
        .replace("No Label", "No Label"),
      value: stat.count,
      fullName: stat.label,
    })) ?? [];

  const progressChartData =
    stats?.progressStats.map((stat) => ({
      name: stat.progress,
      count: stat.count,
    })) ?? [];

  // Group leads by date for line chart
  const leadsOverTimeData =
    stats?.leadsOverTime.reduce(
      (acc: Array<{ date: string; count: number }>, lead) => {
        const dateStr = format(new Date(lead.submissionDate), "MMM dd");
        const existing = acc.find((item) => item.date === dateStr);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ date: dateStr, count: 1 });
        }
        return acc;
      },
      [],
    ) ?? [];

  const totalConverted =
    stats?.progressStats.find((s) => s.progress === "Converted")?.count ?? 0;
  const conversionRate = stats?.totalLeads
    ? ((totalConverted / stats.totalLeads) * 100).toFixed(1)
    : "0";

  const demoCallBooked =
    stats?.progressStats.find((s) => s.progress === "Demo Booked")?.count ?? 0;
  const deadLeads =
    stats?.progressStats.find((s) => s.progress === "Dead Lead")?.count ?? 0;

  const activeLeads = (stats?.totalLeads ?? 0) - deadLeads;
  const demoToConversionRate = demoCallBooked
    ? ((totalConverted / demoCallBooked) * 100).toFixed(1)
    : "0";

  // 30-day trend data with all progress states
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return {
      date: format(date, "MMM dd"),
      fullDate: startOfDay(date),
      "Form Submitted": 0,
      "Demo Booked": 0,
      "Potential Lead": 0,
      Converted: 0,
      "Dead Lead": 0,
    };
  });

  stats?.leadsOverTime.forEach((lead) => {
    const leadDate = startOfDay(new Date(lead.submissionDate));
    const dayData = last30Days.find(
      (d) => d.fullDate.getTime() === leadDate.getTime(),
    );
    if (dayData && lead.progress) {
      dayData[lead.progress as keyof typeof dayData]++;
    }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your lead pipeline and performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {stats?.totalLeads ?? 0}
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
              <p className="text-sm text-gray-600">Active Leads</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {activeLeads}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {deadLeads} dead lead{deadLeads !== 1 && "s"}
              </p>
            </div>
            <div
              className="rounded-full p-3"
              style={{ backgroundColor: "#0e75bc20" }}
            >
              <Target className="h-6 w-6" style={{ color: "#0e75bc" }} />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Demo Calls</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {demoCallBooked}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {demoToConversionRate}% convert
              </p>
            </div>
            <div
              className="rounded-full p-3"
              style={{ backgroundColor: "#0e75bc20" }}
            >
              <PhoneCall className="h-6 w-6" style={{ color: "#0e75bc" }} />
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
              <p className="mt-1 text-xs font-medium text-green-600">
                {conversionRate}% rate
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
              <p className="text-sm text-gray-600">High Budget</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {stats?.labelStats.find((s) => s.label === "High Budget Lead")
                  ?.count ?? 0}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {stats?.totalLeads && stats.totalLeads > 0
                  ? (
                      ((stats?.labelStats.find(
                        (s) => s.label === "High Budget Lead",
                      )?.count ?? 0) /
                        stats.totalLeads) *
                      100
                    ).toFixed(0)
                  : "0"}
                % of total
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

      {/* No Leads Message */}
      {!hasLeads && (
        <div className="flex items-center justify-center py-20">
          <div className="rounded-lg bg-gray-50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <Inbox className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No Leads Yet
            </h3>
            <p className="text-gray-600">
              Your leads will appear here once you start receiving submissions.
            </p>
          </div>
        </div>
      )}

      {/* 7-Day Activity Trend */}
      {hasLeads && (
        <div className="mb-8">
          <div className="rounded-lg bg-gray-50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              30-Day Activity Trend
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={last30Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="Form Submitted"
                  stackId="a"
                  fill="#4285F4"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Demo Booked"
                  stackId="a"
                  fill="#0e75bc"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Potential Lead"
                  stackId="a"
                  fill="#fcd11f"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Converted"
                  stackId="a"
                  fill="#34A853"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Dead Lead"
                  stackId="a"
                  fill="#9AA0A6"
                  radius={[8, 8, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Budget Distribution & Lead Progress Status */}
      {hasLeads && (
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Budget Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={labelChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props) =>
                    `${props.name!} (${(((props.percent as number | undefined) ?? 0) * 100).toFixed(0)}%)`
                  }
                  outerRadius={90}
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
                  tick={{ fontSize: 11 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {progressChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.name as keyof typeof COLORS]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Lead Acquisition Trend */}
      {hasLeads && (
        <div className="mb-8">
          <div className="rounded-lg bg-gray-50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              30-Day New Leads Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={leadsOverTimeData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0e75bc" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0e75bc" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#0e75bc"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorLeads)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
