/**
 * ConfirmDialog Component
 * 
 * Reusable confirmation dialog to replace window.confirm().
 * Supports different variants (danger, warning, info) and customizable buttons.
 */

import React from 'react';
import { FiAlertTriangle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { Modal } from '../Modal';
import { Button } from '../Button';

export type ConfirmDialogVariant = 'danger' | 'warning' | 'info';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  variant?: ConfirmDialogVariant;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  variant = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  const icons = {
    danger: <FiAlertCircle className="w-6 h-6" />,
    warning: <FiAlertTriangle className="w-6 h-6" />,
    info: <FiInfo className="w-6 h-6" />,
  };

  const styles = {
    danger: {
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      confirmButton: 'danger' as const,
    },
    warning: {
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      confirmButton: 'primary' as const,
    },
    info: {
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      confirmButton: 'primary' as const,
    },
  };

  const currentStyle = styles[variant];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title=""
      size="sm"
      showCloseButton={false}
    >
      <div className="text-center">
        {/* Icon */}
        <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${currentStyle.iconBg}`}>
          <div className={currentStyle.iconColor}>
            {icons[variant]}
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {title}
        </h3>

        {/* Message */}
        <p className="mt-2 text-sm text-gray-600">
          {message}
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 justify-center">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="sm:w-auto w-full"
          >
            {cancelText}
          </Button>
          <Button
            variant={currentStyle.confirmButton}
            onClick={handleConfirm}
            disabled={isLoading}
            className="sm:w-auto w-full"
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
