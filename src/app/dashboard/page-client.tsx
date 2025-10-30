"use client";

import {
  Users,
  CheckCircle,
  DollarSign,
  Target,
  PhoneCall,
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

  // Calculate additional metrics
  const demoCallBooked =
    stats?.progressStats.find((s) => s.progress === "Demo Call Booked")
      ?.count ?? 0;
  const potentialLeads =
    stats?.progressStats.find((s) => s.progress === "Potential Lead")?.count ??
    0;
  const deadLeads =
    stats?.progressStats.find((s) => s.progress === "Dead Lead")?.count ?? 0;
  const formSubmitted =
    stats?.progressStats.find((s) => s.progress === "Form Submitted")?.count ??
    0;

  const activeLeads = (stats?.totalLeads ?? 0) - deadLeads;
  const demoToConversionRate = demoCallBooked
    ? ((totalConverted / demoCallBooked) * 100).toFixed(1)
    : "0";

  // Conversion Funnel Data - showing actual progression
  // Calculate percentages relative to total leads (not first stage)
  const totalLeadsCount = stats?.totalLeads || 1;
  const funnelData = [
    {
      name: "Form Submitted",
      value: formSubmitted,
      fill: "#4285F4",
      percentage: ((formSubmitted / totalLeadsCount) * 100).toFixed(1),
    },
    {
      name: "Demo Call Booked",
      value: demoCallBooked,
      fill: "#0e75bc",
      percentage: ((demoCallBooked / totalLeadsCount) * 100).toFixed(1),
    },
    {
      name: "Potential Lead",
      value: potentialLeads,
      fill: "#fcd11f",
      percentage: ((potentialLeads / totalLeadsCount) * 100).toFixed(1),
    },
    {
      name: "Converted",
      value: totalConverted,
      fill: "#34A853",
      percentage: ((totalConverted / totalLeadsCount) * 100).toFixed(1),
    },
  ];

  // Weekly trend data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date: format(date, "EEE"),
      fullDate: startOfDay(date),
      leads: 0,
      converted: 0,
    };
  });

  stats?.leadsOverTime.forEach((lead) => {
    const leadDate = startOfDay(new Date(lead.submissionDate));
    const dayData = last7Days.find(
      (d) => d.fullDate.getTime() === leadDate.getTime(),
    );
    if (dayData) {
      dayData.leads++;
      if (lead.progress === "Converted") {
        dayData.converted++;
      }
    }
  });

  // Budget performance analysis
  const budgetPerformance = stats?.labelStats.map((stat) => {
    const leadsForLabel = stats.leadsOverTime.filter(
      (l) => l.label === stat.label,
    );
    const convertedCount = leadsForLabel.filter(
      (l) => l.progress === "Converted",
    ).length;
    const convRate =
      stat.count > 0 ? ((convertedCount / stat.count) * 100).toFixed(1) : "0";

    return {
      label: stat.label.replace(" Budget Lead", ""),
      total: stat.count,
      converted: convertedCount,
      conversionRate: parseFloat(convRate),
    };
  });

  // Progress breakdown with percentages
  const progressBreakdown = stats?.progressStats.map((stat) => ({
    name: stat.progress,
    count: stat.count,
    percentage: ((stat.count / (stats?.totalLeads || 1)) * 100).toFixed(1),
    fill: COLORS[stat.progress as keyof typeof COLORS],
  }));

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
                {(
                  ((stats?.labelStats.find(
                    (s) => s.label === "High Budget Lead",
                  )?.count ?? 0) /
                    (stats?.totalLeads ?? 1)) *
                  100
                ).toFixed(0)}
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

      {/* Charts - Row 1 */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Conversion Funnel */}
        <div className="rounded-lg bg-gray-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Lead Stage Distribution
          </h2>
          <p className="mb-4 text-xs text-gray-500">
            Percentage of total leads in each stage
          </p>
          <div className="space-y-3">
            {funnelData.map((stage) => {
              const widthPercentage = parseFloat(stage.percentage);
              return (
                <div key={stage.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {stage.name}
                    </span>
                    <span className="text-gray-600">
                      {stage.value} ({stage.percentage}%)
                    </span>
                  </div>
                  <div className="h-10 w-full rounded-lg bg-gray-200">
                    <div
                      className="flex h-full items-center justify-center rounded-lg text-sm font-semibold text-white transition-all"
                      style={{
                        width: `${Math.max(widthPercentage, stage.value > 0 ? 10 : 0)}%`,
                        backgroundColor: stage.fill,
                        minWidth: stage.value > 0 ? "60px" : "0",
                      }}
                    >
                      {stage.value > 0 && stage.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="rounded-lg bg-gray-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            7-Day Activity Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="leads"
                fill="#0e75bc"
                name="New Leads"
                radius={[8, 8, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="converted"
                stroke="#34A853"
                strokeWidth={3}
                name="Conversions"
                dot={{ fill: "#34A853", r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts - Row 2 */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* Lead Labels Distribution */}
        <div className="rounded-lg bg-gray-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Budget Distribution
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={labelChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props) =>
                  `${props.name!} (${(((props.percent as number | undefined) ?? 0) * 100).toFixed(0)}%)`
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
          <ResponsiveContainer width="100%" height={280}>
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
              <Bar dataKey="count" fill="#0e75bc" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Performance */}
        <div className="rounded-lg bg-gray-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Budget Performance
          </h2>
          <div className="space-y-4">
            {budgetPerformance?.map((budget) => (
              <div key={budget.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {budget.label}
                  </span>
                  <span className="text-sm text-gray-600">
                    {budget.converted}/{budget.total}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${budget.conversionRate}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {budget.conversionRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                Overall
              </span>
              <span className="text-lg font-bold text-green-600">
                {conversionRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Over Time */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Lead Acquisition Trend (Last 30 Days)
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

        {/* Progress Breakdown */}
        <div className="rounded-lg bg-gray-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Pipeline Breakdown
          </h2>
          <div className="space-y-3">
            {progressBreakdown?.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-lg bg-white p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.percentage}% of total
                    </p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {item.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
