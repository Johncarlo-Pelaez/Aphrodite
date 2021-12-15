export const FIND_INFORMATION_REQUEST_REPORTS = `
    SELECT 
    indexing.documentId,
    indexing.requestedDate,
    indexing.filename,
    indexing.encoder,
    indexing.qrCode,
    indexing.documentType,
    indexing.documentSize,
    indexing.pageTotal,
    indexing.documentStatus,
    indexing.note
    FROM document_latest_info_request AS indexing`;

export const COUNT_INFORMATION_REQUEST_REPORTS = `
    SELECT 
    COUNT(indexing.documentId)
    FROM document_latest_info_request AS indexing`;

export const FIND_QUALITY_CHECK_REPORTS = `
    SELECT 
    qa.documentId,
    qa.checkedDate,
    qa.filename,
    qa.checker,
    qa.qrCode,
    qa.documentType,
    qa.documentSize,
    qa.pageTotal,
    qa.documentStatus,
    qa.note
    FROM document_latest_qa AS qa`;

export const COUNT_QUALITY_CHECK_REPORTS = `
    SELECT 
    COUNT(qa.documentId)
    FROM document_latest_qa AS qa`;

export const FIND_APPROVAL_REPORTS = `
    SELECT 
    approval.documentId,
    approval.approvalDate,
    approval.filename,
    approval.approver,
    approval.qrCode,
    approval.documentType,
    approval.documentSize,
    approval.pageTotal,
    approval.documentStatus,
    approval.note
    FROM document_latest_approval AS approval`;

export const COUNT_APPROVAL_REPORTS = `
    SELECT 
    COUNT(approval.documentId)
    FROM document_latest_approval AS approval`;

export const FIND_IMPORT_REPORTS = `
    SELECT 
    import.documentId,
    import.importedDate,
    import.filename,
    import.username,
    import.qrCode,
    import.documentType,
    import.documentSize,
    import.pageTotal,
    import.documentStatus,
    import.note
    FROM document_latest_import AS import`;

export const COUNT_IMPORT_REPORTS = `
    SELECT 
    COUNT(import.documentId)
    FROM document_latest_import AS import`;

export const FIND_RIS_REPORTS = `
    SELECT 
    documentId,
    modifiedDate,
    scannerUsername,
    scannerName,
    fileName,
    pageTotal,
    fileSize,
    fileType,
    dateScanned,
    indexes,
    documentDate,
    indexedBy,
    dateIndexed,
    uploadedBy,
    dateUploaded,
    remarks,
    status,
    notes,
    errorDate
    FROM ris_report`;

export const COUNT_RIS_REPORTS = `
    SELECT 
    COUNT(documentId)
    FROM ris_report`;
