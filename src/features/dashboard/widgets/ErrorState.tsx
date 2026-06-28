export const ErrorState = ({
  title = 'Something went wrong',
  description = 'An error occurred while loading this section.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) => {
  return (
    <div className="bg-destructive/5 border-destructive/20 flex flex-col items-center justify-center rounded-lg border p-8 text-center">
      <h3 className="text-destructive text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-background hover:bg-muted mt-6 rounded-md border px-4 py-2 text-sm font-medium"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
