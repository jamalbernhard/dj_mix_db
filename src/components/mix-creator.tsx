'use client';

import { useState } from 'react';
import { Song } from '@/lib/db';
import SongSearch from './song-search';

interface MixCreatorProps {
  onCreateMix: (firstSongId: number, secondSongId: number, notes: string) => Promise<boolean>;
  onSearchSongs: (searchTerm: string) => Promise<Song[]>;
}

export default function MixCreator({ onCreateMix, onSearchSongs }: MixCreatorProps) {
  const [firstSong, setFirstSong] = useState<Song | null>(null);
  const [secondSong, setSecondSong] = useState<Song | null>(null);
  const [notes, setNotes] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSearch = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const results = await onSearchSongs(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFirstSong = (song: Song) => {
    setFirstSong(song);
  };

  const handleSelectSecondSong = (song: Song) => {
    setSecondSong(song);
  };

  const handleCreateMix = async () => {
    if (!firstSong || !secondSong) return;

    setIsCreating(true);
    try {
      const success = await onCreateMix(firstSong.id, secondSong.id, notes);
      if (success) {
        // Reset form
        setFirstSong(null);
        setSecondSong(null);
        setNotes('');
        setSearchResults([]);
        
        // Show success message
        setSuccessMessage('New mix added!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to create mix:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const canCreateMix = firstSong && secondSong && !isCreating;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Create new mix</h2>
      
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">{successMessage}</p>
        </div>
      )}

      {/* New Mix Row */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Song
            </label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[48px] flex items-center">
              <span className={firstSong ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                {firstSong ? firstSong.title : 'None selected'}
              </span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Second Song
            </label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[48px] flex items-center">
              <span className={secondSong ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                {secondSong ? secondSong.title : 'None selected'}
              </span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter mix notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              &nbsp;
            </label>
            <button
              onClick={handleCreateMix}
              disabled={!canCreateMix}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-[48px]"
            >
              {isCreating ? 'Creating...' : 'Create mix'}
            </button>
          </div>
        </div>
      </div>

      {/* Song Search */}
      <SongSearch
        onSearch={handleSearch}
        searchResults={searchResults}
        onSelectFirstSong={handleSelectFirstSong}
        onSelectSecondSong={handleSelectSecondSong}
        isLoading={isLoading}
      />
    </div>
  );
} 