"use client";

import { useState } from "react";
import { UserCog, Edit2, Trash2, Save, X, Plus } from "lucide-react";
import { format } from "date-fns";
import { api } from "@emalify/trpc/react";
import { LoadingSpinner } from "../components/loading-spinner";
import { Spinner } from "../components/loading-spinner/spinner";

export function AdminsPageClient() {
  const [editingAdmin, setEditingAdmin] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState<{
    fullName: string;
    email: string;
  }>({
    fullName: "",
    email: "",
  });
  const [addForm, setAddForm] = useState({
    fullName: "",
    email: "",
  });

  const { data: admins, isLoading: adminsLoading } =
    api.admin.getAll.useQuery();

  const utils = api.useUtils();

  const createAdmin = api.admin.create.useMutation({
    onSuccess: async () => {
      await utils.admin.invalidate();
      setIsAdding(false);
      setAddForm({ fullName: "", email: "" });
    },
    onError: (error) => {
      alert(`Failed to create admin: ${error.message}`);
    },
  });

  const updateAdmin = api.admin.update.useMutation({
    onSuccess: async () => {
      await utils.admin.invalidate();
      setEditingAdmin(null);
      setEditForm({ fullName: "", email: "" });
    },
    onError: (error) => {
      alert(`Failed to update admin: ${error.message}`);
    },
  });

  const deleteAdmin = api.admin.delete.useMutation({
    onSuccess: async () => {
      await utils.admin.invalidate();
    },
    onError: (error) => {
      alert(`Failed to delete admin: ${error.message}`);
    },
  });

  const handleEdit = (admin: NonNullable<typeof admins>[number]) => {
    setEditingAdmin(admin.id);
    setEditForm({
      fullName: admin.fullName,
      email: admin.email,
    });
  };

  const handleSave = () => {
    if (editingAdmin && editForm.fullName && editForm.email) {
      updateAdmin.mutate({
        id: editingAdmin,
        fullName: editForm.fullName,
        email: editForm.email,
      });
    }
  };

  const handleCancel = () => {
    setEditingAdmin(null);
    setEditForm({ fullName: "", email: "" });
  };

  const handleDelete = (id: string, adminName: string) => {
    if (
      confirm(
        `Are you sure you want to delete ${adminName}? They will no longer receive lead notifications.`,
      )
    ) {
      deleteAdmin.mutate({ id });
    }
  };

  const handleAdd = () => {
    if (addForm.fullName && addForm.email) {
      createAdmin.mutate(addForm);
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setAddForm({ fullName: "", email: "" });
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: "edit" | "add") => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (action === "edit") {
        handleSave();
      } else {
        handleAdd();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (action === "edit") {
        handleCancel();
      } else {
        handleCancelAdd();
      }
    }
  };

  return (
    <div className="flex flex-col p-8" style={{ height: "calc(100vh - 88px)" }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
          <p className="mt-2 text-gray-600">
            Manage admin users who receive new lead notification emails
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors hover:bg-blue-700"
          style={{ backgroundColor: "#0e75bc" }}
        >
          <Plus className="h-5 w-5" />
          Add Admin
        </button>
      </div>

      {/* Admins Table */}
      <div className="min-h-0 flex-1 rounded-lg bg-gray-50">
        <div className="flex h-full flex-col overflow-hidden">
          {adminsLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <LoadingSpinner message="Loading admins..." />
            </div>
          ) : !admins?.length ? (
            <div className="py-12 text-center">
              <UserCog className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                No admins found. Add your first admin to start receiving lead
                notifications.
              </p>
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-600 uppercase">
                      Actions
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-600 uppercase">
                      Full Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-600 uppercase">
                      Email
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-600 uppercase">
                      Created At
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-600 uppercase">
                      Updated At
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {admins?.map((admin) => {
                    const isEditing = editingAdmin === admin.id;

                    return (
                      <tr key={admin.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <button
                                onClick={handleSave}
                                title="Save"
                                disabled={updateAdmin.isPending}
                                className="cursor-pointer rounded p-1 text-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {updateAdmin.isPending ? (
                                  <Spinner className="h-4 w-4 border-2 border-green-600 border-t-transparent" />
                                ) : (
                                  <Save className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                title="Cancel"
                                onClick={handleCancel}
                                className="cursor-pointer rounded p-1 text-gray-600 hover:bg-gray-50"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleDelete(admin.id, admin.fullName)
                                }
                                disabled={deleteAdmin.isPending}
                                className="cursor-pointer rounded p-1 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleEdit(admin)}
                                style={{ color: "#0e75bc" }}
                                className="cursor-pointer rounded p-1 hover:bg-blue-50"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.fullName}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  fullName: e.target.value,
                                })
                              }
                              onKeyDown={(e) => handleKeyDown(e, "edit")}
                              className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                              placeholder="Full Name"
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900">
                              {admin.fullName}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {isEditing ? (
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  email: e.target.value,
                                })
                              }
                              onKeyDown={(e) => handleKeyDown(e, "edit")}
                              className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                              placeholder="email@example.com"
                            />
                          ) : (
                            <div className="text-sm text-gray-600">
                              {admin.email}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-600">
                          {format(new Date(admin.createdAt), "MMM dd, yyyy")}
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-600">
                          {format(new Date(admin.updatedAt), "MMM dd, yyyy")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Admin Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Add New Admin
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              Add an admin to receive lead notifications via email.
            </p>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={addForm.fullName}
                  onChange={(e) =>
                    setAddForm({ ...addForm, fullName: e.target.value })
                  }
                  onKeyDown={(e) => handleKeyDown(e, "add")}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) =>
                    setAddForm({ ...addForm, email: e.target.value })
                  }
                  onKeyDown={(e) => handleKeyDown(e, "add")}
                  placeholder="john@example.com"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancelAdd}
                disabled={createAdmin.isPending}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={
                  !addForm.fullName || !addForm.email || createAdmin.isPending
                }
                className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: "#0e75bc" }}
              >
                {createAdmin.isPending ? (
                  <>
                    <Spinner className="h-4 w-4 border-2 border-white border-t-transparent" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Admin
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
