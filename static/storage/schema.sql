--
-- File generated with SQLiteStudio v3.2.1 on Tue Jun 2 16:33:50 2020
--
-- Text encoding used: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: bookmarks
CREATE TABLE bookmarks (
    id        INTEGER PRIMARY KEY ASC AUTOINCREMENT
                      UNIQUE
                      NOT NULL,
    parentId  INTEGER REFERENCES bookmarks (id),
    [index]   INTEGER,
    url       STRING,
    title     STRING  NOT NULL,
    dateAdded DOUBLE  NOT NULL
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
