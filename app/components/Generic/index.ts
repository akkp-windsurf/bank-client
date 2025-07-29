import React from 'react';

export interface GenericTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    title: string;
    render?: (value: T[keyof T], record: T) => React.ReactNode;
    sorter?: boolean;
    width?: number;
  }>;
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onRowClick?: (record: T) => void;
  rowKey: keyof T;
}

export interface GenericFormProps<T> {
  initialValues?: Partial<T>;
  onSubmit: (values: T) => void | Promise<void>;
  loading?: boolean;
  fields: Array<{
    name: keyof T;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
    required?: boolean;
    options?: Array<{ label: string; value: string | number }>;
    validation?: (value: T[keyof T]) => string | undefined;
  }>;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
}

export interface GenericModalProps {
  visible: boolean;
  title: string;
  onCancel: () => void;
  onOk?: () => void;
  children: React.ReactNode;
  width?: number;
  footer?: React.ReactNode;
  loading?: boolean;
}

export interface GenericListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loading?: boolean;
  emptyText?: string;
  className?: string;
}

export interface GenericCardProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode[];
  loading?: boolean;
  className?: string;
  bordered?: boolean;
}

export interface GenericButtonProps {
  type?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  htmlType?: 'button' | 'submit' | 'reset';
}

export interface GenericInputProps {
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
  size?: 'small' | 'medium' | 'large';
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
  error?: string;
}

export interface GenericSelectProps<T = string | number> {
  value?: T;
  onChange?: (value: T) => void;
  options: Array<{ label: string; value: T }>;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  allowClear?: boolean;
  className?: string;
  error?: string;
}
