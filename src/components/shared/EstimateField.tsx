import type { ReactElement } from "react";

interface EstimateFieldProps {
  id: string;
  name: string;
  label: string;
  errorId: string;
  fieldClassName: string;
  labelClassName: string;
  type?: "text" | "tel" | "email";
  autoComplete?: string;
  multiline?: boolean;
  error?: string;
  invalid?: boolean;
  className?: string;
  defaultValue?: string;
}

export function EstimateField({
  id,
  name,
  label,
  errorId,
  fieldClassName,
  labelClassName,
  type = "text",
  autoComplete,
  multiline = false,
  error,
  invalid,
  className,
  defaultValue,
}: EstimateFieldProps): ReactElement {
  const isInvalid = invalid ?? Boolean(error);
  const shared = {
    id,
    name,
    defaultValue,
    placeholder: label,
    "aria-invalid": isInvalid,
    "aria-describedby": isInvalid ? errorId : undefined,
    className: `mt-1.5 ${fieldClassName}`,
  } as const;

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} rows={4} className={`${shared.className} resize-y`} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} />
      )}
      {error && (
        <p id={errorId} className="mt-1.5 font-poppins text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
