import { Spinner } from "./spinner";

type LoadingSpinnerProps = {
  message?: string;
  className?: string;
  spinnerSize?: string;
};

export function LoadingSpinner({
  message,
  className = "",
  spinnerSize = "h-8 w-8",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex min-h-[400px] items-center justify-center ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner className={`${spinnerSize} text-red-600`} />
        {message && (
          <p className="max-w-md text-center text-base leading-relaxed font-medium text-gray-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
