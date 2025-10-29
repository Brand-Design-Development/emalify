"use client";

import { useState } from "react";
import {
  Users,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  Edit2,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { format } from "date-fns";
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

export function LeadsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [labelFilter, setLabelFilter] = useState("");
  const [progressFilter, setProgressFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingLead, setEditingLead] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});

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

  if (leadsLoading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="text-lg text-gray-600">Loading leads...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
        <p className="mt-2 text-gray-600">
          Search, filter, and manage all your leads
        </p>
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
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
              className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
            >
              <option value="">All Labels</option>
              <option value="High Budget Lead">High Budget</option>
              <option value="Medium Budget Lead">Medium Budget</option>
              <option value="Low Budget Lead">Low Budget</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600">Progress</label>
            <select
              value={progressFilter}
              onChange={(e) => setProgressFilter(e.target.value)}
              className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
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
              className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
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
                          className="w-full cursor-pointer rounded border border-gray-300 px-2 py-1 text-sm"
                        >
                          <option value="High Budget Lead">High Budget</option>
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
                          className="w-full cursor-pointer rounded border border-gray-300 px-2 py-1 text-sm"
                        >
                          <option value="Form Submitted">Form Submitted</option>
                          <option value="Demo Call Booked">
                            Demo Call Booked
                          </option>
                          <option value="Potential Lead">Potential Lead</option>
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
                                  COLORS[lead.progress as keyof typeof COLORS],
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
                            className="cursor-pointer rounded p-1 text-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="cursor-pointer rounded p-1 text-gray-600 hover:bg-gray-50"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(lead)}
                            className="cursor-pointer rounded p-1 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            disabled={deleteLead.isPending}
                            className="cursor-pointer rounded p-1 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
    </div>
  );
}
