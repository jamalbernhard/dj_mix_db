'use client';

import { useState } from 'react';
import { Mix } from '@/lib/db';
import ConfirmationModal from './confirmation-modal';

interface MixesTableProps {
  mixes: Mix[];
  onUpdateNotes: (mixId: number, notes: string) => Promise<boolean>;
  onDeleteMix: (mixId: number) => Promise<boolean>;
}

export default function MixesTable({ mixes, onUpdateNotes, onDeleteMix }: MixesTableProps) {
  const [editingMixId, setEditingMixId] = useState<number | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mixToDelete, setMixToDelete] = useState<Mix | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (mixes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg">No mixes found</p>
      </div>
    );
  }

  const handleEditNotes = (mix: Mix) => {
    setEditingMixId(mix.id);
    setEditingNotes(mix.notes || '');
  };

  const handleUpdateNotes = async () => {
    if (editingMixId === null) return;
    
    setIsUpdating(true);
    try {
      const success = await onUpdateNotes(editingMixId, editingNotes);
      if (success) {
        setEditingMixId(null);
        setEditingNotes('');
      }
    } catch (error) {
      console.error('Failed to update notes:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingMixId(null);
    setEditingNotes('');
  };

  const handleDeleteClick = (mix: Mix) => {
    setMixToDelete(mix);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!mixToDelete) return;

    setIsDeleting(true);
    try {
      const success = await onDeleteMix(mixToDelete.id);
      if (success) {
        setDeleteModalOpen(false);
        setMixToDelete(null);
      }
    } catch (error) {
      console.error('Failed to delete mix:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setMixToDelete(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                First Song
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Second Song
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Notes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mixes.map((mix) => (
              <tr key={mix.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{mix.first_song_title}</div>
                    <div className="text-gray-500">{mix.first_song_artist}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{mix.second_song_title}</div>
                    <div className="text-gray-500">{mix.second_song_artist}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {editingMixId === mix.id ? (
                    <textarea
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      className="w-full min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                      rows={3}
                      disabled={isUpdating}
                    />
                  ) : (
                    <div className="whitespace-pre-wrap break-words max-w-xs">
                      {mix.notes || '-'}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {editingMixId === mix.id ? (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={handleUpdateNotes}
                        disabled={isUpdating}
                        className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? 'Updating...' : 'Update notes'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                        className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEditNotes(mix)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                      >
                        Edit notes
                      </button>
                      <button
                        onClick={() => handleDeleteClick(mix)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                      >
                        Delete mix
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Mix"
        message={`Are you sure you want to delete this mix? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={isDeleting}
      />
    </>
  );
} 