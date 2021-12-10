CREATE VIEW document_latest_distinct_status AS
SELECT 
    documentId, 
    documentStatus,
    MAX(createdDate) AS updatedDate
    FROM document_history
    GROUP BY documentId,
    documentStatus