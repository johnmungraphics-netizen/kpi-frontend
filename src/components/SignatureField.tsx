import React, { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FiX, FiCheckCircle, FiUpload } from 'react-icons/fi';

interface SignatureFieldProps {
  value?: string;
  onChange: (signature: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const SignatureField: React.FC<SignatureFieldProps> = ({
  value,
  onChange,
  label = 'Digital Signature',
  placeholder = 'Click and drag to sign',
  required = false,
  disabled = false,
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const canvasRef = useRef<SignatureCanvas>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [useSavedSignature, setUseSavedSignature] = useState(false);

  useEffect(() => {
    if (value && canvasRef.current) {
      canvasRef.current.fromDataURL(value);
      setIsEmpty(false);
    }
  }, [value]);

  const handleEnd = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL();
      onChange(dataURL);
      setIsEmpty(canvasRef.current.isEmpty());
      setUseSavedSignature(false);
    }
  };

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      onChange('');
      setIsEmpty(true);
      setUseSavedSignature(false);
    }
  };

  const handleUseSavedSignature = () => {
    if (user?.signature) {
      onChange(user.signature);
      setUseSavedSignature(true);
      setIsEmpty(false);
      if (canvasRef.current) {
        canvasRef.current.fromDataURL(user.signature);
      }
    }
  };

  const handleUploadSignature = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.warning('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.warning('File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
      setUseSavedSignature(false);
      setIsEmpty(false);
      if (canvasRef.current) {
        canvasRef.current.fromDataURL(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative border-2 border-dashed border-gray-300 rounded-lg bg-white">
        {isEmpty && !value && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <svg
              className="w-16 h-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">{placeholder}</p>
          </div>
        )}

        <SignatureCanvas
          ref={canvasRef}
          canvasProps={{
            width: 600,
            height: 200,
            className: `w-full h-48 rounded-lg ${disabled ? 'pointer-events-none opacity-50' : ''}`,
          }}
          onEnd={disabled ? undefined : handleEnd}
          backgroundColor="transparent"
        />

        {!isEmpty && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            disabled={disabled}
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 mt-2">
        {user?.signature && (
          <button
            type="button"
            onClick={handleUseSavedSignature}
            disabled={disabled || useSavedSignature}
            className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              useSavedSignature
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {useSavedSignature ? (
              <>
                <FiCheckCircle className="text-sm" />
                <span>Using Saved Signature</span>
              </>
            ) : (
              <>
                <FiCheckCircle className="text-sm" />
                <span>Use Saved Signature</span>
              </>
            )}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUploadSignature}
          className="hidden"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiUpload className="text-sm" />
          <span>Upload Image</span>
        </button>
      </div>

      {value && !useSavedSignature && (
        <p className="text-xs text-gray-500 mt-1">
          Or type your full name below
        </p>
      )}
    </div>
  );
};

export default SignatureField;

