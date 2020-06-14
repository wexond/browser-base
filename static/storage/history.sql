--
-- File generated with SQLiteStudio v3.2.1 on Thu Jun 11 17:14:07 2020
--
-- Text encoding used: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: downloads
CREATE TABLE downloads (
    id                 INTEGER       PRIMARY KEY,
    guid               VARCHAR       NOT NULL,
    current_path       LONGVARCHAR   NOT NULL,
    target_path        LONGVARCHAR   NOT NULL,
    start_time         INTEGER       NOT NULL,
    received_bytes     INTEGER       NOT NULL,
    total_bytes        INTEGER       NOT NULL,
    state              INTEGER       NOT NULL,
    danger_type        INTEGER       NOT NULL,
    interrupt_reason   INTEGER       NOT NULL,
    hash               BLOB          NOT NULL,
    end_time           INTEGER       NOT NULL,
    opened             INTEGER       NOT NULL,
    last_access_time   INTEGER       NOT NULL,
    transient          INTEGER       NOT NULL,
    referrer           VARCHAR       NOT NULL,
    site_url           VARCHAR       NOT NULL,
    tab_url            VARCHAR       NOT NULL,
    tab_referrer_url   VARCHAR       NOT NULL,
    http_method        VARCHAR       NOT NULL,
    by_ext_id          VARCHAR       NOT NULL,
    by_ext_name        VARCHAR       NOT NULL,
    etag               VARCHAR       NOT NULL,
    last_modified      VARCHAR       NOT NULL,
    mime_type          VARCHAR (255) NOT NULL,
    original_mime_type VARCHAR (255) NOT NULL
);


-- Table: downloads_slices
CREATE TABLE downloads_slices (
    download_id    INTEGER NOT NULL,
    [offset]       INTEGER NOT NULL,
    received_bytes INTEGER NOT NULL,
    finished       INTEGER NOT NULL
                           DEFAULT 0,
    PRIMARY KEY (
        download_id,
        [offset]
    )
);


-- Table: downloads_url_chains
CREATE TABLE downloads_url_chains (
    id          INTEGER     NOT NULL,
    chain_index INTEGER     NOT NULL,
    url         LONGVARCHAR NOT NULL,
    PRIMARY KEY (
        id,
        chain_index
    )
);


-- Table: keyword_search_terms
CREATE TABLE keyword_search_terms (
    keyword_id      INTEGER     NOT NULL,
    url_id          INTEGER     NOT NULL,
    term            LONGVARCHAR NOT NULL,
    normalized_term LONGVARCHAR NOT NULL
);


-- Table: meta
CREATE TABLE meta (
    [key] LONGVARCHAR NOT NULL
                      UNIQUE
                      PRIMARY KEY,
    value LONGVARCHAR
);


-- Table: segment_usage
CREATE TABLE segment_usage (
    id          INTEGER PRIMARY KEY,
    segment_id  INTEGER NOT NULL,
    time_slot   INTEGER NOT NULL,
    visit_count INTEGER DEFAULT 0
                        NOT NULL
);


-- Table: segments
CREATE TABLE segments (
    id     INTEGER       PRIMARY KEY,
    name   VARCHAR,
    url_id [INTEGER NON]
);


-- Table: typed_url_sync_metadata
CREATE TABLE typed_url_sync_metadata (
    storage_key INTEGER PRIMARY KEY
                        NOT NULL,
    value       BLOB
);


-- Table: urls
CREATE TABLE urls (
    id              INTEGER     PRIMARY KEY AUTOINCREMENT,
    url             LONGVARCHAR,
    title           LONGVARCHAR,
    visit_count     INTEGER     DEFAULT 0
                                NOT NULL,
    typed_count     INTEGER     DEFAULT 0
                                NOT NULL,
    last_visit_time INTEGER     NOT NULL,
    hidden          INTEGER     DEFAULT 0
                                NOT NULL
);


-- Table: visit_source
CREATE TABLE visit_source (
    id     INTEGER PRIMARY KEY,
    source INTEGER NOT NULL
);


-- Table: visits
CREATE TABLE visits (
    id                              INTEGER PRIMARY KEY,
    url                             INTEGER NOT NULL,
    visit_time                      INTEGER NOT NULL,
    from_visit                      INTEGER,
    transition                      INTEGER DEFAULT 0
                                            NOT NULL,
    segment_id                      INTEGER,
    visit_duration                  INTEGER DEFAULT 0
                                            NOT NULL,
    incremented_omnibox_typed_score BOOLEAN DEFAULT FALSE
                                            NOT NULL
);


-- Index: keyword_search_terms_index1
CREATE INDEX keyword_search_terms_index1 ON keyword_search_terms (
    keyword_id,
    normalized_term
);


-- Index: keyword_search_terms_index2
CREATE INDEX keyword_search_terms_index2 ON keyword_search_terms (
    url_id
);


-- Index: keyword_search_terms_index3
CREATE INDEX keyword_search_terms_index3 ON keyword_search_terms (
    term
);


-- Index: segment_usage_time_slot_segment_id
CREATE INDEX segment_usage_time_slot_segment_id ON segment_usage (
    time_slot,
    segment_id
);


-- Index: segments_name
CREATE INDEX segments_name ON segments (
    name
);


-- Index: segments_url_id
CREATE INDEX segments_url_id ON segments (
    url_id
);


-- Index: segments_usage_seg_id
CREATE INDEX segments_usage_seg_id ON segment_usage (
    segment_id
);


-- Index: urls_url_index
CREATE INDEX urls_url_index ON urls (
    url
);


-- Index: visits_from_index
CREATE INDEX visits_from_index ON visits (
    from_visit
);


-- Index: visits_time_index
CREATE INDEX visits_time_index ON visits (
    visit_time
);


-- Index: visits_url_index
CREATE INDEX visits_url_index ON visits (
    url
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
