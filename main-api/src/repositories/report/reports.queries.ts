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
