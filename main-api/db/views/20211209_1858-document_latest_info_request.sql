CREATE VIEW document_latest_info_request AS
SELECT 
	document.id AS documentId,
    document_history.createdDate AS requestedDate,
    document.documentName AS filename,
    document_history.userUsername AS encoder,
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
		WHERE t.documentStatus = 'INDEXING_FAILED' 
		OR t.documentStatus = 'INDEXING_DONE'
		GROUP BY t.documentId
	) AS document_latest_info_request

    INNER JOIN document_history
    ON document_latest_info_request.documentId = document_history.documentId
    AND document_latest_info_request.historyId = document_history.id
    INNER JOIN document 
    ON document_history.documentId = document.id