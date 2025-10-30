import Link from "next/link";
import { PieChart } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-700">
          Page Not Found
        </p>
        <p className="mt-2 text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#0e75bc] px-4 py-2 text-white transition-colors hover:bg-blue-800/80"
          >
            <PieChart className="h-5 w-5" />
            <span className="text-sm font-medium">Go to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
