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
ALTER TABLE dbo.[document_history] 
	ALTER COLUMN userId nvarchar(255) NOT NULL
GO
ALTER TABLE dbo.[document_history] SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
