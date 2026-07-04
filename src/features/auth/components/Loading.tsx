export const SessionLoading = () => {
  return (
    <div className="bg-background flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: '#00B3FE', borderTopColor: 'transparent' }}></div>
        <p className="text-muted-foreground animate-pulse text-sm">
          Restaurando sesión...
        </p>
      </div>
    </div>
  );
};

export const LoginLoading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: '#00B3FE', borderTopColor: 'transparent' }}></div>
    </div>
  );
};
