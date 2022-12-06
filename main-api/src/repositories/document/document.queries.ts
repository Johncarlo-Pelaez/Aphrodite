export const COUNT_MIGRATED_DOCUMENTS = `SELECT COUNT(*) FROM document`;
export const FIND_DOCUMENTS = `SELECT * FROM document d INNER JOIN dbo.[User] u on (d.userUserName = u.username) 
INNER JOIN document_history dh on (d.Id = dh.documentId)`;