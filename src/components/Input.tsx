import { E164Number } from "libphonenumber-js/types";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";

type InputProps = {
  value?: string | number | E164Number;
  form?: any;
  name?: string;
  type?: string;
  title?: string;
  min?: string;
  max?: string;
  step?: number;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  variation?: "primary" | "secondary";
  onChange?: (value: string) => void;
  onEnter?: () => void;
};

const Input = (props: InputProps) => {
  const {
    value,
    name,
    form,
    type = "text",
    variation = "primary",
    title,
    min,
    max,
    step,
    required,
    disabled,
    className,
    placeholder,
    onChange,
    onEnter,
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
      <div className={`flex flex-col w-full ${className}`}>
        {title && (
          <p className="font-normal text-sm whitespace-nowrap mb-1.5">{title}</p>
        )}
        <div
          className={`${variation == "primary" ? "primaryWrapper" : ""} ${name && form.errors[name] && form.touched[name] && "errored"
            }`}
        >
          {form && name && (
            <>
              {{
                phone: (
                  <PhoneInputWithCountrySelect
                    className={
                      variation == "primary"
                        ? "primary"
                        : "secondary" + " !outline-0 bg-transparent"
                    }
                    id={name}
                    name={name}
                    defaultCountry="NG"
                    placeholder={placeholder}
                    disabled={true}
                    value={form.values[name]}
                    onChange={(value) =>
                      form.handleChange({ target: { value } })
                    }
                  />
                ),
                textarea: (
                  <textarea
                    rows={5}
                    id={name}
                    name={name}
                    className={variation == "primary" ? "primary" : "secondary"}
                    placeholder={placeholder}
                    disabled={disabled}
                    value={form.values[name]}
                    onChange={form.handleChange}
                    onKeyDown={(e) => {
                      if (e.key == "Enter") {
                        form.handleSubmit();
                      }
                    }}
                  ></textarea>
                ),
              }[type] || (
                  <input
                    id={name}
                    min={min}
                    max={max}
                    step={step}
                    type={type}
                    name={name}
                    className={variation == "primary" ? "primary" : "secondary"}
                    placeholder={placeholder}
                    disabled={disabled}
                    value={form.values[name]}
                    onChange={form.handleChange}
                    onKeyDown={(e) => {
                      if (e.key == "Enter") {
                        form.handleSubmit();
                      }
                    }}
                  />
                )}
            </>
          )}
          {value !== undefined && (
            <>
              {{
                phone: (
                  <PhoneInputWithCountrySelect
                    value={value as E164Number}
                    defaultCountry="NG"
                    required={required}
                    disabled={disabled}
                    placeholder={placeholder}
                    onChange={(value) => {
                      if (onChange) onChange(value as string);
                    }}
                  />
                ),
                textarea: (
                  <textarea
                    rows={5}
                    value={value}
                    required={required}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={variation == "primary" ? "primary" : "secondary"}
                    onKeyDown={(e) => {
                      if (e.key == "Enter" && onEnter) {
                        onEnter();
                      }
                    }}
                    onChange={(e) => {
                      if (onChange) onChange(e.target.value);
                    }}
                  ></textarea>
                ),
              }[type] || (
                  <input
                    min={min}
                    max={max}
                    step={step}
                    type={type}
                    value={value}
                    required={required}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={variation == "primary" ? "primary" : "secondary"}
                    onKeyDown={(e) => {
                      if (e.key == "Enter" && onEnter) {
                        onEnter();
                      }
                    }}
                    onChange={(e) => {
                      if (onChange) onChange(e.target.value);
                    }}
                  />
                )}
            </>
          )}
        </div>
        {form && name && form.errors[name] && form.touched[name] && (
          <span className="mt-1.5 text-xs text-error">
            {form.errors[name] as string}
          </span>
        )}
      </div>
    </>
  );
};

export default Input;
