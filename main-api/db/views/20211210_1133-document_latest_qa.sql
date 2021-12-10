CREATE VIEW document_latest_qa AS
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