'use server';

import { createMix, searchSongs, updateMixNotes, deleteMix } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createMixAction(firstSongId: number, secondSongId: number, notes: string): Promise<boolean> {
  try {
    await createMix(firstSongId, secondSongId, notes);
    revalidatePath('/');
    return true;
  } catch (error) {
    console.error('Failed to create mix:', error);
    return false;
  }
}

export async function searchSongsAction(searchTerm: string) {
  try {
    return await searchSongs(searchTerm);
  } catch (error) {
    console.error('Failed to search songs:', error);
    return [];
  }
}

export async function updateMixNotesAction(mixId: number, notes: string): Promise<boolean> {
  try {
    await updateMixNotes(mixId, notes);
    revalidatePath('/');
    return true;
  } catch (error) {
    console.error('Failed to update mix notes:', error);
    return false;
  }
}

export async function deleteMixAction(mixId: number): Promise<boolean> {
  try {
    await deleteMix(mixId);
    revalidatePath('/');
    return true;
  } catch (error) {
    console.error('Failed to delete mix:', error);
    return false;
  }
} 