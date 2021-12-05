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
CREATE TABLE dbo.activity_log
	(
	id int NOT NULL IDENTITY (1, 1),
	type nvarchar(100) NOT NULL,
	description nvarchar(MAX) NOT NULL,
	loggedAt datetime NOT NULL,
	loggedBy nvarchar(255) NULL
	)  ON [PRIMARY]
GO
ALTER TABLE dbo.activity_log SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
