import { useState } from 'react';
import { X } from 'lucide-react';

interface PasswordResetFormProps {
  userName: string;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function PasswordResetForm({
  userName,
  onSubmit,
  onCancel,
  isLoading = false,
}: PasswordResetFormProps) {
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!confirmed) {
      alert('Please confirm that you want to reset the password');
      return;
    }

    onSubmit();
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Reset Password for {userName}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800 mb-2">
          <strong>⚠️ Password Reset Confirmation</strong>
        </p>
        <p className="text-sm text-gray-700">
          The HR user&#39;s password will be reset to: <strong className="text-red-600">hr123</strong>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Please notify {userName} that their new password is <strong>hr123</strong> and they should change it after logging in.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="confirm"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="confirm" className="ml-2 block text-sm text-gray-900">
            I confirm that I want to reset {userName}&apos;s password to <strong>hr123</strong>
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !confirmed}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </div>
      </form>
    </div>
  );
}