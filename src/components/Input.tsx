import React from "react";

type Props = {
  id?: any;
  label?: string;
  placeholder?: string;
  value: any;
  onChange: (e: any) => void;
  error?: string;
  type: string;
  left?: any;
  bottomLabel?: any;
};

function Input({
  id,
  label,
  error,
  type,
  placeholder,
  value,
  onChange,
  left,
  bottomLabel,
}: Props) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={id} className=" text-sm">
        {label}
      </label>
      <div
        className={`flex border border-slate-600 focus:outline-slate-500 items-center  bg-slate-600 rounded-sm overflow-hidden ${
          error && "border-red-500"
        }`}
      >
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          className={`py-3 pl-3 w-full focus:outline-none text-black `}
          onChange={onChange}
          value={value}
        />
        {left && <div className="p-3 border-l border-l-slate-400">{left}</div>}
      </div>
      {bottomLabel && (
        <label htmlFor={id} className="text-sm">
          {bottomLabel}
        </label>
      )}
      {error && (
        <label htmlFor={id} className="text-red-500">
          {error}
        </label>
      )}
    </div>
  );
}

export default Input;
