'use client';

// FormCatto - RLeaguez wrapper around @ccatto/ui FormCatto with next-intl translations
// Re-exports FormCatto from @ccatto/ui with localized labels
import { JSX } from 'react';
import { FieldValues, Path, SubmitHandler } from 'react-hook-form';
import {
  FormCatto as FormCattoBase,
  FormCattoProps as FormCattoBaseProps,
  FormErrorActions,
} from '@ccatto/ui';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

// Re-export types from @ccatto/ui
export type { FormErrorActions, FormCattoLabels, FormField } from '@ccatto/ui';

// Extend the base props to add RLeaguez-specific options
interface IFormCattoProps<T extends FieldValues> {
  fields: {
    name: Path<T>;
    label: string;
    type?: string;
    placeholder?: string;
    defaultValue?: T[keyof T];
    renderCustom?: (
      field: {
        onChange: (value: T[keyof T]) => void;
        onBlur: () => void;
        value: T[keyof T];
        ref: React.Ref<HTMLInputElement | HTMLSelectElement>;
      },
      fieldState: { error?: { message?: string } },
    ) => JSX.Element;
  }[];
  onSubmit: SubmitHandler<T>;
  validationSchema: z.ZodSchema<T>;
  submitText?: string | React.ReactNode;
  errorMessage?: string;
  isSubmitting?: boolean;
  onCloseError?: () => void;
  showCancelButton?: boolean;
  onCancel?: () => void;
  errorActions?: FormErrorActions;
  /** @deprecated Theme prop is no longer used. Use inputVariant instead. */
  theme?: string;
  /** Input variant style (default: 'outlined') */
  inputVariant?: 'outlined' | 'filled' | 'minimal';
  className?: string;
  /** Content rendered inside the form container, before the fields */
  headerContent?: React.ReactNode;
}

/**
 * FormCatto - RLeaguez form component with internationalized labels
 *
 * Wraps @ccatto/ui FormCatto with next-intl translations for labels.
 * Uses the 'common' translation namespace for: submit, submitting, cancel, error
 */
const FormCatto = <T extends FieldValues>({
  fields,
  onSubmit,
  validationSchema,
  submitText,
  errorMessage,
  isSubmitting = false,
  onCloseError,
  showCancelButton = false,
  onCancel,
  errorActions,
  inputVariant = 'outlined',
  className,
  headerContent,
}: IFormCattoProps<T>) => {
  const t = useTranslations('common');

  // Build localized labels from translations
  const labels = {
    submit: t('submit'),
    submitting: t('submitting'),
    cancel: t('cancel'),
    error: t('error'),
  };

  return (
    <FormCattoBase
      fields={fields}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      submitText={submitText}
      errorMessage={errorMessage}
      isSubmitting={isSubmitting}
      onCloseError={onCloseError}
      showCancelButton={showCancelButton}
      onCancel={onCancel}
      errorActions={errorActions}
      labels={labels}
      inputVariant={inputVariant}
      className={className}
      headerContent={headerContent}
    />
  );
};

export default FormCatto;
