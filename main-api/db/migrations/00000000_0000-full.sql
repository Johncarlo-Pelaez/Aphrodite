/****** Object:  Table [dbo].[document_history]    Script Date: 1/14/2022 11:53:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[document_history](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[description] [nvarchar](500) NOT NULL,
	[documentSize] [int] NOT NULL,
	[createdDate] [datetime] NOT NULL,
	[documentId] [int] NOT NULL,
	[userUsername] [nvarchar](255) NULL,
	[documentStatus] [nvarchar](100) NULL,
	[note] [nvarchar](max) NULL,
	[filename] [nvarchar](max) NOT NULL,
	[mimeType] [nvarchar](100) NOT NULL,
	[pageTotal] [int] NOT NULL,
 CONSTRAINT [PK_0783dd4cd636039459ee63c9a8b] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[document_latest_distinct_status]    Script Date: 1/14/2022 11:53:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[document_latest_distinct_status] AS
SELECT 
    documentId, 
    MAX(id) AS historyId,
	documentStatus
    FROM document_history
    GROUP BY documentId, documentStatus
GO
/****** Object:  Table [dbo].[document]    Script Date: 1/14/2022 11:53:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[document](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[uuid] [uniqueidentifier] NOT NULL,
	[userUsername] [nvarchar](255) NOT NULL,
	[documentName] [nvarchar](255) NOT NULL,
	[documentSize] [int] NOT NULL,
	[description] [nvarchar](500) NOT NULL,
	[modifiedDate] [datetime] NOT NULL,
	[modifiedBy] [nvarchar](255) NULL,
	[status] [nvarchar](100) NOT NULL,
	[qrCode] [nvarchar](250) NULL,
	[qrAt] [datetime] NULL,
	[documentType] [nvarchar](max) NULL,
	[contractDetails] [nvarchar](max) NULL,
	[mimeType] [nvarchar](100) NOT NULL,
	[springResponse] [nvarchar](max) NULL,
	[remarks] [nvarchar](max) NULL,
	[docTypeReqParams] [nvarchar](max) NULL,
	[contractDetailsReqParams] [nvarchar](max) NULL,
	[springcmReqParams] [nvarchar](max) NULL,
	[documentDate] [nvarchar](150) NULL,
	[encoder] [nvarchar](255) NULL,
	[encodedAt] [datetime] NULL,
	[checker] [nvarchar](255) NULL,
	[checkedAt] [datetime] NULL,
	[approver] [nvarchar](255) NULL,
	[encodeValues] [nvarchar](max) NULL,
	[isFileDeleted] [bit] NOT NULL,
	[pageTotal] [int] NOT NULL,
 CONSTRAINT [PK_document] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[document_latest_info_request]    Script Date: 1/14/2022 11:53:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[document_latest_info_request] AS
SELECT 
	document.id AS documentId,
    document_history.createdDate AS requestedDate,
    document_history.filename,
    document_history.userUsername AS encoder,
    document.qrCode,
    document.documentType,
    document_history.documentSize,
    document_history.pageTotal,
    document_history.documentStatus,
    document_history.note

    FROM (
		SELECT 
		t.documentId,
		MAX(t.historyId) AS historyId
		FROM document_latest_distinct_status AS t
		WHERE t.documentStatus = 'INDEXING_FAILED' 
		OR t.documentStatus = 'INDEXING_DONE'
		GROUP BY t.documentId
	) AS document_latest_info_request

    INNER JOIN document_history
    ON document_latest_info_request.documentId = document_history.documentId
    AND document_latest_info_request.historyId = document_history.id
    INNER JOIN document 
    ON document_history.documentId = document.id
GO
/****** Object:  View [dbo].[document_latest_qa]    Script Date: 1/14/2022 11:53:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[document_latest_qa] AS
SELECT 
	document.id AS documentId,
    document_history.createdDate AS checkedDate,
    document_history.filename,
    document_history.userUsername AS checker,
    document.qrCode,
    document.documentType,
    document_history.documentSize,
    document_history.pageTotal,
    document_history.documentStatus,
    document.remarks AS note

    FROM (
		SELECT 
			t.documentId,
			MAX(t.historyId) AS historyId
			FROM document_latest_distinct_status AS t
			WHERE t.documentStatus = 'CHECKING_APPROVED' 
			OR t.documentStatus = 'CHECKING_DISAPPROVED' 
			OR t.documentStatus = 'CHECKING_FAILED'
			GROUP BY t.documentId
	) AS document_latest_qa

    INNER JOIN document_history
    ON document_latest_qa.documentId = document_history.documentId
    AND document_latest_qa.historyId = document_history.id
    INNER JOIN document 
    ON document_history.documentId = document.id
GO
/****** Object:  View [dbo].[document_latest_approval]    Script Date: 1/14/2022 11:53:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[document_latest_approval] AS
SELECT 
	document.id AS documentId,
    document_history.createdDate AS approvalDate,
    document_history.filename,
    document_history.userUsername AS approver,
    document.qrCode,
    document.documentType,
    document_history.documentSize,
    document_history.pageTotal,
    document_history.documentStatus,
    document.remarks AS note

    FROM (
		SELECT 
			t.documentId,
			MAX(t.historyId) AS historyId
			FROM document_latest_distinct_status AS t
			WHERE t.documentStatus = 'APPROVED' 
			OR t.documentStatus = 'DISAPPROVED' 
			GROUP BY t.documentId
	) AS document_latest_approval

    INNER JOIN document_history
    ON document_latest_approval.documentId = document_history.documentId
    AND document_latest_approval.historyId = document_history.id
    INNER JOIN document 
    ON document_history.documentId = document.id
GO
/****** Object:  View [dbo].[document_latest_import]    Script Date: 1/14/2022 11:53:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[document_latest_import] AS
SELECT 
	document.id AS documentId,
    document_history.createdDate AS importedDate,
    document_history.filename,
    document_history.userUsername as username,
    document.qrCode,
    document.documentType,
    document_history.documentSize,
    document_history.pageTotal,
    document_history.documentStatus,
    document_history.note

    FROM (
		SELECT 
			t.documentId,
			MAX(t.historyId) AS historyId
			FROM document_latest_distinct_status AS t
			WHERE t.documentStatus = 'MIGRATE_DONE' 
			OR t.documentStatus = 'MIGRATE_FAILED' 
			GROUP BY t.documentId
	) AS document_latest_import

    INNER JOIN document_history
    ON document_latest_import.documentId = document_history.documentId
    AND document_latest_import.historyId = document_history.id
    INNER JOIN document 
    ON document_history.documentId = document.id
GO
/****** Object:  Table [dbo].[user]    Script Date: 1/14/2022 11:53:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](255) NOT NULL,
	[firstName] [nvarchar](255) NOT NULL,
	[lastName] [nvarchar](255) NOT NULL,
	[role] [nvarchar](50) NOT NULL,
	[createdDate] [datetime] NOT NULL,
	[isActive] [bit] NOT NULL,
	[modifiedDate] [datetime] NULL,
	[objectId] [nvarchar](max) NOT NULL,
	[isDeleted] [bit] NOT NULL,
 CONSTRAINT [PK_cace4a159ff9f2512dd42373760] PRIMARY KEY CLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[ris_report]    Script Date: 1/14/2022 11:53:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[ris_report] AS
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
GO
/****** Object:  Table [dbo].[activity_log]    Script Date: 1/14/2022 11:53:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[activity_log](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[type] [nvarchar](100) NOT NULL,
	[description] [nvarchar](max) NOT NULL,
	[loggedAt] [datetime] NOT NULL,
	[loggedBy] [nvarchar](255) NULL,
 CONSTRAINT [PK_activity_log] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[nomenclature_lookup]    Script Date: 1/14/2022 11:53:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[nomenclature_lookup](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nomenclature] [nvarchar](max) NOT NULL,
	[documentGroup] [nvarchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[nomenclature_whitelist]    Script Date: 1/14/2022 11:53:42 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[nomenclature_whitelist](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[description] [nvarchar](255) NOT NULL
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[nomenclature_lookup] ON 

INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (1, N'Acknowledgement Receipt - Safekeeping Fee', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (2, N'Affidavit of Adjudication', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (3, N'Affidavit of Authorized Representative/Authorization Letters', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (4, N'Affidavit of Buyer''s Citizenship/ Sworn Statement', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (5, N'Affidavit of Buyer''s Foreign Spouse''s Waiver', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (6, N'Affidavit of Co-owner''s 10 Citizenship/ Sworn Statement', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (7, N'Affidavit of Co-owner''s 2 Citizenship/ Sworn Statement', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (8, N'Affidavit of Co-owner''s 3 Citizenship/ Sworn Statement', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (9, N'Affidavit of Co-owner''s 4 Citizenship/ Sworn Statement', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (10, N'Affidavit of Co-owner''s 5 Citizenship/ Sworn Statement', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (11, N'Affidavit of Co-owner''s 6 Citizenship/ Sworn Statement', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (12, N'Affidavit of Co-owner''s 7 Citizenship/ Sworn Statement', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (13, N'Affidavit of Co-owner''s 8 Citizenship/ Sworn Statement', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (14, N'Affidavit of Co-owner''s 9 Citizenship/ Sworn Statement', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (15, N'Affidavit of Co-owner''s Citizenship/ Sworn Statement', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (16, N'Affidavit of Co-owner''s Foreign Spouse''s Waiver', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (17, N'Affidavit of Correction/Discrepancy for CCT/TCT', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (18, N'Affidavit of Guardianship', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (19, N'Affidavit of Loss', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (20, N'Affidavit of One & The Same Person of Co-owner', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (21, N'Affidavit of One & The Same Person of Principal Buyer', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (22, N'Affidavit of One & The Same Person of Spouse', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (23, N'Affidavit of Spouse''s Citizenship/ Sworn Statement', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (24, N'Affidavit of Undertaking for Estate Tax', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (25, N'Affidavit/Certificate of Finality of Separation', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (26, N'Affidavit/Certificate of Separation of Properties', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (27, N'Affidavit/Notice of Publication', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (28, N'Amendment to Contract to Sell (ACTS) - Notarized', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (29, N'Amendment to Deed of Absolute Sale (ADOAS) - Notarized', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (30, N'Annotated Title under Developer''s name', N'Pag-IBIG Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (31, N'Approved Computation Sheet (CS)', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (32, N'As-is-where-is Declaration', N'Turnover and Construction-related Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (33, N'Auto Debit Arrangement (ADA)', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (34, N'B&C Advisory Letter', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (35, N'B&C Reminder Letter', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (36, N'B&C Reminder Letter: Final', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (37, N'Backout with or without Refund', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (38, N'Backout with Transfer of Payment', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (39, N'Bank Application Copy', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (40, N'Bank Certificate/Notice of Full Payment', N'A_R Sales Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (41, N'Bank Guaranty (BG)', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (42, N'Bank Mortgage Agreement', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (43, N'BG Acknowledgement', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (44, N'BG Advisory Letter', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (45, N'BG Reminder Letter', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (46, N'BG Reminder Letter: Final', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (47, N'Bilateral Notice of Cancellation (BNOC)', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (48, N'Billing and Collection correspondences and payment related buyer''s request', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (49, N'BIR 1901/1902/1904/1905/2305 Application for BIR Registration for AIF per SPA', N'SPA_AIF Identification (Individual)')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (50, N'BIR 1901/1902/1904/1905/2305 Application for BIR Registration of Co-owner', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (51, N'BIR 1901/1902/1904/1905/2305 Application for BIR Registration of Co-owner 10', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (52, N'BIR 1901/1902/1904/1905/2305 Application for BIR Registration of Co-owner 2', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (53, N'BIR 1901/1902/1904/1905/2305 Application for BIR Registration of Co-owner 3', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (54, N'BIR 1901/1902/1904/1905/2305 Application for BIR Registration of Co-owner 4', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (55, N'BIR 1901/1902/1904/1905/2305 Application for BIR Registration of Co-owner 5', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (56, N'BIR 1901/1902/1904/1905/2305 Application for BIR Registration of Co-owner 6', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (57, N'BIR 1901/1902/1904/1905/2305 Application for BIR Registration of Co-owner 7', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (58, N'BIR 1901/1902/1904/1905/2305 Application for BIR Registration of Co-owner 8', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (59, N'BIR 1901/1902/1904/1905/2305 Application for BIR Registration of Co-owner 9', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (60, N'BIR 1901/1902/1904/1905/2305 Application for BIR Registration of Principal Buyer', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (61, N'BIR 1901/1902/1904/1905/2305 Application for BIR Registration of Spouse', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (62, N'BIR 1903/1904/1905/2303/2305 Application for BIR Registration', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (63, N'BIR 1903/1904/1905/2303/2305 Application for BIR Registration / Info update, corp.', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (64, N'BIR Claim Slip', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (65, N'BIR Form 0605 - Payment Form/Certification Fee', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (66, N'BIR Form 1606 - CWT Payment/Creditable Withholding Tax Return & Receipt', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (67, N'BIR Form 1706 - CGT Payment/Capital Gain Tax Return & Receipt', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (68, N'BIR Form 1706 - CGT Payment/Capital Gain Tax Return & Receipt-Share', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (69, N'BIR Form 1707 - CGT Payment/Capital Gain Tax Return & Receipt - Share', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (70, N'BIR Form 1800 - DTR Payment/Donor''s Tax Return & Receipt', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (71, N'BIR Form 1808 - ETR Payment/Estate Tax Return & Receipt', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (72, N'BIR Form 2000 - DST Mortgaged Payment/Documentary Stamp Tax Return & Receipt', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (73, N'BIR Form 2000 - OT-DST Payment/Documentary Stamp Tax Return & Receipt', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (74, N'BIR Form 2303 - Certificate of BIR Registration, corporate', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (75, N'BIR Form 2313 - Certificate Authorizing Registration (CAR)', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (76, N'BIR Form 2313 - Certificate Authorizing Registration (CAR) - Estate', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (77, N'Birth Certificate', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (78, N'Bounced check', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (79, N'Business Tax Receipt (BTR)', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (80, N'Buyer(s)''s Notice(s) of Assignment to Bank', N'A_R Sales Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (81, N'Buyer''s Application for Club Membership', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (82, N'Buyer''s Declaration of Co-owners of Shares', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (83, N'Cancellation of Developer�s Mortgage', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (84, N'Cancellation of Developer''s Mortgage', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (85, N'Certificate of Full Payment (COFP)', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (86, N'Certificate of No Improvement (CNI)/Certificate of No Tax Declaration (CNTD)', N'Ownership Documents - Developer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (87, N'Certificate of No Tax Declaration (CNTD)', N'Ownership Documents - Developer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (88, N'Certificate of Purchase (COP)', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (89, N'Certificate of Registration  (COR)', N'Ownership Documents - Developer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (90, N'Certificate of Registration (COR)', N'Ownership Documents - Developer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (91, N'Certificate Of Registration� (COR)', N'Ownership Documents - Developer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (92, N'Certified True Copy of Unit/Subdivided Tax Declaration under Developer''s Name - Building (TD-BD)', N'Ownership Documents - Developer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (93, N'Certified True Copy of Unit/Subdivided Tax Declaration under Developer''s Name - Lot (TD-LD)', N'Ownership Documents - Developer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (94, N'Certified True Copy of Unit/Subdivided Title under Developer''s Name (TCT/CCT-D)', N'Ownership Documents - Developer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (95, N'Checklist of Documents Received for AR Sale', N'A_R Sales Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (96, N'Checklist of Documents Received for Booking', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (97, N'CLI Certificate', N'Insurances')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (98, N'CLI Waiver', N'Insurances')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (99, N'Collection Notice (CN)', N'Payments and Billing Documents')
GO
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (100, N'Combined Secretary''s Cert./Board Res for Auth. Signatories & Stkholder Nat''lity', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (101, N'Computation of Liquidated Damages (LD comp)', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (102, N'Consent Form to Comply with Association Terms', N'Turnover and Construction-related Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (103, N'Consent Form to Future Project Changes', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (104, N'Contract of Lease (COL) - Notarized', N'Lease Agreement')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (105, N'Contract of Lease (COL) - Signed by Buyer', N'Lease Agreement')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (106, N'Contract to Sell (CTS) - Notarized', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (107, N'Contract to Sell (CTS) - Signed by Buyer', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (108, N'Corporate Buyer''s SEC General Information Sheet', N'Buyer Identification - Corporate')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (109, N'Corporate Buyer''s SEC Registration', N'Buyer Identification - Corporate')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (110, N'Corporate Discount Application Form (CDAF)', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (111, N'Correspondence/Notice of Cancellation from Bank/Reply Letter', N'A_R Sales Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (112, N'Correspondence/Request/Approval for Payment Extension', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (113, N'Correspondence/Request/Approval/Disapproval/Approval to proceed w/ reservation and booking even w/ doc deficiencies', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (114, N'Court Order: Certificate of Finality for Minor Child/Children', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (115, N'Cover Letter for ACTS - Buyer Signature', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (116, N'Cover Letter for ACTS - Notarized Copy', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (117, N'Cover Letter for COL - Buyer Signature', N'Lease Agreement')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (118, N'Cover Letter for COL - Notarized Copy', N'Lease Agreement')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (119, N'Cover Letter for CTS - Buyer Signature', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (120, N'Cover Letter for CTS - Notarized Copy', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (121, N'Cover Letter for DOA - Buyer Signature', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (122, N'Cover Letter for DOA - Notarized Copy', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (123, N'Cover Letter for DOAS - Buyer Signature', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (124, N'Cover Letter for DOAS - Notarized Copy', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (125, N'Cover Letter for DOC - Buyer Signature', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (126, N'Cover Letter for DOC - Notarized Copy', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (127, N'Cover Letter for SDOAS - Buyer Signature', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (128, N'Cover Letter for SDOAS - Notarized Copy', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (129, N'Credit Approval', N'Credit Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (130, N'Credit Approval: Revision', N'Credit Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (131, N'Credit Card Payments (CCP)', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (132, N'Credit Investigation Result', N'Credit Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (133, N'Credit Life Insurance Application for Co-Owner', N'Insurances')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (134, N'Credit Life Insurance Application for Co-Owner 10', N'Insurances')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (135, N'Credit Life Insurance Application for Co-Owner 2', N'Insurances')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (136, N'Credit Life Insurance Application for Co-Owner 3', N'Insurances')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (137, N'Credit Life Insurance Application for Co-Owner 4', N'Insurances')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (138, N'Credit Life Insurance Application for Co-Owner 5', N'Insurances')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (139, N'Credit Life Insurance Application for Co-Owner 6', N'Insurances')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (140, N'Credit Life Insurance Application for Co-Owner 7', N'Insurances')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (141, N'Credit Life Insurance Application for Co-Owner 8', N'Insurances')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (142, N'Credit Life Insurance Application for Co-Owner 9', N'Insurances')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (143, N'Credit Life Insurance Application for Principal Buyer', N'Insurances')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (144, N'Credit Life Insurance Application for Spouse', N'Insurances')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (145, N'Credit Waiver/ Exception/ Non-submission/ Late submission', N'Credit Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (146, N'Death Certificate', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (147, N'Deed of Absolute Sale (DOAS) - Notarized', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (148, N'Deed of Absolute Sale (DOAS) - Signed by Buyer', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (149, N'Deed of Absolute Sale (DOAS) - Stamped by BIR', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (150, N'Deed of Absolute Sale with Mortgage & Amendments - Notarized', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (151, N'Deed of Absolute Sale with RD stamp', N'Pag-IBIG Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (152, N'Deed of Assignment (DOA) - Notarized', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (153, N'Deed of Assignment with Special Power of Attorney', N'Pag-IBIG Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (154, N'Deed of Cancellation (DOC) - Notarized', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (155, N'Deed of Undertaking on REM Conversion', N'Pag-IBIG Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (156, N'Deemed Acceptance Notice', N'Turnover and Construction-related Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (157, N'Delivery Receipt - BG Advisory Letter', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (158, N'Delivery Receipt - BG Reminder Letter', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (159, N'Delivery Receipt - BG Reminder Letter: Final', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (160, N'Delivery Receipt - Bilateral Notice of Cancellation (BNOC)', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (161, N'Delivery Receipt - Collection Notice (CN)', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (162, N'Delivery Receipt - Final Collection Notice (FCN)', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (163, N'Delivery Receipt - First Notice-UDOAS', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (164, N'Delivery Receipt - Forfeiture of Reservation Deposit', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (165, N'Delivery Receipt - NOA of Share Certificate', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (166, N'Delivery Receipt - NOA of Tax Declaration', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (167, N'Delivery Receipt - NOA of Title', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (168, N'Delivery Receipt - Notice of Effectivity of Cancellation (NOEC)', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (169, N'Delivery Receipt - Reminder Letter for Unclaimed Title', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (170, N'Delivery Receipt - Safekeeping Fee Letter for Buyer''s Title', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (171, N'Delivery Receipt - Second Notice-UDOAS', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (172, N'Delivery Receipt - Unilateral Notice of Cancellation (UNOC)', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (173, N'Delivery Receipt - Welcome/Thank You/Reminder Letter', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (174, N'Delivery Receipt for ACTS - Buyer Signature', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (175, N'Delivery Receipt for ACTS - Notarized Copy', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (176, N'Delivery Receipt for COL - Buyer Signature', N'Lease Agreement')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (177, N'Delivery Receipt for COL - Notarized Copy', N'Lease Agreement')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (178, N'Delivery Receipt for CTS - Buyer Signature', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (179, N'Delivery Receipt for CTS - Notarized Copy', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (180, N'Delivery Receipt for DOA - Buyer Signature', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (181, N'Delivery Receipt for DOA - Notarized Copy', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (182, N'Delivery Receipt for DOAS - Buyer Signature', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (183, N'Delivery Receipt for DOAS - Notarized Copy', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (184, N'Delivery Receipt for DOC - Buyer Signature', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (185, N'Delivery Receipt for DOC - Notarized Copy', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (186, N'Delivery Receipt for SDOAS - Buyer Signature', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (187, N'Delivery Receipt for SDOAS - Notarized Copy', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (188, N'Developer''s Letter of Undertaking to Bank (LOU)', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (189, N'Developer''s Official Receipts', N'Official Receipts')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (190, N'Developer''S Secretary''s Certificate', N'Ownership Documents - Developer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (191, N'Direct Deposits with confirmation from Treasury', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (192, N'Disclosure Statement', N'Pag-IBIG Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (193, N'Document Exception (non-RAP)', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (194, N'DTI Registration', N'Buyer Identification - Corporate')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (195, N'Early Turnover Agreement (ETOA)', N'Turnover and Construction-related Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (196, N'Employee Discount Application Form (EDAF)', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (197, N'Endorsement/Referral Letter to Bank', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (198, N'Estate Settlement Document', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (199, N'Extra Judicial Settlement (EJS)', N'Legal Authorization Documents')
GO
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (200, N'Final Collection Notice (FCN)', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (201, N'Final Reservation Agreement (FRA)', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (202, N'First Notice - UDOAS', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (203, N'First Recovery Letter - Buyer Deficiencies DOAS', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (204, N'Forfeiture Letter', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (205, N'HDMF Contract to Sell', N'Pag-IBIG Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (206, N'HDMF Deed of Absolute Sale H4-74 (bet. HDMF and Buyer)', N'Pag-IBIG Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (207, N'I.T. FEE CHECK', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (208, N'Incident Report - Correction/Discrepancy for TD', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (209, N'Insurance Claims Documents', N'Insurances')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (210, N'Joint & Solidary Undertaking', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (211, N'Letter confirmation on signature of AIF', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (212, N'Letter confirmation on signature of Co-owner', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (213, N'Letter confirmation on signature of Co-owner 10', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (214, N'Letter confirmation on signature of Co-owner 3', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (215, N'Letter confirmation on signature of Co-owner 4', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (216, N'Letter confirmation on signature of Co-owner 5', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (217, N'Letter confirmation on signature of Co-owner 6', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (218, N'Letter confirmation on signature of Co-owner 7', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (219, N'Letter confirmation on signature of Co-owner 8', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (220, N'Letter confirmation on signature of Co-owner 9', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (221, N'Letter confirmation on signature of Co-owner2', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (222, N'Letter confirmation on signature of Corporate Buyer''s Authorized Signatory', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (223, N'Letter confirmation on signature of Principal Buyer', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (224, N'Letter confirmation on signature of Spouse', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (225, N'Letter of Advice re: Correction of Units Details in RA', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (226, N'Letter of Endorsement (LOE)', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (227, N'License To Sell (LTS)', N'Ownership Documents - Developer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (228, N'Loan Difference (LD) Clearance', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (229, N'Loan Mortgage Agreement', N'Pag-IBIG Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (230, N'Loan Mortgage Agreement with RD stamp', N'Pag-IBIG Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (231, N'Lot/Site Development Plan (LP)', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (232, N'LOU extensions', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (233, N'Lumpsum / Bullet / Balloon Payment Reminder', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (234, N'Lumpsum/Final payment check', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (235, N'Marriage Certificate', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (236, N'Mayor''s Business Permit', N'Buyer Identification - Corporate')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (237, N'Membership Information Sheet', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (238, N'Notice of Approval', N'Pag-IBIG Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (239, N'Notice of Availability of Share Certificate (NOA-SC)', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (240, N'Notice of Availability of Tax Declaration under Buyer''s Name (NOA-TD)', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (241, N'Notice of Availability of Title under Buyer''s Name (NOA-Title)', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (242, N'Notice of Effectivity of Cancellation (NOEC)', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (243, N'Notice of Loan Release', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (244, N'Oath of Allegiance of Co-owner', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (245, N'Oath of Allegiance of Co-owner 10', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (246, N'Oath of Allegiance of Co-owner 2', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (247, N'Oath of Allegiance of Co-owner 3', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (248, N'Oath of Allegiance of Co-owner 4', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (249, N'Oath of Allegiance of Co-owner 5', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (250, N'Oath of Allegiance of Co-owner 6', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (251, N'Oath of Allegiance of Co-owner 7', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (252, N'Oath of Allegiance of Co-owner 8', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (253, N'Oath of Allegiance of Co-owner 9', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (254, N'Oath of Allegiance of Principal Buyer', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (255, N'Oath of Allegiance of Spouse', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (256, N'ONETT Computation Sheet', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (257, N'Order of Payment', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (258, N'Original (Owner''s Duplicate Certificate) TCT/CCT', N'Ownership Documents - Developer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (259, N'Parking Acceptance', N'Turnover and Construction-related Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (260, N'Passport Date of Entry/Exit', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (261, N'PDC Transmittal', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (262, N'PDC: Pull-out/Holding/Replacement', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (263, N'PDCs Submitted', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (264, N'PDC''s under RAP', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (265, N'Promissory Note', N'Pag-IBIG Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (266, N'Proof of Mailing Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (267, N'Provisional Receipt', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (268, N'Pull-out/Holding of PDC', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (269, N'Pull-out/Holding of PDC - eForm', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (270, N'RAP Reminder Letter', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (271, N'RCP: Excess Payment', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (272, N'RCP: Others', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (273, N'RCP: Payment to Bank', N'A_R Sales Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (274, N'RCP: Payment Transfer between Developer & JV', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (275, N'RCP: Reservation Fee', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (276, N'RCP: Transfer/Change Unit/Change Name', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (277, N'RD EPEB No. Receipt', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (278, N'Real Property Tax Receipt (RPTR) for Buyer or Dev. - Building/Unit', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (279, N'Real Property Tax Receipt (RPTR) for Buyer or Dev. - Lot', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (280, N'Receiving Copy of DP/PDC''s Transmittal from Accounting', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (281, N'Receiving Copy of Lacking PDCs', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (282, N'Receiving copy of LOE', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (283, N'Receiving Copy of Lot/Site Development Plan (RC-LP)', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (284, N'Receiving Copy of Notarized Contract to Sell from Bank', N'A_R Sales Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (285, N'Receiving Copy of RF Transmittal from Accounting', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (286, N'Receiving Copy of Share Certificate (RC-SC)', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (287, N'Receiving Copy of Tax Clearance (RC-TC)', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (288, N'Receiving copy of Tax Declaration under Bank Financing (signed)', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (289, N'Receiving Copy of Tax Declaration under Buyer''s Name (RC-TD)', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (290, N'Receiving copy of Title under Bank Financing (signed)', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (291, N'Receiving Copy of Title under Buyer''s Name (RC-Title)', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (292, N'Receiving Copy of Title under Developer''s Name', N'A_R Sales Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (293, N'Receiving Copy of Transmittal: Business Tax for Payment from Messenger', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (294, N'Receiving Copy of Transmittal: CGT for Payment from Messenger', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (295, N'Receiving Copy of Transmittal: CWT for Payment from Messenger', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (296, N'Receiving Copy of Transmittal: DST for Payment from Messenger', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (297, N'Receiving Copy of Transmittal: Registration and IT Fee from AAO', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (298, N'Receiving Copy of Transmittal: Registration and IT Fee Mortage to AAO', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (299, N'Receiving Copy of Transmittal: Transfer Tax for Payment from Messenger', N'Transfer Related Payment Documents')
GO
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (300, N'Receiving Copy Transmittal: DST Mortgage for Payment from Messenger', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (301, N'Record Update Form (RUF)', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (302, N'Record Update Form (RUF) - signed', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (303, N'Recovery Letter - Buyer Deficiencies CTS', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (304, N'Recovery Letter - Unreturned CTS', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (305, N'Re-deposited Check', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (306, N'REGISTRATION FEE CHECK', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (307, N'Release and Quit Claim', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (308, N'Relocation of Post', N'Turnover and Construction-related Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (309, N'Request / Complaints Letter', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (310, N'Request for Acceptance of Additional Deposit (RAAD) - Form', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (311, N'Request for Acceptance of Payment (RAP)', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (312, N'Request for Advance Contract Preparation', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (313, N'Request for Back-out - eForm', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (314, N'Request for Change in Contact Details', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (315, N'Request for Change Unit/Lot : Downgrade', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (316, N'Request for Change Unit/Lot : Inter-brand Transfer', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (317, N'Request for Change Unit/Lot : Upgrade', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (318, N'Request for Correction of Name', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (319, N'Request for CTS and DOAS amendment', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (320, N'Request for Extension of Payment (REP) - Form', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (321, N'Request for Letter of Endorsement', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (322, N'Request for Re-deposit', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (323, N'Request for Reprinting of Contract', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (324, N'Request for Transfer of Ownership from Deceased Buyer', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (325, N'Request for Transfer of Ownership: Partial/Full', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (326, N'Request Letter to Pull-Out Developer''s TCT', N'Pag-IBIG Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (327, N'Request Letter to Pull-Out Pre-Signed Documents', N'Pag-IBIG Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (328, N'Request/Approval for Club Membership/ Member''s List', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (329, N'Request/Approval of Waiver of Charges/Penalties', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (330, N'Reservation Fee', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (331, N'RTS - ACTS - Buyer Signature-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (332, N'RTS - ACTS - Buyer Signature-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (333, N'RTS - ACTS - Buyer Signature-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (334, N'RTS - ACTS - Buyer Signature-Unknown Addressee', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (335, N'RTS - ACTS - Buyer Signature-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (336, N'RTS - ACTS - Notarized Copy-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (337, N'RTS - ACTS - Notarized Copy-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (338, N'RTS - ACTS - Notarized Copy-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (339, N'RTS - ACTS - Notarized Copy-Unknown Addressee', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (340, N'RTS - ACTS - Notarized Copy-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (341, N'RTS - BG Advisory Letter-Incomplete Address', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (342, N'RTS - BG Advisory Letter-Move Out', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (343, N'RTS - BG Advisory Letter-Refused to Accept', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (344, N'RTS - BG Advisory Letter-Unknown Addressee', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (345, N'RTS - BG Advisory Letter-Unlocated Address', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (346, N'RTS - BG Reminder Letter: Final-Incomplete Address', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (347, N'RTS - BG Reminder Letter: Final-Move Out', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (348, N'RTS - BG Reminder Letter: Final-Refused to Accept', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (349, N'RTS - BG Reminder Letter: Final-Unknown Addressee', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (350, N'RTS - BG Reminder Letter: Final-Unlocated Address', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (351, N'RTS - BG Reminder Letter-Incomplete Address', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (352, N'RTS - BG Reminder Letter-Move Out', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (353, N'RTS - BG Reminder Letter-Refused to Accept', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (354, N'RTS - BG Reminder Letter-Unknown Addressee', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (355, N'RTS - BG Reminder Letter-Unlocated Address', N'Bank Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (356, N'RTS - Bilateral Notice of Cancellation (BNOC)-Incomplete Address', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (357, N'RTS - Bilateral Notice of Cancellation (BNOC)-Move Out', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (358, N'RTS - Bilateral Notice of Cancellation (BNOC)-Refused to Accept', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (359, N'RTS - Bilateral Notice of Cancellation (BNOC)-Unknown Addressee', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (360, N'RTS - Bilateral Notice of Cancellation (BNOC)-Unlocated Address', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (361, N'RTS - COL - Buyer Signature-Incomplete Address', N'Lease Agreement')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (362, N'RTS - COL - Buyer Signature-Move Out', N'Lease Agreement')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (363, N'RTS - COL - Buyer Signature-Refused to Accept', N'Lease Agreement')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (364, N'RTS - COL - Buyer Signature-Unknown Addressee', N'Lease Agreement')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (365, N'RTS - COL - Buyer Signature-Unlocated Address', N'Lease Agreement')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (366, N'RTS - COL - Notarized Copy-Incomplete Address', N'Lease Agreement')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (367, N'RTS - COL - Notarized Copy-Move Out', N'Lease Agreement')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (368, N'RTS - COL - Notarized Copy-Refused to Accept', N'Lease Agreement')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (369, N'RTS - COL - Notarized Copy-Unknown Addressee', N'Lease Agreement')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (370, N'RTS - COL - Notarized Copy-Unlocated Address', N'Lease Agreement')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (371, N'RTS - Collection Notice (CN)-Incomplete Address', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (372, N'RTS - Collection Notice (CN)-Move Out', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (373, N'RTS - Collection Notice (CN)-Refused to Accept', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (374, N'RTS - Collection Notice (CN)-Unknown Addressee', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (375, N'RTS - Collection Notice (CN)-Unlocated Address', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (376, N'RTS - CTS - Buyer Signature-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (377, N'RTS - CTS - Buyer Signature-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (378, N'RTS - CTS - Buyer Signature-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (379, N'RTS - CTS - Buyer Signature-Unknown Addressee', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (380, N'RTS - CTS - Buyer Signature-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (381, N'RTS - CTS - Notarized Copy-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (382, N'RTS - CTS - Notarized Copy-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (383, N'RTS - CTS - Notarized Copy-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (384, N'RTS - CTS - Notarized Copy-Unknown Addressee', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (385, N'RTS - CTS - Notarized Copy-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (386, N'RTS - DOA - Buyer Signature-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (387, N'RTS - DOA - Buyer Signature-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (388, N'RTS - DOA - Buyer Signature-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (389, N'RTS - DOA - Buyer Signature-Unknown Addressee', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (390, N'RTS - DOA - Buyer Signature-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (391, N'RTS - DOA - Notarized Copy-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (392, N'RTS - DOA - Notarized Copy-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (393, N'RTS - DOA - Notarized Copy-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (394, N'RTS - DOA - Notarized Copy-Unknown Addressee', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (395, N'RTS - DOA - Notarized Copy-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (396, N'RTS - DOAS - Buyer Signature-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (397, N'RTS - DOAS - Buyer Signature-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (398, N'RTS - DOAS - Buyer Signature-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (399, N'RTS - DOAS - Buyer Signature-Unknown Addressee', N'Documentary Compliance Tracking')
GO
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (400, N'RTS - DOAS - Buyer Signature-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (401, N'RTS - DOAS - Notarized Copy-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (402, N'RTS - DOAS - Notarized Copy-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (403, N'RTS - DOAS - Notarized Copy-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (404, N'RTS - DOAS - Notarized Copy-Unknown Addressee', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (405, N'RTS - DOAS - Notarized Copy-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (406, N'RTS - DOAS Pag-ibig - Buyer Signature-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (407, N'RTS - DOAS Pag-ibig - Buyer Signature-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (408, N'RTS - DOAS Pag-ibig - Buyer Signature-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (409, N'RTS - DOAS Pag-ibig - Buyer Signature-Unknown Addressee', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (410, N'RTS - DOAS Pag-ibig - Buyer Signature-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (411, N'RTS - DOAS Pag-ibig - Notarized Copy-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (412, N'RTS - DOAS Pag-ibig - Notarized Copy-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (413, N'RTS - DOAS Pag-ibig - Notarized Copy-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (414, N'RTS - DOAS Pag-ibig - Notarized Copy-Unknown Addressee', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (415, N'RTS - DOAS Pag-ibig - Notarized Copy-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (416, N'RTS - DOC - Buyer Signature-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (417, N'RTS - DOC - Buyer Signature-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (418, N'RTS - DOC - Buyer Signature-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (419, N'RTS - DOC - Buyer Signature-Unknown Addressee', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (420, N'RTS - DOC - Buyer Signature-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (421, N'RTS - DOC - Notarized Copy-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (422, N'RTS - DOC - Notarized Copy-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (423, N'RTS - DOC - Notarized Copy-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (424, N'RTS - DOC - Notarized Copy-Unknown Addressee', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (425, N'RTS - DOC - Notarized Copy-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (426, N'RTS - Final Collection Notice (FCN)-Incomplete Address', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (427, N'RTS - Final Collection Notice (FCN)-Move Out', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (428, N'RTS - Final Collection Notice (FCN)-Refused to Accept', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (429, N'RTS - Final Collection Notice (FCN)-Unknown Addressee', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (430, N'RTS - Final Collection Notice (FCN)-Unlocated Address', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (431, N'RTS - First Notice - UDOAS-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (432, N'RTS - First Notice - UDOAS-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (433, N'RTS - First Notice - UDOAS-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (434, N'RTS - First Notice - UDOAS-Unknown Addressee', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (435, N'RTS - First Notice - UDOAS-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (436, N'RTS - Forfeiture of Reservation Deposit-Incomplete Address', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (437, N'RTS - Forfeiture of Reservation Deposit-Move Out', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (438, N'RTS - Forfeiture of Reservation Deposit-Refused to Accept', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (439, N'RTS - Forfeiture of Reservation Deposit-Unlocated Address', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (440, N'RTS - NOA of Share Certificate-Incomplete Address', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (441, N'RTS - NOA of Share Certificate-Move Out', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (442, N'RTS - NOA of Share Certificate-Refused to Accept', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (443, N'RTS - NOA of Share Certificate-Unknown Addressee', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (444, N'RTS - NOA of Share Certificate-Unlocated Address', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (445, N'RTS - NOA of Tax Declaration-Incomplete Address', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (446, N'RTS - NOA of Tax Declaration-Move Out', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (447, N'RTS - NOA of Tax Declaration-Refused to Accept', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (448, N'RTS - NOA of Tax Declaration-Unknown Addressee', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (449, N'RTS - NOA of Tax Declaration-Unlocated Address', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (450, N'RTS - NOA of Title-Incomplete Address', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (451, N'RTS - NOA of Title-Move Out', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (452, N'RTS - NOA of Title-Refused to Accept', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (453, N'RTS - NOA of Title-Unknown Addressee', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (454, N'RTS - NOA of Title-Unlocated Address', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (455, N'RTS - Notice of Effectivity of Cancellation (NOEC)-Incomplete Address', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (456, N'RTS - Notice of Effectivity of Cancellation (NOEC)-Move Out', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (457, N'RTS - Notice of Effectivity of Cancellation (NOEC)-Refused to Accept', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (458, N'RTS - Notice of Effectivity of Cancellation (NOEC)-Unknown Addressee', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (459, N'RTS - Notice of Effectivity of Cancellation (NOEC)-Unlocated Address', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (460, N'RTS - Safekeeping Fee Letter for Buyer''s Title-Incomplete Address', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (461, N'RTS - Safekeeping Fee Letter for Buyer''s Title-Move Out', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (462, N'RTS - Safekeeping Fee Letter for Buyer''s Title-Refused to Accept', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (463, N'RTS - Safekeeping Fee Letter for Buyer''s Title-Unknown Addressee', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (464, N'RTS - Safekeeping Fee Letter for Buyer''s Title-Unlocated Address', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (465, N'RTS - SDOAS - Buyer Signature-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (466, N'RTS - SDOAS - Buyer Signature-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (467, N'RTS - SDOAS - Buyer Signature-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (468, N'RTS - SDOAS - Buyer Signature-Unknown Addressee', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (469, N'RTS - SDOAS - Buyer Signature-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (470, N'RTS - SDOAS - Notarized Copy-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (471, N'RTS - SDOAS - Notarized Copy-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (472, N'RTS - SDOAS - Notarized Copy-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (473, N'RTS - SDOAS - Notarized Copy-Unknown Addressee', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (474, N'RTS - SDOAS - Notarized Copy-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (475, N'RTS - Second Notice - UDOAS-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (476, N'RTS - Second Notice - UDOAS-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (477, N'RTS - Second Notice - UDOAS-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (478, N'RTS - Second Notice - UDOAS-Unknown Addressee', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (479, N'RTS - Second Notice - UDOAS-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (480, N'RTS - UDOAS - Buyer Signature-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (481, N'RTS - UDOAS - Buyer Signature-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (482, N'RTS - UDOAS - Buyer Signature-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (483, N'RTS - UDOAS - Buyer Signature-Unknown Addressee', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (484, N'RTS - UDOAS - Buyer Signature-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (485, N'RTS - UDOAS - Notarized Copy-Incomplete Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (486, N'RTS - UDOAS - Notarized Copy-Move Out', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (487, N'RTS - UDOAS - Notarized Copy-Refused to Accept', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (488, N'RTS - UDOAS - Notarized Copy-Unknown Addressee', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (489, N'RTS - UDOAS - Notarized Copy-Unlocated Address', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (490, N'RTS - Unilateral Notice of Cancellation (UNOC)-Incomplete Address', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (491, N'RTS - Unilateral Notice of Cancellation (UNOC)-Move Out', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (492, N'RTS - Unilateral Notice of Cancellation (UNOC)-Refused to Accept', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (493, N'RTS - Unilateral Notice of Cancellation (UNOC)-Unknown Addressee', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (494, N'RTS - Unilateral Notice of Cancellation (UNOC)-Unlocated Address', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (495, N'RTS - Welcome/Thank You/Reminder Letter-Incomplete Address', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (496, N'RTS - Welcome/Thank You/Reminder Letter-Move Out', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (497, N'RTS - Welcome/Thank You/Reminder Letter-Refused to Accept', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (498, N'RTS - Welcome/Thank You/Reminder Letter-Unknown Addressee', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (499, N'RTS - Welcome/Thank You/Reminder Letter-Unlocated Address', N'Payments and Billing Documents')
GO
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (500, N'Safekeeping Fee Letter for Buyer''s Title', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (501, N'Second Notice - UDOAS', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (502, N'Second Recovery Letter - Buyer Deficiencies DOAS', N'Documentary Compliance Tracking')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (503, N'Seller''s Discount Application Form (SDAF)', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (504, N'Share Certificate under Buyer''s Name (SC-B)', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (505, N'Share Certificate under Developer''s Name (SC-D)', N'Ownership Documents - Developer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (506, N'Special Power of Attorney (Co-owner and Spouse)', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (507, N'Special Power of Attorney (Co-owner)', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (508, N'Special Power of Attorney (Co-owner''s Spouse)', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (509, N'Special Power of Attorney (DENR Form)', N'Pag-IBIG Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (510, N'Special Power of Attorney (Principal Buyer and Co-owner)', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (511, N'Special Power of Attorney (Principal Buyer and Spouse)', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (512, N'Special Power of Attorney (Principal Buyer)', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (513, N'Special Power of Attorney (Principal Buyer);Special Power of Attorney (Principal Buyer''s Spouse);Special Power of Attorney (Principal Buyer and Spouse);Special Power of Attorney (Principal Buyer and Co-owner);Special Power of Attorney (Co-owner);Special P', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (514, N'Special Power of Attorney (Principal Buyer''s Spouse)', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (515, N'Special Request Form (SRF)', N'Buyer Request')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (516, N'Statement of Account (SOA)', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (517, N'Supplement to the Deed of Absolute Sale (SDOAS) - Notarized', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (518, N'Supplement to the Deed of Absolute Sale (SDOAS) - Signed by Buyer', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (519, N'Supplemental Agreement to the Final RA & Amendment', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (520, N'Sworn Declaration of No Improvement on Real Property (SwornDec)', N'Ownership Documents - Developer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (521, N'Sworn Statement Declaring the True Current and Fair Market Value of Real Properties', N'Ownership Documents - Developer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (522, N'Tax Clearance for Buyer or Dev. - Building/Unit', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (523, N'Tax Clearance for Buyer or Dev. - Lot', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (524, N'Transfer Tax Receipt (TTR)', N'Transfer Related Payment Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (525, N'Transmittal of Tax Payments Received by HDMF', N'Pag-IBIG Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (526, N'Trust Account Documents', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (527, N'Trust Agreement', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (528, N'Trust Receipt', N'Pag-IBIG Financing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (529, N'Unilateral Deed of Absolute Sale (UDOAS) - Notarized', N'Sales Agreements')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (530, N'Unilateral Notice of Cancellation (UNOC)', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (531, N'Unit & Lot Acceptance', N'Turnover and Construction-related Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (532, N'Unit/Subdivided Tax Declaration under Buyer''s Name - Building (TD-BB)', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (533, N'Unit/Subdivided Tax Declaration under Buyer''s Name - Lot (TD-LB)', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (534, N'Unit/Subdivided Tax Declaration under Buyer''s Name (TD-B)', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (535, N'Unit/Subdivided Tax Declaration under Developer''s Name - Building (TD-BD)', N'Ownership Documents - Developer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (536, N'Unit/Subdivided Tax Declaration under Developer''s Name - Lot (TD-LD)', N'Ownership Documents - Developer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (537, N'Unit/Subdivided Title Under Buyer''s Name (TCT/CCT-B)', N'Ownership Documents - Buyer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (538, N'Unit/Subdivided Title under Developer''s Name (TCT/CCT-D)', N'Ownership Documents - Developer')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (539, N'Valid ID/Proof of Identification - Updated', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (540, N'Valid ID/Proof of Identification of Buyer''s AIF per SPA', N'SPA_AIF Identification (Individual)')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (541, N'Valid ID/Proof of Identification of Co-owner', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (542, N'Valid ID/Proof of Identification of Co-owner 10', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (543, N'Valid ID/Proof of Identification of Co-owner 2', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (544, N'Valid ID/Proof of Identification of Co-owner 3', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (545, N'Valid ID/Proof of Identification of Co-owner 4', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (546, N'Valid ID/Proof of Identification of Co-owner 5', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (547, N'Valid ID/Proof of Identification of Co-owner 6', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (548, N'Valid ID/Proof of Identification of Co-owner 7', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (549, N'Valid ID/Proof of Identification of Co-owner 8', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (550, N'Valid ID/Proof of Identification of Co-owner 9', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (551, N'Valid ID/Proof of Identification of Corporate Buyer''s Authorized Signatory', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (552, N'Valid ID/Proof of Identification of Corporate Buyer''s Authorized Signatory 2', N'Buyer Identification - Corporate')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (553, N'Valid ID/Proof of Identification of Principal Buyer', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (554, N'Valid ID/Proof of Identification of Spouse', N'Buyer Identification - Individual')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (555, N'Waiver of CGT and DST', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (556, N'Waiver of Donor''s Tax', N'Legal Authorization Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (557, N'Welcome Letter', N'Payments and Billing Documents')
INSERT [dbo].[nomenclature_lookup] ([id], [nomenclature], [documentGroup]) VALUES (558, N'Wire Transfer Payments with confirmation from Treasury', N'Payments and Billing Documents')
SET IDENTITY_INSERT [dbo].[nomenclature_lookup] OFF
GO
SET IDENTITY_INSERT [dbo].[nomenclature_whitelist] ON 

INSERT [dbo].[nomenclature_whitelist] ([id], [description]) VALUES (1, N'Developer''s Official Receipts')
INSERT [dbo].[nomenclature_whitelist] ([id], [description]) VALUES (2, N'Unit/Subdivided Tax Declaration under Buyer''s Name - Building (TD-BB)')
INSERT [dbo].[nomenclature_whitelist] ([id], [description]) VALUES (3, N'Unit/Subdivided Tax Declaration under Buyer''s Name - Lot (TD-LB)')
INSERT [dbo].[nomenclature_whitelist] ([id], [description]) VALUES (4, N'Unit/Subdivided Tax Declaration under Buyer''s Name (TD-B)')
INSERT [dbo].[nomenclature_whitelist] ([id], [description]) VALUES (5, N'Unit/Subdivided Title Under Buyer''s Name (TCT/CCT-B)')
SET IDENTITY_INSERT [dbo].[nomenclature_whitelist] OFF
GO
ALTER TABLE [dbo].[document] ADD  CONSTRAINT [DF_document_isFileDeleted]  DEFAULT ((0)) FOR [isFileDeleted]
GO
ALTER TABLE [dbo].[document] ADD  CONSTRAINT [DF_document_pageTotal]  DEFAULT ((1)) FOR [pageTotal]
GO
ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_user_IsActive]  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[user] ADD  DEFAULT ('NA') FOR [objectId]
GO
ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_user_isDeleted]  DEFAULT ((0)) FOR [isDeleted]
GO
ALTER TABLE [dbo].[document]  WITH CHECK ADD  CONSTRAINT [FK_document_user] FOREIGN KEY([userUsername])
REFERENCES [dbo].[user] ([username])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[document] CHECK CONSTRAINT [FK_document_user]
GO
ALTER TABLE [dbo].[document_history]  WITH CHECK ADD  CONSTRAINT [FK_4a9486398505240b92812660f7f] FOREIGN KEY([documentId])
REFERENCES [dbo].[document] ([id])
GO
ALTER TABLE [dbo].[document_history] CHECK CONSTRAINT [FK_4a9486398505240b92812660f7f]
GO
