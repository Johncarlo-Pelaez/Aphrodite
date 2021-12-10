export const FIND_INFORMATION_REQUEST_REPORTS = `
    SELECT 
    document_history.createdDate AS requestedDate,
    document.documentName AS filename,
    document.encoder,
    document.qrCode,
    document.documentType,
    document.documentSize,
    document.pageTotal,
    document_history.documentStatus,
    document_history.salesforceResponse AS note
    FROM document_latest_info_request AS t
    INNER JOIN document_history
    ON t.documentId = document_history.documentId
    AND t.updatedDate = document_history.createdDate
    INNER JOIN document 
    ON document_history.documentId = document.id`;

export const COUNT_INFORMATION_REQUEST_REPORTS = `
    SELECT 
    COUNT(t.documentId)
    FROM document_latest_info_request AS t
    INNER JOIN document_history
    ON t.documentId = document_history.documentId
    AND t.updatedDate = document_history.createdDate
    INNER JOIN document 
    ON document_history.documentId = document.id`;
