interface SectionTitleProps {
  title: string;
  description?: string;
}

export const SectionTitle = ({ title, description }: SectionTitleProps) => {
  return (
    <div className="mb-6 space-y-1">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
};
