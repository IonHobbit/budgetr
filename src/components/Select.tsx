import { E164Number } from "libphonenumber-js/types";
import "react-phone-number-input/style.css";

export type SelectOption = {
  key: string;
  value: string;
};

type SelectProps = {
  value?: string | number | E164Number;
  form?: any;
  name?: string;
  title?: string;
  className?: string;
  options: Array<SelectOption>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  variation?: "primary" | "secondary";
  onChange?: (value: string) => void;
};

const Select = (props: SelectProps) => {
  const {
    value,
    name,
    form,
    variation = "primary",
    title,
    options,
    required,
    disabled,
    className,
    placeholder,
    onChange,
  } = props;

  if (!form && value === undefined) {
    return (
      <p className="text-error">
        Either "form" or "value" prop is required to use this component
      </p>
    );
  }

  if (form && !name) {
    return (
      <p className="text-error">
        "name" prop is required alongside "form" to use this component
      </p>
    );
  }

  if (!form) {
    if (value === undefined) {
      return (
        <p className="text-error">
          "value" prop is required to use this component
        </p>
      );
    } else if (onChange === undefined) {
      return (
        <p className="text-error">
          "onChange" prop is required to use this component
        </p>
      );
    }
  }

  return (
    <>
      {options.length > 0 && (
        <div className={`flex flex-col w-full ${className}`}>
          {title && <p className="font-normal text-sm">{title}</p>}
          <div
            className={`${variation == "primary" ? "primaryWrapper" : ""} ${
              name && form.errors[name] && form.touched[name] && "errored"
            }`}
          >
            {form && name && (
              <select
                id={name}
                name={name}
                className={variation == "primary" ? "primary" : "secondary"}
                placeholder={placeholder}
                disabled={disabled}
                value={form.values[name]}
                onChange={form.handleChange}
              >
                {options.map(({ key, value }) => {
                  return (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  );
                })}
              </select>
            )}
            {value !== undefined && (
              <select
                value={value}
                required={required}
                disabled={disabled}
                placeholder={placeholder}
                className={variation == "primary" ? "primary" : "secondary"}
                onChange={(e) => {
                  if (onChange) onChange(e.target.value);
                }}
              >
                {options.map(({ key, value }) => {
                  return (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
          {form && name && form.errors[name] && form.touched[name] && (
            <span className="mt-1.5 text-xs text-error">
              {form.errors[name] as string}
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default Select;
