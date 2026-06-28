interface ErrorMessageProps {
  title?: string;
  message: string;
}

export function ErrorMessage({
  title = 'Something went wrong',
  message,
}: ErrorMessageProps) {
  return (
    <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4">
      <h3 className="text-destructive font-medium">{title}</h3>
      <p className="text-muted-foreground mt-1 text-sm">{message}</p>
    </div>
  );
}

export function EmptyState({
  title = 'No data available',
  description = 'There is nothing to display yet.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <h3 className="font-medium">{title}</h3>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    </div>
  );
}
