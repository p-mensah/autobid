import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <div className={`flex justify-center items-center ${className}`}>
    <Loader2 size={size} className="animate-spin text-blue-600" />
  </div>
);

export const LoadingPage: React.FC = () => (
  <div className="flex flex-col justify-center items-center h-full min-h-[400px]">
    <LoadingSpinner size={48} />
    <p className="mt-4 text-gray-500 font-medium">Loading...</p>
  </div>
);

export const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
    <div className="h-48 bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
      <div className="pt-4 border-t border-gray-100 flex justify-between">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
      </div>
    </div>
  </div>
);

export const SkeletonDetails: React.FC = () => (
    <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-6">
                <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
            </div>
        </div>
    </div>
);