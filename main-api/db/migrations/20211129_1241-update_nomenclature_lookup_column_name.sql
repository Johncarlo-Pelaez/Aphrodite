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
EXECUTE sp_rename N'dbo.nomenclature_lookup.nomenClature', N'Tmp_nomenclature', 'COLUMN' 
GO
EXECUTE sp_rename N'dbo.nomenclature_lookup.Tmp_nomenclature', N'nomenclature', 'COLUMN' 
GO
ALTER TABLE dbo.nomenclature_lookup SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
