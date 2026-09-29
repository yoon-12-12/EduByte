interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <div>
      <h1
        className="
          text-4xl
          font-bold

          text-slate-900
          dark:text-slate-100
        "
      >
        {title}
      </h1>

      {description && (
        <p
          className="
            mt-2

            text-slate-500
            dark:text-slate-400
          "
        >
          {description}
        </p>
      )}
    </div>
  );
}