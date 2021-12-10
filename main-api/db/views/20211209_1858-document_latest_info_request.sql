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
    document_history.salesforceResponse AS note

    FROM (
		SELECT 
		t.documentId,
		MAX(t.updatedDate) AS requestedDate
		FROM document_latest_distinct_status AS t
		INNER JOIN document_history
		ON t.documentId = document_history.documentId 
		AND t.updatedDate = document_history.createdDate 
		AND t.documentStatus = document_history.documentStatus
		WHERE document_history.documentStatus = 'INDEXING_FAILED' 
		OR document_history.documentStatus = 'INDEXING_DONE'
		GROUP BY t.documentId
	) AS document_latest_info_request

    INNER JOIN document_history
    ON document_latest_info_request.documentId = document_history.documentId
    AND document_latest_info_request.requestedDate = document_history.createdDate
    INNER JOIN document 
    ON document_history.documentId = document.id
	WHERE document_history.documentStatus = 'INDEXING_FAILED' 
	OR document_history.documentStatus = 'INDEXING_DONE'