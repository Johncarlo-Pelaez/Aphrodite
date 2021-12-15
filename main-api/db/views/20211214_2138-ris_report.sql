CREATE VIEW ris_report AS
SELECT 
    document.id as documentId,
    document.modifiedDate,
    upload.uploader AS scannerUsername,
    upload.name AS scannerName,
    document.documentName AS fileName, 
    document.pageTotal,
    document.documentSize AS fileSize,
    document.mimeType AS fileType,
    upload.dateUploaded AS dateScanned,
    document.documentType AS indexes,
    document.documentDate,
    indexing.encoder AS indexedBy,
    indexing.requestedDate AS dateIndexed,
    import.importedBy AS uploadedBy,
    import.importedDate AS dateUploaded,
    document.remarks,
    document.status,

    CASE
      WHEN indexing.request_status = 'INDEXING_FAILED' THEN indexing.note
    WHEN import.import_status = 'MIGRATE_FAILED' THEN import.note
      ELSE NULL
    END AS notes,
    CASE
      WHEN indexing.request_status = 'INDEXING_FAILED' THEN indexing.requestedDate
    WHEN import.import_status = 'MIGRATE_FAILED' THEN import.importedDate
      ELSE NULL
    END AS errorDate

    FROM document
    LEFT JOIN (
      select documentId,
      document_history.documentStatus AS upload_status,
      document_history.createdDate AS dateUploaded, 
      document_history.userUsername AS uploader,
      CONCAT(dbo.[user].firstName, ' ', dbo.[user].lastName) AS name
      FROM document_history 
      INNER JOIN dbo.[user]
      ON dbo.[user].username = document_history.userUsername
      WHERE documentStatus = 'UPLOADED'
    ) AS upload
    ON document.id = upload.documentId
    LEFT JOIN (
      SELECT document_latest_info_request.documentId,
      document_latest_info_request.documentStatus AS request_status,
      document_latest_info_request.requestedDate,
      document_latest_info_request.encoder,
      document_latest_info_request.note
      FROM document_latest_info_request
    ) AS indexing
    ON document.id = indexing.documentId
    LEFT JOIN (
      SELECT document_latest_import.documentId,
      document_latest_import.documentStatus AS import_status,
      document_latest_import.importedDate,
      document_latest_import.username AS importedBy,
      document_latest_import.note
      FROM document_latest_import
    ) AS import
    ON document.id = import.documentId