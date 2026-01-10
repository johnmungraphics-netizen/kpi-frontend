import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

interface EmptyStateCardProps {
  title?: string;
  message?: string;
}

export const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  title = 'All Caught Up!',
  message = 'You have no pending items at this time.',
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <FiCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};