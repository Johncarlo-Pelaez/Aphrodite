CREATE VIEW document_latest_approval AS
SELECT 
	document.id AS documentId,
    document_history.createdDate AS approvalDate,
    document.documentName AS filename,
    document_history.userUsername AS approver,
    document.qrCode,
    document.documentType,
    document.documentSize,
    document.pageTotal,
    document_history.documentStatus,
    document.remarks AS note

    FROM (
		SELECT 
			t.documentId,
			MAX(t.updatedDate) AS approvalDate
			FROM document_latest_distinct_status AS t
			INNER JOIN document_history
			ON t.documentId = document_history.documentId 
			AND t.updatedDate = document_history.createdDate 
			AND t.documentStatus = document_history.documentStatus
			WHERE document_history.documentStatus = 'APPROVED' 
			OR document_history.documentStatus = 'DISAPPROVED' 
			GROUP BY t.documentId
	) AS document_latest_approval

    INNER JOIN document_history
    ON document_latest_approval.documentId = document_history.documentId
    AND document_latest_approval.approvalDate = document_history.createdDate
    INNER JOIN document 
    ON document_history.documentId = document.id
	WHERE document_history.documentStatus = 'APPROVED' 
	OR document_history.documentStatus = 'DISAPPROVED' 