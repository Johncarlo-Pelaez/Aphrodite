/****** Object:  Table [dbo].[document]    Script Date: 11/11/2021 9:16:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[document](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[uuid] [uniqueidentifier] NOT NULL,
	[userId] [int] NOT NULL,
	[documentName] [nvarchar](255) NOT NULL,
	[documentSize] [int] NOT NULL,
	[description] [nvarchar](500) NOT NULL,
	[modifiedDate] [datetime] NOT NULL,
	[modifiedBy] [int] NOT NULL,
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
 CONSTRAINT [PK_document] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[document_history]    Script Date: 11/11/2021 9:16:52 PM ******/
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
	[userId] [int] NOT NULL,
 CONSTRAINT [PK_0783dd4cd636039459ee63c9a8b] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[nomen_clature]    Script Date: 11/11/2021 9:16:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[nomen_clature](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[description] [nvarchar](255) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user]    Script Date: 11/11/2021 9:16:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[email] [nvarchar](255) NOT NULL,
	[firstName] [nvarchar](255) NULL,
	[lastName] [nvarchar](255) NULL,
	[role] [nvarchar](50) NOT NULL,
	[createdDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[isDeleted] [bit] NOT NULL,
	[modifiedDate] [datetime] NULL,
 CONSTRAINT [PK_cace4a159ff9f2512dd42373760] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_user_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_user_isDeleted]  DEFAULT ((0)) FOR [isDeleted]
GO
ALTER TABLE [dbo].[document]  WITH CHECK ADD  CONSTRAINT [FK_7424ddcbdf1e9b067669eb0d3fd] FOREIGN KEY([userId])
REFERENCES [dbo].[user] ([id])
GO
ALTER TABLE [dbo].[document] CHECK CONSTRAINT [FK_7424ddcbdf1e9b067669eb0d3fd]
GO
ALTER TABLE [dbo].[document_history]  WITH CHECK ADD  CONSTRAINT [FK_3c5d2cf18513d9baa390fdf3260] FOREIGN KEY([userId])
REFERENCES [dbo].[user] ([id])
GO
ALTER TABLE [dbo].[document_history] CHECK CONSTRAINT [FK_3c5d2cf18513d9baa390fdf3260]
GO
ALTER TABLE [dbo].[document_history]  WITH CHECK ADD  CONSTRAINT [FK_4a9486398505240b92812660f7f] FOREIGN KEY([documentId])
REFERENCES [dbo].[document] ([id])
GO
ALTER TABLE [dbo].[document_history] CHECK CONSTRAINT [FK_4a9486398505240b92812660f7f]
GO
