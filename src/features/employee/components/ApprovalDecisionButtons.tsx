import React from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import { Button } from '../../../components/common';
import SignatureField from '../../../components/SignatureField';

interface ApprovalDecisionButtonsProps {
  action: 'approve' | 'reject' | null;
  rejectionNote: string;
  signature: string;
  submitting: boolean;
  error?: string;
  onActionChange: (action: 'approve' | 'reject') => void;
  onRejectionNoteChange: (note: string) => void;
  onSignatureChange: (signature: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const ApprovalDecisionButtons: React.FC<ApprovalDecisionButtonsProps> = ({
  action,
  rejectionNote,
  signature,
  submitting,
  error,
  onActionChange,
  onRejectionNoteChange,
  onSignatureChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Decision</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => onActionChange('approve')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              action === 'approve'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <FiCheckCircle
                className={action === 'approve' ? 'text-green-600 text-xl' : 'text-gray-400'}
              />
              <span
                className={`font-medium ${
                  action === 'approve' ? 'text-green-700' : 'text-gray-600'
                }`}
              >
                Approve Rating
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              I agree with my manager's assessment
            </p>
          </button>

          <button
            onClick={() => onActionChange('reject')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              action === 'reject'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <FiX className={action === 'reject' ? 'text-red-600 text-xl' : 'text-gray-400'} />
              <span
                className={`font-medium ${action === 'reject' ? 'text-red-700' : 'text-gray-600'}`}
              >
                Reject Rating
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              I disagree with this assessment
            </p>
          </button>
        </div>

        {action === 'reject' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <label className="block text-sm font-medium text-red-900 mb-2">
              Reason for Rejection <span className="text-red-600">*</span>
            </label>
            <textarea
              value={rejectionNote}
              onChange={(e) => onRejectionNoteChange(e.target.value)}
              placeholder="Please explain why you disagree with this rating..."
              rows={4}
              className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
            <p className="text-xs text-red-600 mt-1">
              Your manager and HR will be notified of your rejection and the reason provided.
            </p>
          </div>
        )}

        {action === 'approve' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <label className="block text-sm font-medium text-green-900 mb-2">
              Your Signature <span className="text-green-600">*</span>
            </label>
            <SignatureField
              value={signature}
              onChange={onSignatureChange}
              placeholder="Sign here to approve..."
            />
            <p className="text-xs text-green-600 mt-2">
              By signing, you confirm that you agree with your manager's rating and assessment.
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!action || submitting}
            variant={action === 'approve' ? 'success' : action === 'reject' ? 'danger' : 'primary'}
            loading={submitting}
          >
            {action === 'approve'
              ? 'Approve & Sign'
              : action === 'reject'
              ? 'Submit Rejection'
              : 'Select an Option'}
          </Button>
        </div>
      </div>
    </div>
  );
};