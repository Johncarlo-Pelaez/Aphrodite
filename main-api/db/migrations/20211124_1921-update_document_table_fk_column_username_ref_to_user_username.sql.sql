UPDATE d 
SET d.userUsername = u.username, 
d.modifiedBy = u.username, 
d.encoder = u.username, 
d.checker = u.username, 
d.approver = u.username
FROM dbo.document as d
INNER JOIN dbo.[user] as u
ON u.id = d.userUsername

BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.[user] SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.[document] ADD CONSTRAINT
	FK_document_user FOREIGN KEY
	(
	userUsername
	) REFERENCES dbo.[user]
	(
	username
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.[document] SET (LOCK_ESCALATION = TABLE)
GO
COMMIT