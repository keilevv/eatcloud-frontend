import { EmptyState } from '@/components/feedback/ErrorMessage';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <EmptyState
        title="Page not found"
        description="The page you are looking for does not exist."
      />
    </div>
  );
}
