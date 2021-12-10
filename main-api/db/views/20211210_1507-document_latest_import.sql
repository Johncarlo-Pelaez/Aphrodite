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
    document_history.springcmResponse AS note

    FROM (
		SELECT 
			t.documentId,
			MAX(t.updatedDate) AS importedDate
			FROM document_latest_distinct_status AS t
			INNER JOIN document_history
			ON t.documentId = document_history.documentId 
			AND t.updatedDate = document_history.createdDate 
			AND t.documentStatus = document_history.documentStatus
			WHERE document_history.documentStatus = 'MIGRATE_DONE' 
			OR document_history.documentStatus = 'MIGRATE_FAILED' 
			GROUP BY t.documentId
	) AS document_latest_import

    INNER JOIN document_history
    ON document_latest_import.documentId = document_history.documentId
    AND document_latest_import.importedDate = document_history.createdDate
    INNER JOIN document 
    ON document_history.documentId = document.id
	WHERE document_history.documentStatus = 'MIGRATE_DONE' 
	OR document_history.documentStatus = 'MIGRATE_FAILED' 