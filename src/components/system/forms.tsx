"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { Upload } from "lucide-react";
import { cn } from "@/utils";
import { Button, type ButtonProps } from "./buttons";

export interface FieldWrapperProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

/** @example <ValidationMessage id="email-error">Email is required</ValidationMessage> */
export function ValidationMessage({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="text-sm font-medium text-error-600">
      {children}
    </p>
  );
}

function FieldWrapper({ id, label, error, hint, required, children }: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        {label}
        {required && <span className="ml-1 text-error-500" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-sm text-neutral-500 dark:text-neutral-400">{hint}</p>}
      <ValidationMessage id={`${id}-error`}>{error}</ValidationMessage>
    </div>
  );
}

const fieldClass =
  "w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm text-neutral-900 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

/** @example <Input id="email" label="Email" type="email" error={errors.email} /> */
export function Input({ id, label, error, hint, required, className, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <FieldWrapper id={inputId} label={label} error={error} hint={hint} required={required}>
      <input
        id={inputId}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn("h-12", fieldClass, error && "border-error-500 focus:ring-error-500", className)}
        {...props}
      />
    </FieldWrapper>
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

/** @example <Textarea id="message" label="Message" rows={5} /> */
export function Textarea({ id, label, error, hint, required, className, ...props }: TextareaProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <FieldWrapper id={inputId} label={label} error={error} hint={hint} required={required}>
      <textarea
        id={inputId}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn("min-h-[120px] py-3", fieldClass, error && "border-error-500 focus:ring-error-500", className)}
        {...props}
      />
    </FieldWrapper>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

/** @example <Select label="County" options={[{ value: "siaya", label: "Siaya" }]} /> */
export function Select({ id, label, error, hint, options, placeholder, required, className, ...props }: SelectProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <FieldWrapper id={inputId} label={label} error={error} hint={hint} required={required}>
      <select
        id={inputId}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn("h-12", fieldClass, error && "border-error-500 focus:ring-error-500", className)}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

/** @example <Checkbox label="I agree to the privacy policy" /> */
export function Checkbox({ label, description, className, ...props }: CheckboxProps) {
  return (
    <label className="flex items-start gap-3">
      <input type="checkbox" className={cn("mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500", className)} {...props} />
      <span>
        <span className="block text-sm font-semibold text-neutral-800 dark:text-neutral-100">{label}</span>
        {description && <span className="block text-sm text-neutral-500 dark:text-neutral-400">{description}</span>}
      </span>
    </label>
  );
}

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

/** @example <Radio name="type" value="monthly" label="Monthly" /> */
export function Radio({ label, className, ...props }: RadioProps) {
  return (
    <label className="flex items-center gap-3 text-sm font-semibold text-neutral-800 dark:text-neutral-100">
      <input type="radio" className={cn("h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500", className)} {...props} />
      {label}
    </label>
  );
}

export interface FileUploadProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

/** @example <FileUpload label="Upload CV" accept=".pdf,.doc,.docx" /> */
export function FileUpload({ id, label, error, hint, required, className, ...props }: FileUploadProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <FieldWrapper id={inputId} label={label} error={error} hint={hint} required={required}>
      <label
        htmlFor={inputId}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 text-center transition hover:border-primary-400 hover:bg-primary-50 dark:border-neutral-700 dark:bg-neutral-900",
          error && "border-error-500",
          className
        )}
      >
        <Upload className="text-primary-600" size={24} aria-hidden="true" />
        <span className="mt-2 text-sm font-semibold text-neutral-800 dark:text-neutral-100">Choose a file</span>
        <input id={inputId} type="file" className="sr-only" required={required} aria-required={required} aria-invalid={!!error} {...props} />
      </label>
    </FieldWrapper>
  );
}

/** @example <SubmitButton isLoading={isSubmitting}>Send message</SubmitButton> */
export function SubmitButton(props: ButtonProps) {
  return <Button type="submit" variant="primary" {...props} />;
}
