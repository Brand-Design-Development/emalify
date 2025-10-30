import { LoadingSpinner } from "./loading-spinner";

type PageSpinnerProps = {
  message: string;
};

export default function PageSpinner({ message }: PageSpinnerProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <LoadingSpinner message={message} />
    </div>
  );
}
