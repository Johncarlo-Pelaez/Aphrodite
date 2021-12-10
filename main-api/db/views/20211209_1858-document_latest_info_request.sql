CREATE VIEW document_latest_info_request AS
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