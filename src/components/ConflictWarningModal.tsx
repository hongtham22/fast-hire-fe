"use client";

import React from "react";
import { IoClose, IoWarning } from "react-icons/io5";
import { Application } from "@/types/application";
import { formatDate } from "@/lib/utils";

interface ConflictData {
  applicantId: string;
  applicantName: string;
  applications: (Application & { note?: string })[];
}

interface ConflictWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  conflicts: ConflictData[];
  selectedStatus: string;
  selectedCount: number;
}

export default function ConflictWarningModal({
  isOpen,
  onClose,
  onContinue,
  conflicts,
  selectedStatus,
  selectedCount,
}: ConflictWarningModalProps) {
  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✅ Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            ❌ Rejected
          </span>
        );
      case "new":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            📝 Not Evaluated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <IoWarning className="h-8 w-8 text-amber-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Conflict Warning</h2>
                <p className="text-sm text-gray-600">
                  Multiple applications with different results detected
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
              aria-label="Close"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Warning Message */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <IoWarning className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  Conflicting Applications Detected
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    The following applicants have multiple applications with different evaluation results.
                    Proceeding will send <strong>{selectedStatus}</strong> emails to <strong>{selectedCount}</strong> applications.
                  </p>
                  <p className="mt-1">
                    <strong>This may cause confusion for applicants.</strong> Please review carefully before continuing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Conflicts List */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900">Conflicting Applicants:</h3>
            
            {conflicts.map((conflict) => (
              <div key={conflict.applicantId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-medium text-gray-900">
                    {conflict.applicantName}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {conflict.applications.length} applications
                  </span>
                </div>
                
                <div className="space-y-2">
                  {conflict.applications
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((app, index) => (
                      <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">
                            #{index + 1}
                          </span>
                          <span className="text-sm text-gray-600">
                            Applied: {formatDate(app.createdAt)}
                          </span>
                          {getStatusBadge(app.status)}
                        </div>
                        
                        {app.note && (
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            Note: &quot;{app.note}&quot;
                          </div>
                        )}
                      </div>
                    ))}
                </div>
                
                {/* Show what will happen */}
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="text-sm">
                    <span className="font-medium text-blue-800">Impact: </span>
                    <span className="text-blue-700">
                      {conflict.applications.filter(app => app.status === selectedStatus).length > 0
                        ? `Will receive ${selectedStatus.toUpperCase()} email`
                        : `Will NOT receive any email in this batch`
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>{selectedCount}</strong> applications selected for <strong>{selectedStatus}</strong> emails</li>
              <li>• <strong>{conflicts.length}</strong> applicants have conflicting application results</li>
              <li>• Proceeding will send emails based on your current selection only</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel - Review First
            </button>
            <button
              onClick={onContinue}
              className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 font-medium"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 