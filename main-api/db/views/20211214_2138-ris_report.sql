CREATE VIEW ris_report AS
SELECT 
    document.id as documentId,
    document.modifiedDate,
    upload.uploader AS scannerUsername,
    upload.name AS scannerName,
    latest_uploaded_file.fileName, 
    latest_uploaded_file.pageTotal,
    latest_uploaded_file.documentSize AS fileSize,
    latest_uploaded_file.mimeType AS fileType,
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
    
    INNER JOIN (    
      SELECT 
      document_history.documentId,
      document_history.id,
      document_history.filename,
      document_history.mimeType,
      document_history.pageTotal,
      document_history.documentSize
      FROM (
        SELECT document_history.documentId,
        MAX(document_history.id) as historyId
        FROM document_latest_distinct_status
        INNER JOIN document_history
        ON document_latest_distinct_status.historyId = document_history.id
        WHERE document_history.documentStatus = 'UPLOADED' 
        OR document_history.description = 'Replace file from system directory.'
        GROUP BY document_history.documentId
      ) AS t
      INNER JOIN document_history 
      ON t.historyId = document_history.id   
    ) AS latest_uploaded_file
    ON document.id = latest_uploaded_file.documentId

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