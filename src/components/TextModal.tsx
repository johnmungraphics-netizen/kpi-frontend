import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface TextModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  maxLength?: number;
}

const TextModal: React.FC<TextModalProps> = ({
  isOpen,
  onClose,
  title,
  value,
  onChange,
  readOnly = false,
  maxLength,
}) => {
  const [localValue, setLocalValue] = useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (onChange && !readOnly) {
      onChange(localValue);
    }
    onClose();
  };

  const handleCancel = () => {
    setLocalValue(value);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto mb-4">
          {readOnly ? (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[200px] max-h-[400px] overflow-y-auto">
              <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                {value || 'No content'}
              </p>
            </div>
          ) : (
            <textarea
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[200px] max-h-[400px] resize-y"
              placeholder="Enter text..."
              maxLength={maxLength}
            />
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {readOnly ? 'Close' : 'Cancel'}
          </button>
          {!readOnly && onChange && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextModal;

