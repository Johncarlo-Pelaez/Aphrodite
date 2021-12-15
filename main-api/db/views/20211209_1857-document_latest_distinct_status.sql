CREATE VIEW document_latest_distinct_status AS
SELECT 
    documentId, 
    MAX(id) AS historyId,
	documentStatus
    FROM document_history
    GROUP BY documentId, documentStatus