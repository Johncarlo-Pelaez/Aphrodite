CREATE VIEW document_latest_qa AS
SELECT 
	document.id AS documentId,
    document_history.createdDate AS checkedDate,
    document_history.filename,
    document_history.userUsername AS checker,
    document.qrCode,
    document.documentType,
    document.documentSize,
    document.pageTotal,
    document_history.documentStatus,
    document.remarks AS note

    FROM (
		SELECT 
			t.documentId,
			MAX(t.historyId) AS historyId
			FROM document_latest_distinct_status AS t
			WHERE t.documentStatus = 'CHECKING_APPROVED' 
			OR t.documentStatus = 'CHECKING_DISAPPROVED' 
			OR t.documentStatus = 'CHECKING_FAILED'
			GROUP BY t.documentId
	) AS document_latest_qa

    INNER JOIN document_history
    ON document_latest_qa.documentId = document_history.documentId
    AND document_latest_qa.historyId = document_history.id
    INNER JOIN document 
    ON document_history.documentId = document.id