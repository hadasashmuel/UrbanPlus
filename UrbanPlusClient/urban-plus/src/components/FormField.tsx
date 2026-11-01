
import type { ChangeEvent } from "react";

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}

function FormField({
  label,
  type,
  value,
  onChange,
}: FormFieldProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  return (
    <div className="form-field">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        required
      />
    </div>
  );
}

export default FormField;
