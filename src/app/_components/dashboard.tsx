"use client";

import { useState } from "react";
import {
  Users,
  TrendingUp,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Edit2,
  Trash2,
  Save,
  X,
} from "lucide-react";
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
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { api } from "@emalify/trpc/react";

const COLORS = {
  "High Budget Lead": "#EA4335",
  "Medium Budget Lead": "#FBBC04",
  "Low Budget Lead": "#34A853",
  "Form Submitted": "#4285F4",
  "Demo Call Booked": "#EA4335",
  "Potential Lead": "#FBBC04",
  Converted: "#34A853",
  "Dead Lead": "#9AA0A6",
};

const PROGRESS_ICONS: Record<string, any> = {
  "Form Submitted": AlertCircle,
  "Demo Call Booked": Phone,
  "Potential Lead": TrendingUp,
  Converted: CheckCircle,
  "Dead Lead": XCircle,
};

interface Lead {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  company: string;
  currentPosition: string;
  submissionDate: Date;
  label: string;
  progress: string;
  threadId: string;
  formMode: string;
  createdAt: Date;
  updatedAt: Date;
}

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [labelFilter, setLabelFilter] = useState("");
  const [progressFilter, setProgressFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingLead, setEditingLead] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});

  const { data: stats, isLoading: statsLoading } = api.lead.getStats.useQuery();
  const { data: leads, isLoading: leadsLoading } = api.lead.getAll.useQuery({
    label: labelFilter || undefined,
    progress: progressFilter || undefined,
    search: searchTerm || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const utils = api.useUtils();
  const updateLead = api.lead.update.useMutation({
    onSuccess: () => {
      void utils.lead.invalidate();
      setEditingLead(null);
      setEditForm({});
    },
  });

  const deleteLead = api.lead.delete.useMutation({
    onSuccess: () => {
      void utils.lead.invalidate();
    },
  });

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead.id);
    setEditForm(lead);
  };

  const handleSave = () => {
    if (editingLead && editForm) {
      updateLead.mutate({
        id: editingLead,
        fullName: editForm.fullName,
        email: editForm.email,
        phoneNumber: editForm.phoneNumber,
        company: editForm.company,
        currentPosition: editForm.currentPosition,
        label: editForm.label as any,
        progress: editForm.progress as any,
      });
    }
  };

  const handleCancel = () => {
    setEditingLead(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      deleteLead.mutate({ id });
    }
  };

  if (statsLoading || leadsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-500 p-2">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Emalify
                </h1>
                <p className="text-sm text-gray-600">
                  Lead Management Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stats?.totalLeads || 0}
                </p>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <Users className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {conversionRate}%
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Budget</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stats?.labelStats.find((s) => s.label === "High Budget Lead")
                    ?.count || 0}
                </p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Lead Labels Distribution */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
                <Bar dataKey="count" fill="#EA4335" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads Over Time */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Leads Over Time (Last 30 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={leadsOverTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#EA4335"
                strokeWidth={2}
                dot={{ fill: "#EA4335" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="mb-1 block text-sm text-gray-600">Search</label>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name, email, company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Budget Label
              </label>
              <select
                value={labelFilter}
                onChange={(e) => setLabelFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
              >
                <option value="">All Labels</option>
                <option value="High Budget Lead">High Budget</option>
                <option value="Medium Budget Lead">Medium Budget</option>
                <option value="Low Budget Lead">Low Budget</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Progress
              </label>
              <select
                value={progressFilter}
                onChange={(e) => setProgressFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
              >
                <option value="">All Progress</option>
                <option value="Form Submitted">Form Submitted</option>
                <option value="Demo Call Booked">Demo Call Booked</option>
                <option value="Potential Lead">Potential Lead</option>
                <option value="Converted">Converted</option>
                <option value="Dead Lead">Dead Lead</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-600">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              All Leads ({leads?.length || 0})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase">
                    Label
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {leads?.map((lead) => {
                  const isEditing = editingLead === lead.id;
                  const ProgressIcon = PROGRESS_ICONS[lead.progress];

                  return (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.fullName || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                fullName: e.target.value,
                              })
                            }
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">
                            {lead.fullName}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="email"
                            value={editForm.email || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                email: e.target.value,
                              })
                            }
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          <div className="text-sm text-gray-600">
                            {lead.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.phoneNumber || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                phoneNumber: e.target.value,
                              })
                            }
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          <div className="text-sm text-gray-600">
                            {lead.phoneNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.company || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                company: e.target.value,
                              })
                            }
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          <div className="text-sm text-gray-600">
                            {lead.company}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.currentPosition || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                currentPosition: e.target.value,
                              })
                            }
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          <div className="text-sm text-gray-600">
                            {lead.currentPosition}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <select
                            value={editForm.label || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                label: e.target.value,
                              })
                            }
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          >
                            <option value="High Budget Lead">
                              High Budget
                            </option>
                            <option value="Medium Budget Lead">
                              Medium Budget
                            </option>
                            <option value="Low Budget Lead">Low Budget</option>
                          </select>
                        ) : (
                          <span
                            className="inline-flex rounded-full px-2 py-1 text-xs font-semibold"
                            style={{
                              backgroundColor: `${COLORS[lead.label as keyof typeof COLORS]}20`,
                              color: COLORS[lead.label as keyof typeof COLORS],
                            }}
                          >
                            {lead.label.replace(" Budget Lead", "")}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <select
                            value={editForm.progress || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                progress: e.target.value,
                              })
                            }
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          >
                            <option value="Form Submitted">
                              Form Submitted
                            </option>
                            <option value="Demo Call Booked">
                              Demo Call Booked
                            </option>
                            <option value="Potential Lead">
                              Potential Lead
                            </option>
                            <option value="Converted">Converted</option>
                            <option value="Dead Lead">Dead Lead</option>
                          </select>
                        ) : (
                          <div className="flex items-center gap-2">
                            {ProgressIcon && (
                              <ProgressIcon
                                className="h-4 w-4"
                                style={{
                                  color:
                                    COLORS[
                                      lead.progress as keyof typeof COLORS
                                    ],
                                }}
                              />
                            )}
                            <span className="text-sm text-gray-600">
                              {lead.progress}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                        {format(new Date(lead.submissionDate), "MMM dd, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-right text-sm whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={handleSave}
                              disabled={updateLead.isPending}
                              className="rounded p-1 text-green-600 hover:bg-green-50"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="rounded p-1 text-gray-600 hover:bg-gray-50"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(lead)}
                              className="rounded p-1 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(lead.id)}
                              disabled={deleteLead.isPending}
                              className="rounded p-1 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {leads?.length === 0 && (
              <div className="py-12 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  No leads found. Adjust your filters or add new leads.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
