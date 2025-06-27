import { Suspense } from 'react';
import SearchForm from '@/components/search-form';
import MixesTable from '@/components/mixes-table';
import MixCreator from '@/components/mix-creator';
import { getMixesBySongSearch } from '@/lib/db';
import { createMixAction, searchSongsAction } from './actions';

interface PageProps {
  searchParams?: Promise<{
    query?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params?.query || '';
  
  let mixes: any[] = [];
  let error: string | null = null;

  if (query) {
    try {
      mixes = await getMixesBySongSearch(query);
    } catch (err) {
      error = 'Failed to fetch mixes. Please try again.';
      console.error('Database error:', err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Search Section */}
        <div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              DJ Mix Database
            </h1>
            <p className="text-gray-600">
              Search for songs and find related mixes
            </p>
          </div>

          <div className="mb-8">
            <SearchForm />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {query && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Mixes containing songs matching "{query}"
              </h2>
              <Suspense fallback={
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading mixes...</p>
                </div>
              }>
                <MixesTable mixes={mixes} />
              </Suspense>
            </div>
          )}

          {!query && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Enter a search term above to find related mixes</p>
            </div>
          )}
        </div>

        {/* Mix Creator Section */}
        <div className="border-t border-gray-200 pt-12">
          <MixCreator 
            onCreateMix={createMixAction}
            onSearchSongs={searchSongsAction}
          />
        </div>
      </div>
    </div>
  );
}
