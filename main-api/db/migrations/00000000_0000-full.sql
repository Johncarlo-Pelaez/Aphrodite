/****** Object:  Table [dbo].[document]    Script Date: 11/25/2021 12:38:28 PM ******/
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
	[springReqParams] [nvarchar](max) NULL,
	[documentDate] [nvarchar](150) NULL,
	[encoder] [nvarchar](255) NULL,
	[encodedAt] [datetime] NULL,
	[checker] [nvarchar](255) NULL,
	[checkedAt] [datetime] NULL,
	[approver] [nvarchar](255) NULL,
	[encodeValues] [nvarchar](max) NULL,
 CONSTRAINT [PK_document] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[document_history]    Script Date: 11/25/2021 12:38:28 PM ******/
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
	[userUsername] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_0783dd4cd636039459ee63c9a8b] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[lookup]    Script Date: 11/25/2021 12:38:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[lookup](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nomenClature] [nvarchar](max) NOT NULL,
	[documentGroup] [nvarchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[nomenclature]    Script Date: 11/25/2021 12:38:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[nomenclature](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[description] [nvarchar](255) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user]    Script Date: 11/25/2021 12:38:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](255) NOT NULL,
	[firstName] [nvarchar](255) NULL,
	[lastName] [nvarchar](255) NULL,
	[role] [nvarchar](50) NOT NULL,
	[createdDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[isDeleted] [bit] NOT NULL,
	[modifiedDate] [datetime] NULL,
 CONSTRAINT [PK_cace4a159ff9f2512dd42373760] PRIMARY KEY CLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_user_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_user_isDeleted]  DEFAULT ((0)) FOR [isDeleted]
GO
ALTER TABLE [dbo].[document]  WITH CHECK ADD  CONSTRAINT [FK_document_user] FOREIGN KEY([userUsername])
REFERENCES [dbo].[user] ([username])
GO
ALTER TABLE [dbo].[document] CHECK CONSTRAINT [FK_document_user]
GO
ALTER TABLE [dbo].[document_history]  WITH CHECK ADD  CONSTRAINT [FK_4a9486398505240b92812660f7f] FOREIGN KEY([documentId])
REFERENCES [dbo].[document] ([id])
GO
ALTER TABLE [dbo].[document_history] CHECK CONSTRAINT [FK_4a9486398505240b92812660f7f]
GO
ALTER TABLE [dbo].[document_history]  WITH CHECK ADD  CONSTRAINT [FK_document_history_user] FOREIGN KEY([userUsername])
REFERENCES [dbo].[user] ([username])
GO
ALTER TABLE [dbo].[document_history] CHECK CONSTRAINT [FK_document_history_user]
GO
