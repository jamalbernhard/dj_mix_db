CREATE TABLE Mix (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    first_song_id INT NOT NULL,
    second_song_id INT NOT NULL,
    notes VARCHAR(1024),
    FOREIGN KEY (first_song_id) REFERENCES Song(id) ON DELETE CASCADE,
    FOREIGN KEY (second_song_id) REFERENCES Song(id) ON DELETE CASCADE
);
