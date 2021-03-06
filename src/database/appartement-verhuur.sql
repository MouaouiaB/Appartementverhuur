USE master
GO
DROP DATABASE [Prog4-Eindopdracht1]
GO

CREATE DATABASE [Prog4-Eindopdracht1]
GO

USE [Prog4-Eindopdracht1]
GO
/****** Object:  Table [dbo].[Apartment]    Script Date: 9-5-2019 13:55:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT *
FROM sys.objects
WHERE object_id = OBJECT_ID(N'[dbo].[Apartment]') AND type in (N'U'))
BEGIN
	CREATE TABLE [dbo].[Apartment]
	(
		[ApartmentId] [int] IDENTITY(1,1) NOT NULL,
		[Description] [nvarchar](255) NULL,
		[StreetAddress] [nvarchar](255) NOT NULL,
		[PostalCode] [nvarchar](255) NOT NULL,
		[City] [nvarchar](255) NOT NULL,
		[UserId] [int] NOT NULL,
		CONSTRAINT [PK_Apartment] PRIMARY KEY CLUSTERED
(
	[ApartmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[DBUser]    Script Date: 9-5-2019 13:55:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT *
FROM sys.objects
WHERE object_id = OBJECT_ID(N'[dbo].[DBUser]') AND type in (N'U'))
BEGIN
	CREATE TABLE [dbo].[DBUser]
	(
		[UserId] [int] IDENTITY(1,1) NOT NULL,
		[FirstName] [nvarchar](50) NOT NULL,
		[LastName] [nvarchar](50) NOT NULL,
		[StreetAddress] [nvarchar](255) NOT NULL,
		[PostalCode] [nvarchar](50) NOT NULL,
		[City] [nvarchar](2550) NOT NULL,
		[DateOfBirth] [date] NOT NULL,
		[PhoneNumber] [nvarchar](50) NOT NULL,
		[EmailAddress] [nvarchar](255) NOT NULL,
		[Password] [nvarchar](255) NOT NULL,
		CONSTRAINT [PK_DBUser] PRIMARY KEY CLUSTERED
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[Reservation]    Script Date: 9-5-2019 13:55:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT *
FROM sys.objects
WHERE object_id = OBJECT_ID(N'[dbo].[Reservation]') AND type in (N'U'))
BEGIN
	CREATE TABLE [dbo].[Reservation]
	(
		[ReservationId] [int] IDENTITY(1,1) NOT NULL,
		[ApartmentId] [int] NOT NULL,
		[StartDate] [date] NOT NULL,
		[EndDate] [date] NOT NULL,
		[Status] [varchar](10) NOT NULL,
		[UserId] [int] NOT NULL,
		CONSTRAINT [PK_Reservation] PRIMARY KEY CLUSTERED
(
	[ReservationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]
END
GO
SET IDENTITY_INSERT [dbo].[Apartment] ON
GO
INSERT [dbo].[Apartment]
	([ApartmentId], [Description], [StreetAddress], [PostalCode], [City], [UserId])
VALUES
	(1, N'Avans Hogeschool', N'Lovensdijkstraat 61', N'4800 RA', N'Breda', 1)
GO
SET IDENTITY_INSERT [dbo].[Apartment] OFF
GO
SET IDENTITY_INSERT [dbo].[DBUser] ON
GO
INSERT [dbo].[DBUser]
	([UserId], [FirstName], [LastName], [StreetAddress], [PostalCode], [City], [DateOfBirth], [PhoneNumber], [EmailAddress], [Password])
VALUES
	(1, N'Pieter', N'Hansen', N'Hogeschoollaan 1', N'4800 RA', N'Breda', CAST(N'2000-01-01' AS Date), N'0612345678', N'p.hansen@avans.nl', N'secret')
GO
SET IDENTITY_INSERT [dbo].[DBUser] OFF
GO
SET IDENTITY_INSERT [dbo].[Reservation] ON
GO
INSERT [dbo].[Reservation]
	([ReservationId], [ApartmentId], [StartDate], [EndDate], [Status], [UserId])
VALUES
	(1, 1, CAST(N'2019-05-10' AS Date), CAST(N'2019-05-12' AS Date), N'INITIAL', 1)
GO
INSERT [dbo].[Reservation]
	([ReservationId], [ApartmentId], [StartDate], [EndDate], [Status], [UserId])
VALUES
	(3, 1, CAST(N'2019-05-15' AS Date), CAST(N'2019-05-17' AS Date), N'ACCEPTED', 1)
GO
SET IDENTITY_INSERT [dbo].[Reservation] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__DBUser__49A14740EC9E4E98]    Script Date: 9-5-2019 13:55:55 ******/
IF NOT EXISTS (SELECT *
FROM sys.indexes
WHERE object_id = OBJECT_ID(N'[dbo].[DBUser]') AND name = N'UQ__DBUser__49A14740EC9E4E98')
ALTER TABLE [dbo].[DBUser] ADD UNIQUE NONCLUSTERED
(
	[EmailAddress] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
IF NOT EXISTS (SELECT *
FROM sys.foreign_keys
WHERE object_id = OBJECT_ID(N'[dbo].[FK_Apartment_User]') AND parent_object_id = OBJECT_ID(N'[dbo].[Apartment]'))
ALTER TABLE [dbo].[Apartment]  WITH CHECK ADD  CONSTRAINT [FK_Apartment_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[DBUser] ([UserId])
GO
IF  EXISTS (SELECT *
FROM sys.foreign_keys
WHERE object_id = OBJECT_ID(N'[dbo].[FK_Apartment_User]') AND parent_object_id = OBJECT_ID(N'[dbo].[Apartment]'))
ALTER TABLE [dbo].[Apartment] CHECK CONSTRAINT [FK_Apartment_User]
GO
IF NOT EXISTS (SELECT *
FROM sys.foreign_keys
WHERE object_id = OBJECT_ID(N'[dbo].[FK_Reservation_Apartment]') AND parent_object_id = OBJECT_ID(N'[dbo].[Reservation]'))
ALTER TABLE [dbo].[Reservation]  WITH CHECK ADD  CONSTRAINT [FK_Reservation_Apartment] FOREIGN KEY([ApartmentId])
REFERENCES [dbo].[Apartment] ([ApartmentId])
GO
IF  EXISTS (SELECT *
FROM sys.foreign_keys
WHERE object_id = OBJECT_ID(N'[dbo].[FK_Reservation_Apartment]') AND parent_object_id = OBJECT_ID(N'[dbo].[Reservation]'))
ALTER TABLE [dbo].[Reservation] CHECK CONSTRAINT [FK_Reservation_Apartment]
GO
IF NOT EXISTS (SELECT *
FROM sys.foreign_keys
WHERE object_id = OBJECT_ID(N'[dbo].[FK_Reservation_DBUser]') AND parent_object_id = OBJECT_ID(N'[dbo].[Reservation]'))
ALTER TABLE [dbo].[Reservation]  WITH CHECK ADD  CONSTRAINT [FK_Reservation_DBUser] FOREIGN KEY([UserId])
REFERENCES [dbo].[DBUser] ([UserId])
GO
IF  EXISTS (SELECT *
FROM sys.foreign_keys
WHERE object_id = OBJECT_ID(N'[dbo].[FK_Reservation_DBUser]') AND parent_object_id = OBJECT_ID(N'[dbo].[Reservation]'))
ALTER TABLE [dbo].[Reservation] CHECK CONSTRAINT [FK_Reservation_DBUser]
GO
IF NOT EXISTS (SELECT *
FROM sys.check_constraints
WHERE object_id = OBJECT_ID(N'[dbo].[CK__Reservati__Statu__5165187F]') AND parent_object_id = OBJECT_ID(N'[dbo].[Reservation]'))
ALTER TABLE [dbo].[Reservation]  WITH CHECK ADD  CONSTRAINT [CK__Reservati__Statu__5165187F] CHECK  (([Status]='NOT-ACCEPTED' OR [Status]='ACCEPTED' OR [Status]='INITIAL'))
GO
IF  EXISTS (SELECT *
FROM sys.check_constraints
WHERE object_id = OBJECT_ID(N'[dbo].[CK__Reservati__Statu__5165187F]') AND parent_object_id = OBJECT_ID(N'[dbo].[Reservation]'))
ALTER TABLE [dbo].[Reservation] CHECK CONSTRAINT [CK__Reservati__Statu__5165187F]
GO

-- Query
select a.*, u.firstname, u.lastname, r.startdate, r.enddate, r.status
from apartment as a
	join dbuser as u on u.userid = a.userid
	join reservation as r on r.apartmentid = a.apartmentid