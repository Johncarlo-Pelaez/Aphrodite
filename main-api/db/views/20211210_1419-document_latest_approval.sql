CREATE VIEW document_latest_approval AS
SELECT 
	document.id AS documentId,
    document_history.createdDate AS approvalDate,
    document_history.filename,
    document_history.userUsername AS approver,
    document.qrCode,
    document.documentType,
    document_history.documentSize,
    document_history.pageTotal,
    document_history.documentStatus,
    document.remarks AS note

    FROM (
		SELECT 
			t.documentId,
			MAX(t.historyId) AS historyId
			FROM document_latest_distinct_status AS t
			WHERE t.documentStatus = 'APPROVED' 
			OR t.documentStatus = 'DISAPPROVED' 
			GROUP BY t.documentId
	) AS document_latest_approval

    INNER JOIN document_history
    ON document_latest_approval.documentId = document_history.documentId
    AND document_latest_approval.historyId = document_history.id
    INNER JOIN document 
    ON document_history.documentId = document.id