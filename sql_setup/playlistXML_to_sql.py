import sys
import plistlib

def escape_sql(value):
    """Escape single quotes for SQL."""
    if value is None:
        return ''
    return value.replace("'", "''")

def main(xml_path, output_sql):
    with open(xml_path, 'rb') as f:
        plist = plistlib.load(f)

    tracks = plist['Tracks']
    with open(output_sql, 'w') as out:
        # Add CREATE TABLE statement
        create_table_sql = (
            "CREATE TABLE IF NOT EXISTS Song ("
            "id INT AUTO_INCREMENT PRIMARY KEY, "
            "title VARCHAR(255), "
            "artist VARCHAR(255), "
            "album VARCHAR(255), "
            "total_time INT, "
            "bpm INT"
            ");\n"
        )
        out.write(create_table_sql)
        for track_id, track in tracks.items():
            title = escape_sql(track.get('Name', ''))
            artist = escape_sql(track.get('Artist', ''))
            album = escape_sql(track.get('Album', ''))
            total_time = track.get('Total Time', 'NULL')
            bpm = track.get('BPM', 'NULL')
            # Compose the SQL insert statement
            sql = (
                f"INSERT INTO Song (title, artist, album, total_time, bpm) "
                f"VALUES ('{title}', '{artist}', '{album}', {total_time if total_time != '' else 'NULL'}, {bpm if bpm != '' else 'NULL'});\n"
            )
            out.write(sql)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python generate_mysql_script.py <playlist.xml> <output_script.sql>")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
    
