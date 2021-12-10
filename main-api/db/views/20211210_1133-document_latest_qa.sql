CREATE VIEW document_latest_qa AS
SELECT 
	document.id AS documentId,
    document_history.createdDate AS checkedDate,
    document.documentName AS filename,
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
			MAX(t.updatedDate) AS checkedDate
			FROM document_latest_distinct_status AS t
			INNER JOIN document_history
			ON t.documentId = document_history.documentId 
			AND t.updatedDate = document_history.createdDate 
			AND t.documentStatus = document_history.documentStatus
			WHERE document_history.documentStatus = 'CHECKING_APPROVED' 
			OR document_history.documentStatus = 'CHECKING_DISAPPROVED' 
			OR document_history.documentStatus = 'CHECKING_FAILED'
			GROUP BY t.documentId
	) AS document_latest_qa

    INNER JOIN document_history
    ON document_latest_qa.documentId = document_history.documentId
    AND document_latest_qa.checkedDate = document_history.createdDate
    INNER JOIN document 
    ON document_history.documentId = document.id
	WHERE document_history.documentStatus = 'CHECKING_APPROVED' 
	OR document_history.documentStatus = 'CHECKING_DISAPPROVED' 
	OR document_history.documentStatus = 'CHECKING_FAILED'