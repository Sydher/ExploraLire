-- Table for LabelEntity
CREATE TABLE LabelEntity
(
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);

-- Table for PageEntity
CREATE TABLE PageEntity
(
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT,
    content TEXT
);

-- Table for SiteEntity
CREATE TABLE SiteEntity
(
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);

-- Join table for SiteEntity and LabelEntity
CREATE TABLE SiteEntity_LabelEntity
(
    SiteEntity_id INTEGER NOT NULL,
    labels_id     INTEGER NOT NULL,
    FOREIGN KEY (SiteEntity_id) REFERENCES SiteEntity (id),
    FOREIGN KEY (labels_id) REFERENCES LabelEntity (id),
    PRIMARY KEY (SiteEntity_id, labels_id)
);

-- Join table for SiteEntity and PageEntity
CREATE TABLE SiteEntity_PageEntity
(
    SiteEntity_id INTEGER NOT NULL,
    pages_id      INTEGER NOT NULL,
    FOREIGN KEY (SiteEntity_id) REFERENCES SiteEntity (id),
    FOREIGN KEY (pages_id) REFERENCES PageEntity (id),
    PRIMARY KEY (SiteEntity_id, pages_id)
);
