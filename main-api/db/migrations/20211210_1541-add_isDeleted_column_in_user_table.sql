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
ALTER TABLE dbo.[user] ADD
	isDeleted bit NOT NULL CONSTRAINT DF_user_isDeleted DEFAULT 0
GO
ALTER TABLE dbo.[user] SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
