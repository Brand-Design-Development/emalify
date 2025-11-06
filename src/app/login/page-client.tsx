"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@emalify/trpc/react";
import { Lock, Loader2 } from "lucide-react";
import Image from "next/image";

export function LoginPageClient() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const loginMutation = api.auth.login.useMutation({
    onSuccess: () => {
      console.log("Login successful");
      router.push("/dashboard");
      router.refresh();
    },
    onError: (error) => {
      setError(error.message || "Invalid password");
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!password) {
      setError("Please enter a password");
      setIsLoading(false);
      return;
    }

    loginMutation.mutate({ password });
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "#0e75bc" }}
    >
      <div className="w-full max-w-lg space-y-8 rounded-2xl bg-white p-10 shadow-2xl">
        {/* Logo and Header */}
        <div className="text-center">
          <div
            className="mx-auto flex justify-center rounded-lg p-2"
            style={{ backgroundColor: "#0e75bc" }}
          >
            <Image
              src="/logo.png"
              alt="Emalify Logo"
              width={180}
              height={180}
            />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your password to access the Lead Managment System
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 py-3 pr-3 pl-10 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Admin Password"
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full cursor-pointer justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: "#0e75bc" }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Log in"
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>Lead Management System</p>
        </div>
      </div>
    </div>
  );
}
