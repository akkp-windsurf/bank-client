import { useState, useCallback } from 'react';

interface UseFormOptions<T> {
  initialValues?: Partial<T>;
  validate?: (values: T) => Record<keyof T, string> | {};
  onSubmit?: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: T[keyof T]) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  clearErrors: () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: () => void;
  validateField: (field: keyof T) => boolean;
  validateForm: () => boolean;
}

export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const { initialValues = {} as T, validate, onSubmit } = options;
  
  const [values, setValuesState] = useState<T>({ ...initialValues } as T);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValuesState((prev: T) => ({ ...prev, [field]: value }));
    setTouched((prev: Partial<Record<keyof T, boolean>>) => ({ ...prev, [field]: true }));
    
    if (errors[field]) {
      setErrors((prev: Partial<Record<keyof T, string>>) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState((prev: T) => ({ ...prev, ...newValues }));
  }, []);

  const setError = useCallback((field: keyof T, error: string) => {
    setErrors((prev: Partial<Record<keyof T, string>>) => ({ ...prev, [field]: error }));
  }, []);

  const clearError = useCallback((field: keyof T) => {
    setErrors((prev: Partial<Record<keyof T, string>>) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const validateField = useCallback((field: keyof T): boolean => {
    if (!validate) return true;
    
    const fieldErrors = validate(values);
    const fieldError = (fieldErrors as any)[field];
    
    if (fieldError) {
      setError(field, fieldError);
      return false;
    } else {
      clearError(field);
      return true;
    }
  }, [values, validate, setError, clearError]);

  const validateForm = useCallback(() => {
    if (!validate) return true;
    
    const formErrors = validate(values);
    setErrors(formErrors);
    
    return Object.keys(formErrors).length === 0;
  }, [values, validate]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);

  const reset = useCallback(() => {
    setValuesState({ ...initialValues } as T);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setValues,
    setError,
    clearError,
    clearErrors,
    handleSubmit,
    reset,
    validateField,
    validateForm,
  };
}
