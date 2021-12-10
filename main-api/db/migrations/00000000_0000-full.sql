/****** Object:  Table [dbo].[document_history]    Script Date: 12/10/2021 12:22:29 AM ******/
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
	[salesforceResponse] [nvarchar](max) NULL,
	[springcmResponse] [nvarchar](max) NULL,
 CONSTRAINT [PK_0783dd4cd636039459ee63c9a8b] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[document_latest_distinct_status]    Script Date: 12/10/2021 12:22:29 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[document_latest_distinct_status] AS
SELECT 
documentId, 
documentStatus,
MAX(createdDate) AS updatedDate
FROM document_history
GROUP BY documentId,
documentStatus
GO
/****** Object:  View [dbo].[document_latest_info_request]    Script Date: 12/10/2021 12:22:29 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[document_latest_info_request] AS
SELECT 
document_latest_distinct_status.documentId,
MAX(document_latest_distinct_status.updatedDate) AS updatedDate
FROM document_latest_distinct_status
INNER JOIN document_history
ON document_latest_distinct_status.documentId = document_history.documentId 
AND document_latest_distinct_status.updatedDate = document_history.createdDate 
AND document_latest_distinct_status.documentStatus = document_history.documentStatus
WHERE document_history.documentStatus = 'INDEXING_FAILED' or document_history.documentStatus = 'INDEXING_DONE'
GROUP BY document_latest_distinct_status.documentId
GO
/****** Object:  Table [dbo].[activity_log]    Script Date: 12/10/2021 12:22:29 AM ******/
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
/****** Object:  Table [dbo].[document]    Script Date: 12/10/2021 12:22:29 AM ******/
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
/****** Object:  Table [dbo].[nomenclature_lookup]    Script Date: 12/10/2021 12:22:29 AM ******/
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
/****** Object:  Table [dbo].[nomenclature_whitelist]    Script Date: 12/10/2021 12:22:29 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[nomenclature_whitelist](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[description] [nvarchar](255) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user]    Script Date: 12/10/2021 12:22:29 AM ******/
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
 CONSTRAINT [PK_cace4a159ff9f2512dd42373760] PRIMARY KEY CLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[document] ADD  CONSTRAINT [DF_document_isFileDeleted]  DEFAULT ((0)) FOR [isFileDeleted]
GO
ALTER TABLE [dbo].[document] ADD  CONSTRAINT [DF_document_pageTotal]  DEFAULT ((1)) FOR [pageTotal]
GO
ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_user_IsActive]  DEFAULT ((1)) FOR [isActive]
GO
ALTER TABLE [dbo].[user] ADD  DEFAULT ('NA') FOR [objectId]
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
