import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dj_mixes',
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  total_time: number;
  bpm: number;
}

export interface Mix {
  id: number;
  first_song_id: number;
  second_song_id: number;
  notes: string;
  first_song_title?: string;
  first_song_artist?: string;
  second_song_title?: string;
  second_song_artist?: string;
}

// Search for songs by title, artist, or album
export async function searchSongs(searchTerm: string): Promise<Song[]> {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM Song 
       WHERE title LIKE ? OR artist LIKE ? OR album LIKE ?
       ORDER BY title ASC`,
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows as Song[];
  } catch (error) {
    console.error('Error searching songs:', error);
    throw new Error('Failed to search songs');
  }
}

// Get mixes that contain songs matching the search term
export async function getMixesBySongSearch(searchTerm: string): Promise<Mix[]> {
  try {
    const [rows] = await pool.execute(
      `SELECT m.*, 
              s1.title as first_song_title, s1.artist as first_song_artist,
              s2.title as second_song_title, s2.artist as second_song_artist
       FROM Mix m
       JOIN Song s1 ON m.first_song_id = s1.id
       JOIN Song s2 ON m.second_song_id = s2.id
       WHERE s1.title LIKE ? OR s1.artist LIKE ? OR s1.album LIKE ?
          OR s2.title LIKE ? OR s2.artist LIKE ? OR s2.album LIKE ?
       ORDER BY m.id DESC`,
      [
        `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`,
        `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`
      ]
    );
    return rows as Mix[];
  } catch (error) {
    console.error('Error fetching mixes:', error);
    throw new Error('Failed to fetch mixes');
  }
}

// Create a new mix
export async function createMix(firstSongId: number, secondSongId: number, notes: string = ''): Promise<number> {
  try {
    const [result] = await pool.execute(
      `INSERT INTO Mix (first_song_id, second_song_id, notes) VALUES (?, ?, ?)`,
      [firstSongId, secondSongId, notes]
    );
    return (result as any).insertId;
  } catch (error) {
    console.error('Error creating mix:', error);
    throw new Error('Failed to create mix');
  }
}

// Update mix notes
export async function updateMixNotes(mixId: number, notes: string): Promise<void> {
  try {
    await pool.execute(
      `UPDATE Mix SET notes = ? WHERE id = ?`,
      [notes, mixId]
    );
  } catch (error) {
    console.error('Error updating mix notes:', error);
    throw new Error('Failed to update mix notes');
  }
}

// Delete a mix
export async function deleteMix(mixId: number): Promise<void> {
  try {
    await pool.execute(
      `DELETE FROM Mix WHERE id = ?`,
      [mixId]
    );
  } catch (error) {
    console.error('Error deleting mix:', error);
    throw new Error('Failed to delete mix');
  }
}

// Get all songs (for song selection)
export async function getAllSongs(): Promise<Song[]> {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM Song ORDER BY title ASC`
    );
    return rows as Song[];
  } catch (error) {
    console.error('Error fetching all songs:', error);
    throw new Error('Failed to fetch songs');
  }
} 