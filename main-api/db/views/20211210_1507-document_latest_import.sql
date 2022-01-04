CREATE VIEW document_latest_import AS
SELECT 
	document.id AS documentId,
    document_history.createdDate AS importedDate,
    document.documentName AS filename,
    document_history.userUsername as username,
    document.qrCode,
    document.documentType,
    document.documentSize,
    document.pageTotal,
    document_history.documentStatus,
    document_history.note

    FROM (
		SELECT 
			t.documentId,
			MAX(t.historyId) AS historyId
			FROM document_latest_distinct_status AS t
			WHERE t.documentStatus = 'MIGRATE_DONE' 
			OR t.documentStatus = 'MIGRATE_FAILED' 
			GROUP BY t.documentId
	) AS document_latest_import

    INNER JOIN document_history
    ON document_latest_import.documentId = document_history.documentId
    AND document_latest_import.historyId = document_history.id
    INNER JOIN document 
    ON document_history.documentId = document.id