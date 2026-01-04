import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiCheck } from 'react-icons/fi';

const CompanySelection: React.FC = () => {
  const { companies, selectedCompany, selectCompany, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // If only one company, select it automatically and redirect
    if (companies.length === 1) {
      handleSelectCompany(companies[0].id);
    }
  }, [companies, user, navigate]);

  const handleSelectCompany = async (companyId: number) => {
    setLoading(true);
    setError('');

    try {
      await selectCompany(companyId);
      
      // Redirect based on role
      if (user?.role === 'manager') {
        navigate('/manager/dashboard');
      } else if (user?.role === 'employee') {
        navigate('/employee/dashboard');
      } else if (user?.role === 'hr') {
        navigate('/hr/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to select company');
    } finally {
      setLoading(false);
    }
  };

  if (companies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Companies Found</h2>
          <p className="text-gray-600 mb-6">You are not associated with any companies.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <FiHome className="mx-auto text-5xl text-purple-600 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Select Company</h2>
          <p className="text-gray-600">You have access to multiple companies. Please select one to continue.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {companies.map((company) => (
            <button
              key={company.id}
              onClick={() => handleSelectCompany(company.id)}
              disabled={loading}
              className={`w-full p-6 border-2 rounded-lg transition-all text-left ${
                selectedCompany?.id === company.id
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedCompany?.id === company.id ? 'bg-purple-600' : 'bg-gray-200'
                  }`}>
                    <FiHome className={`text-xl ${
                      selectedCompany?.id === company.id ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{company.name}</h3>
                    {company.domain && (
                      <p className="text-sm text-gray-500">{company.domain}</p>
                    )}
                    {company.is_primary && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                </div>
                {selectedCompany?.id === company.id && (
                  <FiCheck className="text-2xl text-purple-600" />
                )}
              </div>
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-6 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySelection;

