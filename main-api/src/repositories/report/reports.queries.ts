export const FIND_INFORMATION_REQUEST_REPORTS = `
    SELECT 
    document_history.createdDate,
    document.documentName AS filename,
    document.encoder,
    document.qrCode,
    document.documentType,
    document.documentSize,
    document.pageTotal,
    document_history.documentStatus,
    document_history.salesforceResponse
    FROM (
        SELECT 
            documentId, 
            documentStatus,
            MAX(createdDate) AS updatedDate
            FROM document_history
            GROUP BY documentId,
            documentStatus
    ) AS t
    INNER JOIN document_history
    ON t.documentId = document_history.documentId 
    AND t.updatedDate = document_history.createdDate 
    AND t.documentStatus = document_history.documentStatus
    INNER JOIN document
    ON document_history.documentId = document.id`;
