USE [master]
GO
/****** Object:  Database [AluminumProduction]    Script Date: 8/29/2026 10:48:46 PM ******/
CREATE DATABASE [AluminumProduction]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'AluminumProduction', FILENAME = N'C:\Users\VICTUS\AluminumProduction.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'AluminumProduction_log', FILENAME = N'C:\Users\VICTUS\AluminumProduction_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [AluminumProduction] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [AluminumProduction].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [AluminumProduction] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [AluminumProduction] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [AluminumProduction] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [AluminumProduction] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [AluminumProduction] SET ARITHABORT OFF 
GO
ALTER DATABASE [AluminumProduction] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [AluminumProduction] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [AluminumProduction] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [AluminumProduction] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [AluminumProduction] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [AluminumProduction] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [AluminumProduction] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [AluminumProduction] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [AluminumProduction] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [AluminumProduction] SET  ENABLE_BROKER 
GO
ALTER DATABASE [AluminumProduction] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [AluminumProduction] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [AluminumProduction] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [AluminumProduction] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [AluminumProduction] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [AluminumProduction] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [AluminumProduction] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [AluminumProduction] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [AluminumProduction] SET  MULTI_USER 
GO
ALTER DATABASE [AluminumProduction] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [AluminumProduction] SET DB_CHAINING OFF 
GO
ALTER DATABASE [AluminumProduction] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [AluminumProduction] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [AluminumProduction] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [AluminumProduction] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [AluminumProduction] SET QUERY_STORE = OFF
GO
USE [AluminumProduction]
GO
/****** Object:  UserDefinedTableType [dbo].[PermissionTableType]    Script Date: 8/29/2026 10:48:46 PM ******/
CREATE TYPE [dbo].[PermissionTableType] AS TABLE(
	[PermissionID] [int] NOT NULL
)
GO
/****** Object:  Table [dbo].[Permissions]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Permissions](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](100) NOT NULL,
	[Name] [nvarchar](150) NOT NULL,
	[ModuleName] [nvarchar](100) NOT NULL,
	[ActionName] [nvarchar](100) NOT NULL,
	[BitIndex] [int] NOT NULL,
	[BitValue] [bigint] NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductionOrders]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductionOrders](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ProductID] [int] NOT NULL,
	[ProductName] [nvarchar](100) NOT NULL,
	[RequestedQuantity] [int] NOT NULL,
	[StatusID] [int] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
	[UpdatedAt] [datetime] NULL,
	[Notes] [nvarchar](500) NULL,
 CONSTRAINT [PK_ProductionOrders] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductionOrderStages]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductionOrderStages](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[OrderID] [int] NOT NULL,
	[StageID] [int] NOT NULL,
	[StatusID] [int] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
 CONSTRAINT [PK_ProductionOrderStages] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductionStageEntries]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductionStageEntries](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[OrderStageID] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[Notes] [nvarchar](500) NULL,
 CONSTRAINT [PK_ProductionStageEntries] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductionStages]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductionStages](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[StageName] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](300) NULL,
	[DisplayOrder] [int] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
 CONSTRAINT [PK_ProductionStages] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductionStageWastes]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductionStageWastes](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[StageEntryID] [int] NOT NULL,
	[WasteQuantity] [int] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[Notes] [nvarchar](500) NULL,
	[WasteTypeID] [int] NULL,
	[WasteReasonID] [int] NULL,
 CONSTRAINT [PK_ProductionStageWastes] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Products]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ProductName] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](500) NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
	[UpdatedAt] [datetime] NULL,
 CONSTRAINT [PK_Products] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](300) NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
	[UpdatedAt] [datetime] NULL,
 CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Statuses]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Statuses](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[StatusName] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](200) NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
	[UpdatedAt] [datetime] NULL,
 CONSTRAINT [PK_Statuses] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [nvarchar](100) NOT NULL,
	[PasswordHash] [nvarchar](500) NOT NULL,
	[FullName] [nvarchar](150) NOT NULL,
	[Email] [nvarchar](150) NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
	[UpdatedAt] [datetime] NULL,
	[RoleID] [int] NOT NULL,
	[PermissionMask] [bigint] NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WasteReasons]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WasteReasons](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[NameAr] [nvarchar](150) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
 CONSTRAINT [PK__WasteRea__3214EC2793AD5C12] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WasteTypes]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WasteTypes](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[NameAr] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
 CONSTRAINT [PK__WasteTyp__3214EC277863F41A] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Permissions] ON 

INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (33, N'Users.Create', N'Create User', N'Users', N'Create', 0, 1, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (34, N'Users.View', N'View Users', N'Users', N'View', 1, 2, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (35, N'Roles.Create', N'Create Role', N'Roles', N'Create', 2, 4, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (36, N'Roles.View', N'View Roles', N'Roles', N'View', 3, 8, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (37, N'Roles.Edit', N'Edit Role', N'Roles', N'Edit', 4, 16, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (38, N'Permissions.Create', N'Create Permission', N'Permissions', N'Create', 5, 32, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (39, N'Permissions.View', N'View Permissions', N'Permissions', N'View', 6, 64, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (40, N'Permissions.Edit', N'Edit Permission', N'Permissions', N'Edit', 7, 128, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (41, N'Products.Create', N'Create Product', N'Products', N'Create', 8, 256, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (42, N'Products.View', N'View Products', N'Products', N'View', 9, 512, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (43, N'Products.Edit', N'Edit Product', N'Products', N'Edit', 10, 1024, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (44, N'ProductionOrders.Create', N'Create Production Order', N'ProductionOrders', N'Create', 11, 2048, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (45, N'ProductionOrders.View', N'View Production Orders', N'ProductionOrders', N'View', 12, 4096, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (46, N'ProductionOrders.Edit', N'Edit Production Order', N'ProductionOrders', N'Edit', 13, 8192, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (47, N'ProductionOrders.Delete', N'Delete Production Order', N'ProductionOrders', N'Delete', 14, 16384, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (48, N'ProductionOrderStages.Create', N'Create Production Order Stage', N'ProductionOrderStages', N'Create', 15, 32768, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (49, N'ProductionOrderStages.View', N'View Production Order Stages', N'ProductionOrderStages', N'View', 16, 65536, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (50, N'ProductionOrderStages.Edit', N'Edit Production Order Stage', N'ProductionOrderStages', N'Edit', 17, 131072, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (51, N'ProductionStageEntries.Create', N'Create Production Stage Entry', N'ProductionStageEntries', N'Create', 18, 262144, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (52, N'ProductionStageEntries.View', N'View Production Stage Entries', N'ProductionStageEntries', N'View', 19, 524288, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (53, N'ProductionStageEntries.Edit', N'Edit Production Stage Entry', N'ProductionStageEntries', N'Edit', 20, 1048576, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (54, N'ProductionStageEntries.Delete', N'Delete Production Stage Entry', N'ProductionStageEntries', N'Delete', 21, 2097152, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (55, N'ProductionStages.Create', N'Create Production Stage', N'ProductionStages', N'Create', 22, 4194304, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (56, N'ProductionStages.View', N'View Production Stages', N'ProductionStages', N'View', 23, 8388608, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (57, N'ProductionStages.Edit', N'Edit Production Stage', N'ProductionStages', N'Edit', 24, 16777216, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (58, N'ProductionStageWastes.Create', N'Create Production Stage Waste', N'ProductionStageWastes', N'Create', 25, 33554432, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (59, N'ProductionStageWastes.View', N'View Production Stage Wastes', N'ProductionStageWastes', N'View', 26, 67108864, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (60, N'ProductionStageWastes.Edit', N'Edit Production Stage Waste', N'ProductionStageWastes', N'Edit', 27, 134217728, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (61, N'ProductionStageWastes.Delete', N'Delete Production Stage Waste', N'ProductionStageWastes', N'Delete', 28, 268435456, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (62, N'Statuses.Create', N'Create Status', N'Statuses', N'Create', 29, 536870912, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (63, N'Statuses.View', N'View Statuses', N'Statuses', N'View', 30, 1073741824, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (64, N'Statuses.Edit', N'Edit Status', N'Statuses', N'Edit', 31, 2147483648, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (65, N'WasteTypes.Create', N'Create Waste Type', N'WasteTypes', N'Create', 32, 4294967296, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (66, N'WasteTypes.View', N'View Waste Types', N'WasteTypes', N'View', 33, 8589934592, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (67, N'WasteTypes.Edit', N'Edit Waste Type', N'WasteTypes', N'Edit', 34, 17179869184, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (68, N'WasteReasons.Create', N'Create Waste Reason', N'WasteReasons', N'Create', 35, 34359738368, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (69, N'WasteReasons.View', N'View Waste Reasons', N'WasteReasons', N'View', 36, 68719476736, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (70, N'WasteReasons.Edit', N'Edit Waste Reason', N'WasteReasons', N'Edit', 37, 137438953472, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (71, N'Reports.Orders', N'View Orders Report', N'Reports', N'View', 38, 274877906944, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (72, N'Reports.CancelledOrders', N'View Cancelled Orders Report', N'Reports', N'View', 39, 549755813888, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (73, N'Reports.ProductComparison', N'View Product Comparison Report', N'Reports', N'View', 40, 1099511627776, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (74, N'Reports.ProductionSummary', N'View Production Summary Report', N'Reports', N'View', 41, 2199023255552, 1)
INSERT [dbo].[Permissions] ([ID], [Code], [Name], [ModuleName], [ActionName], [BitIndex], [BitValue], [IsActive]) VALUES (75, N'Reports.ProductProduction', N'View Product Production Report', N'Reports', N'View', 42, 4398046511104, 1)
SET IDENTITY_INSERT [dbo].[Permissions] OFF
GO
SET IDENTITY_INSERT [dbo].[ProductionStages] ON 

INSERT [dbo].[ProductionStages] ([ID], [StageName], [Description], [DisplayOrder], [IsActive], [CreatedAt]) VALUES (1, N'القص', N'قص وتجهيز القطع حسب المقاسات والكميات المطلوبة.', 1, 1, CAST(N'2026-08-26T17:04:36.040' AS DateTime))
INSERT [dbo].[ProductionStages] ([ID], [StageName], [Description], [DisplayOrder], [IsActive], [CreatedAt]) VALUES (2, N'التلوين', N'تلوين القطع حسب اللون والمواصفات المطلوبة.', 2, 1, CAST(N'2026-08-26T17:04:55.143' AS DateTime))
INSERT [dbo].[ProductionStages] ([ID], [StageName], [Description], [DisplayOrder], [IsActive], [CreatedAt]) VALUES (3, N'التعبئة والتغليف', N'تغليف وتجهيز المنتجات النهائية للتسليم أو التخزين.', 3, 1, CAST(N'2026-08-26T17:05:24.637' AS DateTime))
SET IDENTITY_INSERT [dbo].[ProductionStages] OFF
GO
SET IDENTITY_INSERT [dbo].[Products] ON 

INSERT [dbo].[Products] ([ID], [ProductName], [Description], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (1, N'مفصلة عريضة', N'مفصلة ألمنيوم عريضة', 1, CAST(N'2026-08-26T17:06:39.320' AS DateTime), NULL)
INSERT [dbo].[Products] ([ID], [ProductName], [Description], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (2, N'مفصلة ضيقة', N'مفصلة ألمنيوم ضيقة', 1, CAST(N'2026-08-26T17:06:39.320' AS DateTime), NULL)
INSERT [dbo].[Products] ([ID], [ProductName], [Description], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (3, N'زاوية', N'زاوية ألمنيوم', 1, CAST(N'2026-08-26T17:06:39.320' AS DateTime), NULL)
INSERT [dbo].[Products] ([ID], [ProductName], [Description], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (4, N'قفل سافيو', N'قفل سافيو للأبواب', 1, CAST(N'2026-08-26T17:06:39.320' AS DateTime), NULL)
INSERT [dbo].[Products] ([ID], [ProductName], [Description], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (5, N'مسكة باب', N'مسكة ألمنيوم للأبواب', 1, CAST(N'2026-08-26T17:06:39.320' AS DateTime), NULL)
INSERT [dbo].[Products] ([ID], [ProductName], [Description], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (6, N'قفل ضفدع', N'قفل ضفدع للأبواب', 1, CAST(N'2026-08-26T17:06:39.320' AS DateTime), NULL)
SET IDENTITY_INSERT [dbo].[Products] OFF
GO
SET IDENTITY_INSERT [dbo].[Roles] ON 

INSERT [dbo].[Roles] ([ID], [RoleName], [Description], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (1, N'Owner', N'صلاحيات كاملة على جميع أجزاء النظام وإدارة المستخدمين والأدوار والصلاحيات', 1, CAST(N'2026-08-26T17:11:06.573' AS DateTime), NULL)
INSERT [dbo].[Roles] ([ID], [RoleName], [Description], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (2, N'مدير الإنتاج', N'إدارة عمليات الإنتاج والطلبيات والمراحل والتقارير والتحليلات', 1, CAST(N'2026-08-26T17:11:06.573' AS DateTime), NULL)
INSERT [dbo].[Roles] ([ID], [RoleName], [Description], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (3, N'مشرف الإنتاج', N'متابعة وتنفيذ عمليات الإنتاج وتحديث مراحل الطلبيات وتسجيل بيانات الإنتاج والهدر', 1, CAST(N'2026-08-26T17:11:06.573' AS DateTime), NULL)
INSERT [dbo].[Roles] ([ID], [RoleName], [Description], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (4, N'مجلس الإدارة', N'الاطلاع على التقارير والإحصائيات والتحليلات دون صلاحيات تعديل', 1, CAST(N'2026-08-26T17:11:06.573' AS DateTime), NULL)
SET IDENTITY_INSERT [dbo].[Roles] OFF
GO
SET IDENTITY_INSERT [dbo].[Statuses] ON 

INSERT [dbo].[Statuses] ([ID], [StatusName], [Description], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (1, N'قيد الانتظار', N'لم يبدأ تنفيذ الطلب أو المرحلة بعد', 1, CAST(N'2026-08-26T17:06:49.650' AS DateTime), NULL)
INSERT [dbo].[Statuses] ([ID], [StatusName], [Description], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (2, N'قيد التنفيذ', N'الطلب أو المرحلة قيد التنفيذ حاليًا', 1, CAST(N'2026-08-26T17:06:49.650' AS DateTime), NULL)
INSERT [dbo].[Statuses] ([ID], [StatusName], [Description], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (3, N'مكتملة', N'تم تنفيذ الطلب أو المرحلة بالكامل', 1, CAST(N'2026-08-26T17:06:49.650' AS DateTime), NULL)
INSERT [dbo].[Statuses] ([ID], [StatusName], [Description], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (4, N'متوقفة', N'تم إيقاف الطلب أو المرحلة مؤقتًا', 1, CAST(N'2026-08-26T17:06:49.650' AS DateTime), NULL)
INSERT [dbo].[Statuses] ([ID], [StatusName], [Description], [IsActive], [CreatedAt], [UpdatedAt]) VALUES (5, N'ملغاة', N'تم إلغاء الطلب أو المرحلة', 1, CAST(N'2026-08-26T17:06:49.650' AS DateTime), NULL)
SET IDENTITY_INSERT [dbo].[Statuses] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([ID], [UserName], [PasswordHash], [FullName], [Email], [IsActive], [CreatedAt], [UpdatedAt], [RoleID], [PermissionMask]) VALUES (2, N'Owner', N'$2a$11$O/4EXEwctSOjs1OdBwYr7e3RKo.9q1iwdBvJ4Sy5FCGG.d.G9lcmK', N'Owner', N'Owner@gmail.com', 1, CAST(N'2026-08-27T18:34:11.643' AS DateTime), CAST(N'2026-08-27T23:01:54.740' AS DateTime), 1, 8796093022207)
INSERT [dbo].[Users] ([ID], [UserName], [PasswordHash], [FullName], [Email], [IsActive], [CreatedAt], [UpdatedAt], [RoleID], [PermissionMask]) VALUES (3, N'Ahmad', N'$2a$11$QolC3YoczLn9gvPoh9x8q.gcb6H/vuUYa7TqA6hUn9vTjdMKCFlEW', N'Ahmad', N'ProductionManager@gmail.com', 1, CAST(N'2026-08-27T21:04:52.187' AS DateTime), NULL, 2, 8796093021980)
INSERT [dbo].[Users] ([ID], [UserName], [PasswordHash], [FullName], [Email], [IsActive], [CreatedAt], [UpdatedAt], [RoleID], [PermissionMask]) VALUES (4, N'Malik', N'$2a$11$laYU8.v3Ux5bENFKup8T3OeWy7Da07Oig4nNgsTMJ/UP0NZ9.pzIe', N'Malik', N'ProductionSupervisor@gmail.com', 1, CAST(N'2026-08-27T21:07:47.650' AS DateTime), NULL, 3, 8796093021980)
INSERT [dbo].[Users] ([ID], [UserName], [PasswordHash], [FullName], [Email], [IsActive], [CreatedAt], [UpdatedAt], [RoleID], [PermissionMask]) VALUES (5, N'Mohammed', N'$2a$11$4hezSeJ9QhInWuO3/vDoe.nsyj3Onuni82GChlN5w1I/0FUGEf.r6', N'Mohammed Ma', N'BoardDirectors@gmail.com', 1, CAST(N'2026-08-27T21:12:41.857' AS DateTime), NULL, 4, 8599674360328)
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
SET IDENTITY_INSERT [dbo].[WasteReasons] ON 

INSERT [dbo].[WasteReasons] ([ID], [NameAr], [IsActive], [CreatedAt]) VALUES (1, N'خطأ تشغيل', 1, CAST(N'2026-08-26T17:09:24.050' AS DateTime))
INSERT [dbo].[WasteReasons] ([ID], [NameAr], [IsActive], [CreatedAt]) VALUES (2, N'عيب في الخامة', 1, CAST(N'2026-08-26T17:09:24.050' AS DateTime))
INSERT [dbo].[WasteReasons] ([ID], [NameAr], [IsActive], [CreatedAt]) VALUES (3, N'خلل في الماكينة', 1, CAST(N'2026-08-26T17:09:24.050' AS DateTime))
INSERT [dbo].[WasteReasons] ([ID], [NameAr], [IsActive], [CreatedAt]) VALUES (4, N'سوء تخزين', 1, CAST(N'2026-08-26T17:09:24.050' AS DateTime))
INSERT [dbo].[WasteReasons] ([ID], [NameAr], [IsActive], [CreatedAt]) VALUES (5, N'غير مصنف', 1, CAST(N'2026-08-26T17:09:24.050' AS DateTime))
SET IDENTITY_INSERT [dbo].[WasteReasons] OFF
GO
SET IDENTITY_INSERT [dbo].[WasteTypes] ON 

INSERT [dbo].[WasteTypes] ([ID], [NameAr], [IsActive], [CreatedAt]) VALUES (1, N'خردة معدنية', 1, CAST(N'2026-08-26T17:08:39.343' AS DateTime))
INSERT [dbo].[WasteTypes] ([ID], [NameAr], [IsActive], [CreatedAt]) VALUES (2, N'هدر تصنيع', 1, CAST(N'2026-08-26T17:08:39.343' AS DateTime))
INSERT [dbo].[WasteTypes] ([ID], [NameAr], [IsActive], [CreatedAt]) VALUES (3, N'هدر تلوين', 1, CAST(N'2026-08-26T17:08:39.343' AS DateTime))
INSERT [dbo].[WasteTypes] ([ID], [NameAr], [IsActive], [CreatedAt]) VALUES (4, N'غير مصنف', 1, CAST(N'2026-08-26T17:08:39.343' AS DateTime))
SET IDENTITY_INSERT [dbo].[WasteTypes] OFF
GO
/****** Object:  Index [UQ_ProductionOrderStages_Order_Stage]    Script Date: 8/29/2026 10:48:46 PM ******/
ALTER TABLE [dbo].[ProductionOrderStages] ADD  CONSTRAINT [UQ_ProductionOrderStages_Order_Stage] UNIQUE NONCLUSTERED 
(
	[OrderID] ASC,
	[StageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_ProductionStages_DisplayOrder]    Script Date: 8/29/2026 10:48:46 PM ******/
ALTER TABLE [dbo].[ProductionStages] ADD  CONSTRAINT [UQ_ProductionStages_DisplayOrder] UNIQUE NONCLUSTERED 
(
	[DisplayOrder] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_ProductionStages_Name]    Script Date: 8/29/2026 10:48:46 PM ******/
ALTER TABLE [dbo].[ProductionStages] ADD  CONSTRAINT [UQ_ProductionStages_Name] UNIQUE NONCLUSTERED 
(
	[StageName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_Products_Name]    Script Date: 8/29/2026 10:48:46 PM ******/
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [UQ_Products_Name] UNIQUE NONCLUSTERED 
(
	[ProductName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_Roles_Name]    Script Date: 8/29/2026 10:48:46 PM ******/
ALTER TABLE [dbo].[Roles] ADD  CONSTRAINT [UQ_Roles_Name] UNIQUE NONCLUSTERED 
(
	[RoleName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_Statuses_Name]    Script Date: 8/29/2026 10:48:46 PM ******/
ALTER TABLE [dbo].[Statuses] ADD  CONSTRAINT [UQ_Statuses_Name] UNIQUE NONCLUSTERED 
(
	[StatusName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_Users_Email]    Script Date: 8/29/2026 10:48:46 PM ******/
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [UQ_Users_Email] UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_Users_UserName]    Script Date: 8/29/2026 10:48:46 PM ******/
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [UQ_Users_UserName] UNIQUE NONCLUSTERED 
(
	[UserName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Permissions] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[ProductionOrders] ADD  CONSTRAINT [DF_ProductionOrders_CreatedAt]  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[ProductionOrderStages] ADD  CONSTRAINT [DF_ProductionOrderStages_CreatedAt]  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[ProductionStages] ADD  CONSTRAINT [DF_ProductionStages_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[ProductionStages] ADD  CONSTRAINT [DF_ProductionStages_CreatedAt]  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[ProductionStageWastes] ADD  CONSTRAINT [DF_ProductionStageWastes_CreatedAt]  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF_Products_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF_Products_CreatedAt]  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Roles] ADD  CONSTRAINT [DF_Roles_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Roles] ADD  CONSTRAINT [DF_Roles_CreatedAt]  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Statuses] ADD  CONSTRAINT [DF_Statuses_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Statuses] ADD  CONSTRAINT [DF_Statuses_CreatedAt]  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_CreatedAt]  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [PermissionMask]
GO
ALTER TABLE [dbo].[WasteReasons] ADD  CONSTRAINT [DF__WasteReas__IsAct__47A6A41B]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[WasteReasons] ADD  CONSTRAINT [DF__WasteReas__Creat__489AC854]  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[WasteTypes] ADD  CONSTRAINT [DF__WasteType__IsAct__43D61337]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[WasteTypes] ADD  CONSTRAINT [DF__WasteType__Creat__44CA3770]  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[ProductionOrders]  WITH CHECK ADD  CONSTRAINT [FK_ProductionOrders_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([ID])
GO
ALTER TABLE [dbo].[ProductionOrders] CHECK CONSTRAINT [FK_ProductionOrders_CreatedBy]
GO
ALTER TABLE [dbo].[ProductionOrders]  WITH CHECK ADD  CONSTRAINT [FK_ProductionOrders_Products] FOREIGN KEY([ProductID])
REFERENCES [dbo].[Products] ([ID])
GO
ALTER TABLE [dbo].[ProductionOrders] CHECK CONSTRAINT [FK_ProductionOrders_Products]
GO
ALTER TABLE [dbo].[ProductionOrders]  WITH CHECK ADD  CONSTRAINT [FK_ProductionOrders_Statuses] FOREIGN KEY([StatusID])
REFERENCES [dbo].[Statuses] ([ID])
GO
ALTER TABLE [dbo].[ProductionOrders] CHECK CONSTRAINT [FK_ProductionOrders_Statuses]
GO
ALTER TABLE [dbo].[ProductionOrderStages]  WITH CHECK ADD  CONSTRAINT [FK_ProductionOrderStages_Orders] FOREIGN KEY([OrderID])
REFERENCES [dbo].[ProductionOrders] ([ID])
GO
ALTER TABLE [dbo].[ProductionOrderStages] CHECK CONSTRAINT [FK_ProductionOrderStages_Orders]
GO
ALTER TABLE [dbo].[ProductionOrderStages]  WITH CHECK ADD  CONSTRAINT [FK_ProductionOrderStages_Stages] FOREIGN KEY([StageID])
REFERENCES [dbo].[ProductionStages] ([ID])
GO
ALTER TABLE [dbo].[ProductionOrderStages] CHECK CONSTRAINT [FK_ProductionOrderStages_Stages]
GO
ALTER TABLE [dbo].[ProductionOrderStages]  WITH CHECK ADD  CONSTRAINT [FK_ProductionOrderStages_Statuses] FOREIGN KEY([StatusID])
REFERENCES [dbo].[Statuses] ([ID])
GO
ALTER TABLE [dbo].[ProductionOrderStages] CHECK CONSTRAINT [FK_ProductionOrderStages_Statuses]
GO
ALTER TABLE [dbo].[ProductionStageEntries]  WITH CHECK ADD  CONSTRAINT [FK_ProductionStageEntries_Users] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([ID])
GO
ALTER TABLE [dbo].[ProductionStageEntries] CHECK CONSTRAINT [FK_ProductionStageEntries_Users]
GO
ALTER TABLE [dbo].[ProductionStageWastes]  WITH CHECK ADD  CONSTRAINT [FK_ProductionStageWastes_StageEntries] FOREIGN KEY([StageEntryID])
REFERENCES [dbo].[ProductionStageEntries] ([ID])
GO
ALTER TABLE [dbo].[ProductionStageWastes] CHECK CONSTRAINT [FK_ProductionStageWastes_StageEntries]
GO
ALTER TABLE [dbo].[ProductionStageWastes]  WITH CHECK ADD  CONSTRAINT [FK_ProductionStageWastes_Users] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([ID])
GO
ALTER TABLE [dbo].[ProductionStageWastes] CHECK CONSTRAINT [FK_ProductionStageWastes_Users]
GO
ALTER TABLE [dbo].[ProductionStageWastes]  WITH CHECK ADD  CONSTRAINT [FK_ProductionStageWastes_WasteReasons] FOREIGN KEY([WasteReasonID])
REFERENCES [dbo].[WasteReasons] ([ID])
GO
ALTER TABLE [dbo].[ProductionStageWastes] CHECK CONSTRAINT [FK_ProductionStageWastes_WasteReasons]
GO
ALTER TABLE [dbo].[ProductionStageWastes]  WITH CHECK ADD  CONSTRAINT [FK_ProductionStageWastes_WasteTypes] FOREIGN KEY([WasteTypeID])
REFERENCES [dbo].[WasteTypes] ([ID])
GO
ALTER TABLE [dbo].[ProductionStageWastes] CHECK CONSTRAINT [FK_ProductionStageWastes_WasteTypes]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Roles] FOREIGN KEY([RoleID])
REFERENCES [dbo].[Roles] ([ID])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Roles]
GO
ALTER TABLE [dbo].[ProductionOrders]  WITH CHECK ADD  CONSTRAINT [CK_ProductionOrders_RequestedQuantity] CHECK  (([RequestedQuantity]>(0)))
GO
ALTER TABLE [dbo].[ProductionOrders] CHECK CONSTRAINT [CK_ProductionOrders_RequestedQuantity]
GO
ALTER TABLE [dbo].[ProductionOrderStages]  WITH CHECK ADD  CONSTRAINT [CK_ProductionOrderStages_StatusID_Limited] CHECK  (([StatusID]=(3) OR [StatusID]=(2) OR [StatusID]=(1)))
GO
ALTER TABLE [dbo].[ProductionOrderStages] CHECK CONSTRAINT [CK_ProductionOrderStages_StatusID_Limited]
GO
ALTER TABLE [dbo].[ProductionStageWastes]  WITH CHECK ADD  CONSTRAINT [CK_ProductionStageWastes_Quantity] CHECK  (([WasteQuantity]>(0)))
GO
ALTER TABLE [dbo].[ProductionStageWastes] CHECK CONSTRAINT [CK_ProductionStageWastes_Quantity]
GO
/****** Object:  StoredProcedure [dbo].[SP_AddPermissions]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
====================================================================
  ملف الإصلاحات - Stored Procedures
  يحتوي فقط على الإجراءات التي تحتاج تعديل:
    1) ترجمة كل الرسائل الإنجليزية إلى العربية
    2) إضافة الفاليديشن الناقص
    3) تصحيح نوع @Message من VARCHAR إلى NVARCHAR
       (لأن VARCHAR سيؤدي لتلف النص العربي "?????")
  تم استخدام CREATE OR ALTER لتفادي أي خطأ إذا كان الإجراء موجود
  أو غير موجود مسبقًا.
====================================================================
*/

/* ================================================================
   1) SP_AddPermissions
   التعديل: ترجمة كل رسائل الفاليديشن للعربية (كانت بالإنجليزي)
   ================================================================ */
CREATE   PROCEDURE [dbo].[SP_AddPermissions]
    @Code nvarchar(MAX),
    @Name nvarchar(MAX),
    @ModuleName nvarchar(MAX),
    @ActionName nvarchar(MAX),
    @BitIndex int,
    @BitValue bigint,
    @NewID INT OUTPUT,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @Code IS NULL OR LTRIM(RTRIM(@Code)) = ''
        BEGIN
            SET @NewID = -1; SET @Message = N'الكود مطلوب.'; SET @ErrorType = 1; RETURN;
        END
        IF @Name IS NULL OR LTRIM(RTRIM(@Name)) = ''
        BEGIN
            SET @NewID = -1; SET @Message = N'الاسم مطلوب.'; SET @ErrorType = 1; RETURN;
        END
        IF @ModuleName IS NULL OR LTRIM(RTRIM(@ModuleName)) = ''
        BEGIN
            SET @NewID = -1; SET @Message = N'اسم الوحدة (ModuleName) مطلوب.'; SET @ErrorType = 1; RETURN;
        END
        IF @ActionName IS NULL OR LTRIM(RTRIM(@ActionName)) = ''
        BEGIN
            SET @NewID = -1; SET @Message = N'اسم الإجراء (ActionName) مطلوب.'; SET @ErrorType = 1; RETURN;
        END
        IF @BitIndex IS NULL OR @BitIndex < 0
        BEGIN
            SET @NewID = -1; SET @Message = N'قيمة BitIndex يجب أن تكون صفر أو أكبر.'; SET @ErrorType = 1; RETURN;
        END
        -- ***** فاليديشن مضاف: BitValue مطلوب ويجب أن يكون أكبر من صفر *****
        IF @BitValue IS NULL OR @BitValue <= 0
        BEGIN
            SET @NewID = -1; SET @Message = N'قيمة BitValue مطلوبة ويجب أن تكون أكبر من صفر.'; SET @ErrorType = 1; RETURN;
        END
        IF EXISTS (SELECT 1 FROM Permissions WHERE Code = @Code COLLATE SQL_Latin1_General_CP1_CI_AS)
        BEGIN
            SET @NewID = -1; SET @Message = N'هذا الكود مستخدم مسبقًا.'; SET @ErrorType = 3; RETURN;
        END
        -- ***** فاليديشن مضاف: منع تكرار نفس BitIndex ضمن نفس الوحدة (ModuleName) *****
        IF EXISTS (
            SELECT 1 FROM Permissions
            WHERE BitIndex = @BitIndex
              AND ModuleName = @ModuleName COLLATE SQL_Latin1_General_CP1_CI_AS
        )
        BEGIN
            SET @NewID = -1; SET @Message = N'قيمة BitIndex مستخدمة مسبقًا لهذه الوحدة (ModuleName).'; SET @ErrorType = 3; RETURN;
        END

        INSERT INTO Permissions (Code, Name, ModuleName, ActionName, BitIndex, BitValue,  IsActive)
        VALUES (@Code, @Name, @ModuleName, @ActionName, @BitIndex, @BitValue,  1);

        SET @NewID = SCOPE_IDENTITY();
        SET @Message = N'تمت إضافة الصلاحية بنجاح.';
        SET @ErrorType = 0;
    END TRY
    BEGIN CATCH
        SET @NewID = -1; SET @Message = ERROR_MESSAGE(); SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddProductionOrders]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[SP_AddProductionOrders]
     @ProductID int,
     @RequestedQuantity int,
     @StatusID int,
     @Email nvarchar(MAX),
     @Notes nvarchar(MAX),
     @NewID INT OUTPUT,
     @Message NVARCHAR(250) OUTPUT,
     @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        SET @NewID = -1;
        SET @Message = NULL;
        SET @ErrorType = 0;

        IF @ProductID IS NULL OR @ProductID <= 0
        BEGIN
            SET @Message = N'رقم المنتج مطلوب ويجب أن يكون أكبر من صفر.';
            SET @ErrorType = 1;
            RETURN;
        END

        IF @RequestedQuantity IS NULL OR @RequestedQuantity <= 0
        BEGIN
            SET @Message = N'الكمية المطلوبة يجب أن تكون أكبر من صفر.';
            SET @ErrorType = 1;
            RETURN;
        END

        IF NULLIF(LTRIM(RTRIM(@Email)), '') IS NULL
        BEGIN
            SET @Message = N'البريد الإلكتروني مطلوب.';
            SET @ErrorType = 1;
            RETURN;
        END

        IF NOT EXISTS (
            SELECT 1
            FROM Products
            WHERE ID = @ProductID
              AND IsActive = 1
        )
        BEGIN
            SET @Message = N'المنتج غير موجود أو غير فعال.';
            SET @ErrorType = 3;
            RETURN;
        END

        IF NOT EXISTS (
            SELECT 1
            FROM Statuses
            WHERE ID = @StatusID
              AND IsActive = 1
        )
        BEGIN
            SET @Message = N'حالة الطلبية غير موجودة أو غير فعالة.';
            SET @ErrorType = 3;
            RETURN;
        END

        IF NOT EXISTS (
            SELECT 1
            FROM Users
            WHERE Email = @Email
              AND IsActive = 1
        )
        BEGIN
            SET @Message = N'المستخدم غير موجود أو غير فعال.';
            SET @ErrorType = 3;
            RETURN;
        END

        INSERT INTO ProductionOrders
        (
            ProductID,
            ProductName,
            RequestedQuantity,
            StatusID,
            CreatedBy,
            Notes,
            CreatedAt,
            UpdatedAt
        )
        VALUES
        (
            @ProductID,
            (SELECT ProductName FROM Products WHERE ID = @ProductID),
            @RequestedQuantity,
            @StatusID,
            (SELECT ID FROM Users WHERE Email = @Email AND IsActive = 1),
            @Notes,
            GETDATE(),
            NULL
        );

        SET @NewID = CONVERT(INT, SCOPE_IDENTITY());
        SET @Message = N'تمت إضافة الطلبية بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddProductionOrderStages]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[SP_AddProductionOrderStages]
    @OrderID INT,
	@Email nvarchar(250),
    @NewID INT OUTPUT,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY


	        ---------------------------------------------------------
        -- Get user
        ---------------------------------------------------------

        DECLARE @UserID INT;

        SELECT @UserID = ID
        FROM Users
        WHERE Email = @Email
          AND IsActive = 1;


        IF @UserID IS NULL
        BEGIN
            SET @Message = N'المستخدم غير موجود أو غير فعال.';
            SET @ErrorType = 3;
            RETURN;
        END;


        SET @NewID = -1;
        SET @Message = NULL;
        SET @ErrorType = 0;

        IF NOT EXISTS (
            SELECT 1
            FROM ProductionOrders
            WHERE ID = @OrderID
        )
        BEGIN
            SET @Message = N'الطلبية غير موجودة.';
            SET @ErrorType = 3;
            RETURN;
        END;

        IF EXISTS (
            SELECT 1
            FROM ProductionOrderStages
            WHERE OrderID = @OrderID
        )
        BEGIN
            SET @Message = N'تم إنشاء مراحل الإنتاج لهذه الطلبية مسبقًا.';
            SET @ErrorType = 4;
            RETURN;
        END;

        IF NOT EXISTS (SELECT 1 FROM ProductionStages WHERE DisplayOrder = 1 AND IsActive = 1)
        BEGIN
            SET @Message = N'المرحلة الإنتاجية الأولى غير موجودة أو غير فعالة.';
            SET @ErrorType = 3;
            RETURN;
        END;

        IF NOT EXISTS (SELECT 1 FROM ProductionStages WHERE DisplayOrder = 2 AND IsActive = 1)
        BEGIN
            SET @Message = N'المرحلة الإنتاجية الثانية غير موجودة أو غير فعالة.';
            SET @ErrorType = 3;
            RETURN;
        END;

        IF NOT EXISTS (SELECT 1 FROM ProductionStages WHERE DisplayOrder = 3 AND IsActive = 1)
        BEGIN
            SET @Message = N'المرحلة الإنتاجية الثالثة غير موجودة أو غير فعالة.';
            SET @ErrorType = 3;
            RETURN;
        END;

        IF NOT EXISTS (
            SELECT 1
            FROM Statuses
            WHERE ID = 1
              AND IsActive = 1
        )
        BEGIN
            SET @Message = N'حالة بدء المرحلة (رقم 1) غير موجودة أو غير فعالة.';
            SET @ErrorType = 3;
            RETURN;
        END;

        BEGIN TRANSACTION;

        INSERT INTO ProductionOrderStages
        (
            OrderID,
            StatusID,
            StageID,
            CreatedAt
        )
        VALUES
        (
            @OrderID,
            1,
            (SELECT ID FROM ProductionStages WHERE DisplayOrder = 1),
            GETDATE()
        );

        INSERT INTO ProductionOrderStages
        (
            OrderID,
            StatusID,
            StageID,
            CreatedAt
        )
        VALUES
        (
            @OrderID,
            1,
            (SELECT ID FROM ProductionStages WHERE DisplayOrder = 2),
            GETDATE()
        );

        INSERT INTO ProductionOrderStages
        (
            OrderID,
            StatusID,
            StageID,
            CreatedAt
        )
        VALUES
        (
            @OrderID,
            1,
            (SELECT ID FROM ProductionStages WHERE DisplayOrder = 3),
            GETDATE()
        );

		
		
		UPDATE [dbo].[ProductionOrders]
   SET [ProductID] = ProductID
      ,[ProductName] = ProductName
      ,[RequestedQuantity] = RequestedQuantity
      ,[StatusID] = (select Statuses.ID from Statuses where Statuses.StatusName=N'قيد التنفيذ')
      ,[CreatedBy] = @UserID
      ,[CreatedAt] = CreatedAt
      ,[UpdatedAt] = GETDATE()
      ,[Notes] =Notes	
 WHERE ProductionOrders.ID=@OrderID


        COMMIT TRANSACTION;

        SET @NewID = CONVERT(INT, SCOPE_IDENTITY());
        SET @Message = N'تمت إضافة مراحل الإنتاج للطلبية بنجاح.';
        SET @ErrorType = 0;






    END TRY
    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;

    END CATCH
END


GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* ================================================================
   SP_UpdateUserInfo
   تعديل جزئي لبيانات المستخدم: UserName / FullName / IsActive
   أي باراميتر يوصل NULL = لا يتم تغييره (يبقى كما هو)
   ================================================================ */
CREATE OR ALTER PROCEDURE [dbo].[SP_UpdateUserInfo]
    @ID       INT,
    @UserName NVARCHAR(MAX) = NULL,
    @FullName NVARCHAR(MAX) = NULL,
    @IsActive BIT           = NULL,
    @Message  NVARCHAR(250) OUTPUT,
    @ErrorType INT           OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY

        IF NOT EXISTS (SELECT 1 FROM Users WHERE ID = @ID)
        BEGIN
            SET @Message = N'المستخدم غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        IF @UserName IS NULL AND @FullName IS NULL AND @IsActive IS NULL
        BEGIN
            SET @Message = N'لم يتم تحديد أي حقل للتعديل.';
            SET @ErrorType = 1;
            RETURN;
        END

        IF @UserName IS NOT NULL
        BEGIN
            IF LTRIM(RTRIM(@UserName)) = ''
            BEGIN
                SET @Message = N'اسم المستخدم لا يمكن أن يكون فارغًا.';
                SET @ErrorType = 1;
                RETURN;
            END

            IF EXISTS
            (
                SELECT 1
                FROM Users
                WHERE Username COLLATE SQL_Latin1_General_CP1_CI_AS =
                      @UserName COLLATE SQL_Latin1_General_CP1_CI_AS
                  AND ID <> @ID
            )
            BEGIN
                SET @Message = N'اسم المستخدم هذا مستخدم مسبقًا.';
                SET @ErrorType = 3;
                RETURN;
            END
        END

        IF @FullName IS NOT NULL AND LTRIM(RTRIM(@FullName)) = ''
        BEGIN
            SET @Message = N'الاسم الكامل لا يمكن أن يكون فارغًا.';
            SET @ErrorType = 1;
            RETURN;
        END

        UPDATE Users
        SET
            Username  = ISNULL(@UserName, Username),
            FullName  = ISNULL(@FullName, FullName),
            IsActive  = ISNULL(@IsActive, IsActive),
            UpdatedAt = GETDATE()
        WHERE ID = @ID;

        SET @Message = N'تم تحديث بيانات المستخدم بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;
    END CATCH
END


GO
/****** Object:  StoredProcedure [dbo].[SP_AddProductionStageEntries]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* ============================================================
   التعديل الوحيد هون: إضافة تحقق (@OrderStatusID = 5) يمنع
   إضافة أي دفعة إنتاج لطلبية "ملغاة"، مباشرة بعد التأكد من
   وجود مرحلة الطلبية وقبل بدء أي حسبة أو معاملة.
   باقي الإجراء كامل بدون أي تغيير آخر.
============================================================ */

CREATE PROCEDURE [dbo].[SP_AddProductionStageEntries]
    @OrderStageID INT,
    @Quantity INT,
    @Email NVARCHAR(MAX),
    @Notes NVARCHAR(MAX),
    @NewID INT OUTPUT,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY

        ---------------------------------------------------------
        -- Initialize outputs
        ---------------------------------------------------------

        SET @NewID = -1;
        SET @Message = NULL;
        SET @ErrorType = 0;


        ---------------------------------------------------------
        -- Basic validation
        ---------------------------------------------------------

        IF @Quantity IS NULL OR @Quantity <= 0
        BEGIN
            SET @Message = N'الكمية يجب أن تكون أكبر من صفر.';
            SET @ErrorType = 1;
            RETURN;
        END;


        IF NULLIF(LTRIM(RTRIM(@Email)), '') IS NULL
        BEGIN
            SET @Message = N'البريد الإلكتروني مطلوب.';
            SET @ErrorType = 1;
            RETURN;
        END;


        ---------------------------------------------------------
        -- Get user
        ---------------------------------------------------------

        DECLARE @UserID INT;

        SELECT @UserID = ID
        FROM Users
        WHERE Email = @Email
          AND IsActive = 1;


        IF @UserID IS NULL
        BEGIN
            SET @Message = N'المستخدم غير موجود أو غير فعال.';
            SET @ErrorType = 3;
            RETURN;
        END;


        ---------------------------------------------------------
        -- Variables
        ---------------------------------------------------------

        DECLARE
            @OrderID INT,
            @StageID INT,
            @DisplayOrder INT,
            @RequestedQuantity INT,
            @OrderStatusID INT,

            @CurrentProduction INT,
            @CurrentWaste INT,
            @CurrentGood INT,

            @PreviousStageID INT,
            @PreviousProduction INT,
            @PreviousWaste INT,
            @PreviousGood INT,
            @AlreadyTransferred INT,
            @AvailableFromPrevious INT,

            @NextStageID INT,
            @NextStageRequired INT,

            @AllowedGoodQuantity INT;


        ---------------------------------------------------------
        -- Get Order Stage information
        ---------------------------------------------------------

        SELECT
            @OrderID = POS.OrderID,
            @StageID = POS.StageID,
            @DisplayOrder = PS.DisplayOrder,
            @RequestedQuantity = PO.RequestedQuantity,
            @OrderStatusID = PO.StatusID
        FROM ProductionOrderStages POS
        INNER JOIN ProductionOrders PO
            ON PO.ID = POS.OrderID
        INNER JOIN ProductionStages PS
            ON PS.ID = POS.StageID
        WHERE POS.ID = @OrderStageID;


        IF @OrderID IS NULL
        BEGIN
            SET @Message = N'مرحلة الطلبية غير موجودة.';
            SET @ErrorType = 3;
            RETURN;
        END;


        ---------------------------------------------------------
        -- ***** التحقق الجديد: منع أي إضافة على طلبية ملغاة *****
        ---------------------------------------------------------

        IF @OrderStatusID = 5  -- ملغاة
        BEGIN
            SET @Message = N'لا يمكن إضافة دفعة إنتاج لطلبية ملغاة.';
            SET @ErrorType = 1;
            RETURN;
        END;


        ---------------------------------------------------------
        -- Validate stage
        ---------------------------------------------------------

        IF NOT EXISTS
        (
            SELECT 1
            FROM ProductionStages
            WHERE ID = @StageID
              AND IsActive = 1
        )
        BEGIN
            SET @Message = N'مرحلة الإنتاج غير موجودة أو غير فعالة.';
            SET @ErrorType = 3;
            RETURN;
        END;


        IF @RequestedQuantity IS NULL OR @RequestedQuantity <= 0
        BEGIN
            SET @Message = N'الكمية المطلوبة في الطلبية غير صحيحة.';
            SET @ErrorType = 3;
            RETURN;
        END;


        ---------------------------------------------------------
        -- Start transaction
        ---------------------------------------------------------

        BEGIN TRANSACTION;


        ---------------------------------------------------------
        -- Lock order
        ---------------------------------------------------------

        SELECT 1
        FROM ProductionOrders WITH (UPDLOCK, HOLDLOCK)
        WHERE ID = @OrderID;


        ---------------------------------------------------------
        -- Current stage production
        ---------------------------------------------------------

        SELECT
            @CurrentProduction =
                ISNULL(SUM(PSE.Quantity), 0)
        FROM ProductionStageEntries PSE WITH (UPDLOCK, HOLDLOCK)
        WHERE PSE.OrderStageID = @OrderStageID;


        ---------------------------------------------------------
        -- Current stage waste
        ---------------------------------------------------------

        SELECT
            @CurrentWaste =
                ISNULL(SUM(PSW.WasteQuantity), 0)
        FROM ProductionStageEntries PSE WITH (UPDLOCK, HOLDLOCK)
        INNER JOIN ProductionStageWastes PSW WITH (UPDLOCK, HOLDLOCK)
            ON PSW.StageEntryID = PSE.ID
        WHERE PSE.OrderStageID = @OrderStageID;


        SET @CurrentGood =
            ISNULL(@CurrentProduction, 0)
            -
            ISNULL(@CurrentWaste, 0);


        ---------------------------------------------------------
        -- FIRST STAGE
        ---------------------------------------------------------

        IF @DisplayOrder = 1
        BEGIN

            /*
                المرحلة الأولى هي مصدر المواد.

                المسموح إنتاجه =
                الكمية المطلوبة
                + الهدر الذي حصل في المراحل اللاحقة.

                مثال:

                Requested = 50
                Painting Waste = 10

                إذن Cutting يستطيع الوصول إلى:

                Good = 60
            */

            SELECT
                @NextStageID = PS.ID
            FROM ProductionStages PS
            WHERE PS.DisplayOrder = @DisplayOrder + 1
              AND PS.IsActive = 1;


            SELECT
                @NextStageRequired =
                    ISNULL(SUM(PSW.WasteQuantity), 0)
            FROM ProductionOrderStages POS
            INNER JOIN ProductionStageEntries PSE
                ON PSE.OrderStageID = POS.ID
            INNER JOIN ProductionStageWastes PSW
                ON PSW.StageEntryID = PSE.ID
            INNER JOIN ProductionStages PS
                ON PS.ID = POS.StageID
            WHERE POS.OrderID = @OrderID
              AND PS.DisplayOrder > @DisplayOrder;


            SET @AllowedGoodQuantity =
                @RequestedQuantity
                +
                ISNULL(@NextStageRequired, 0);


            IF
                @CurrentGood + @Quantity
                >
                @AllowedGoodQuantity
            BEGIN

                ROLLBACK TRANSACTION;

                SET @Message =
                    N'الكمية الصالحة ستتجاوز الكمية المطلوبة مع احتساب الهدر. '
                    + N'الحد الأقصى المسموح: '
                    + CAST(@AllowedGoodQuantity AS NVARCHAR(30))
                    + N'، الكمية الصالحة الحالية: '
                    + CAST(@CurrentGood AS NVARCHAR(30))
                    + N'، والكمية المطلوبة للإضافة: '
                    + CAST(@Quantity AS NVARCHAR(30))
                    + N'.';

                SET @ErrorType = 1;
                RETURN;

            END;

        END;


        ---------------------------------------------------------
        -- SECOND / THIRD / OTHER STAGES
        ---------------------------------------------------------

        ELSE
        BEGIN

            -----------------------------------------------------
            -- Find previous stage
            -----------------------------------------------------

            SELECT
                @PreviousStageID = PS.ID
            FROM ProductionStages PS
            WHERE PS.DisplayOrder = @DisplayOrder - 1
              AND PS.IsActive = 1;


            IF @PreviousStageID IS NULL
            BEGIN

                ROLLBACK TRANSACTION;

                SET @Message = N'لم يتم العثور على المرحلة السابقة.';
                SET @ErrorType = 3;
                RETURN;

            END;


            -----------------------------------------------------
            -- Check previous stage configured
            -----------------------------------------------------

            IF NOT EXISTS
            (
                SELECT 1
                FROM ProductionOrderStages
                WHERE OrderID = @OrderID
                  AND StageID = @PreviousStageID
            )
            BEGIN

                ROLLBACK TRANSACTION;

                SET @Message =
                    N'المرحلة السابقة غير مهيأة لهذه الطلبية.';

                SET @ErrorType = 3;
                RETURN;

            END;


            -----------------------------------------------------
            -- Previous stage production
            -----------------------------------------------------

            SELECT
                @PreviousProduction =
                    ISNULL(SUM(PSE.Quantity), 0)
            FROM ProductionOrderStages POS
            INNER JOIN ProductionStageEntries PSE
                ON PSE.OrderStageID = POS.ID
            WHERE POS.OrderID = @OrderID
              AND POS.StageID = @PreviousStageID;


            -----------------------------------------------------
            -- Previous stage waste
            -----------------------------------------------------

            SELECT
                @PreviousWaste =
                    ISNULL(SUM(PSW.WasteQuantity), 0)
            FROM ProductionOrderStages POS
            INNER JOIN ProductionStageEntries PSE
                ON PSE.OrderStageID = POS.ID
            INNER JOIN ProductionStageWastes PSW
                ON PSW.StageEntryID = PSE.ID
            WHERE POS.OrderID = @OrderID
              AND POS.StageID = @PreviousStageID;


            SET @PreviousGood =
                ISNULL(@PreviousProduction, 0)
                -
                ISNULL(@PreviousWaste, 0);


            -----------------------------------------------------
            -- Quantity already transferred to current stage
            -----------------------------------------------------

            SELECT
                @AlreadyTransferred =
                    ISNULL(SUM(PSE.Quantity), 0)
            FROM ProductionStageEntries PSE
            WHERE PSE.OrderStageID = @OrderStageID;


            -----------------------------------------------------
            -- Available from previous stage
            -----------------------------------------------------

            SET @AvailableFromPrevious =
                @PreviousGood
                -
                ISNULL(@AlreadyTransferred, 0);


            -----------------------------------------------------
            -- Cannot consume more than available
            -----------------------------------------------------

            IF @Quantity > @AvailableFromPrevious
            BEGIN

                ROLLBACK TRANSACTION;

                SET @Message =
                    N'الكمية المتاحة من المرحلة السابقة غير كافية. '
                    + N'المتاح: '
                    + CAST(
                        CASE
                            WHEN @AvailableFromPrevious > 0
                            THEN @AvailableFromPrevious
                            ELSE 0
                        END
                        AS NVARCHAR(30)
                    )
                    + N'، والمطلوب: '
                    + CAST(@Quantity AS NVARCHAR(30))
                    + N'.';

                SET @ErrorType = 1;
                RETURN;

            END;


            -----------------------------------------------------
            -- Current stage allowed GOOD quantity
            --
            -- If this is not the final stage:
            --
            -- current stage must produce enough to cover
            -- the requested quantity + downstream waste.
            -----------------------------------------------------

            SELECT
                @NextStageRequired =
                    ISNULL(SUM(PSW.WasteQuantity), 0)
            FROM ProductionOrderStages POS
            INNER JOIN ProductionStageEntries PSE
                ON PSE.OrderStageID = POS.ID
            INNER JOIN ProductionStageWastes PSW
                ON PSW.StageEntryID = PSE.ID
            INNER JOIN ProductionStages PS
                ON PS.ID = POS.StageID
            WHERE POS.OrderID = @OrderID
              AND PS.DisplayOrder > @DisplayOrder;


            SET @AllowedGoodQuantity =
                @RequestedQuantity
                +
                ISNULL(@NextStageRequired, 0);


            -----------------------------------------------------
            -- If this is final stage:
            -- final good cannot exceed RequestedQuantity
            -----------------------------------------------------

            IF NOT EXISTS
            (
                SELECT 1
                FROM ProductionStages
                WHERE DisplayOrder > @DisplayOrder
                  AND IsActive = 1
            )
            BEGIN
                SET @AllowedGoodQuantity =
                    @RequestedQuantity;
            END;


            -----------------------------------------------------
            -- Prevent overproduction
            -----------------------------------------------------

            IF
                @CurrentGood + @Quantity
                >
                @AllowedGoodQuantity
            BEGIN

                ROLLBACK TRANSACTION;

                SET @Message =
                    N'الإضافة ستتجاوز الكمية الصالحة المسموح بها. '
                    + N'الحد الأقصى: '
                    + CAST(@AllowedGoodQuantity AS NVARCHAR(30))
                    + N'، الكمية الصالحة الحالية: '
                    + CAST(@CurrentGood AS NVARCHAR(30))
                    + N'، والإضافة: '
                    + CAST(@Quantity AS NVARCHAR(30))
                    + N'.';

                SET @ErrorType = 1;
                RETURN;

            END;

        END;


        ---------------------------------------------------------
        -- Insert production entry
        ---------------------------------------------------------

        INSERT INTO ProductionStageEntries
        (
            OrderStageID,
            Quantity,
            CreatedBy,
            Notes,
            CreatedAt
        )
        VALUES
        (
            @OrderStageID,
            @Quantity,
            @UserID,
            @Notes,
            GETDATE()
        );


        SET @NewID = CONVERT(INT, SCOPE_IDENTITY());


        ---------------------------------------------------------
        -- Commit
        ---------------------------------------------------------

        COMMIT TRANSACTION;


        SET @Message =
            N'تمت إضافة كمية الإنتاج بنجاح.';

        SET @ErrorType = 0;


    END TRY

    BEGIN CATCH

        IF XACT_STATE() <> 0
            ROLLBACK TRANSACTION;

        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;

    END CATCH

END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddProductionStages]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* ================================================================
   2) SP_AddProductionStages
   المشكلة: لا يوجد أي فاليديشن إطلاقًا + رسالة النجاح بالإنجليزي
   التعديل:
     - StageName مطلوب
     - DisplayOrder مطلوب ويجب أن يكون أكبر من صفر
     - منع تكرار DisplayOrder (لأن باقي الإجراءات، مثل
       SP_AddProductionOrderStages، تعتمد على وجود DisplayOrder
       فريد لكل مرحلة 1 و2 و3)
     - منع تكرار StageName
     - ترجمة رسالة النجاح
   ================================================================ */
CREATE   PROCEDURE [dbo].[SP_AddProductionStages]
    @StageName nvarchar(MAX),
    @Description nvarchar(MAX),
    @DisplayOrder int
    ,@NewID INT OUTPUT
    ,@Message NVARCHAR(250) OUTPUT
    ,@ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SET @NewID = -1;
        SET @Message = NULL;
        SET @ErrorType = 0;

        IF @StageName IS NULL OR LTRIM(RTRIM(@StageName)) = ''
        BEGIN
            SET @Message = N'اسم المرحلة مطلوب.';
            SET @ErrorType = 1;
            RETURN;
        END

        IF @DisplayOrder IS NULL OR @DisplayOrder <= 0
        BEGIN
            SET @Message = N'ترتيب العرض (DisplayOrder) مطلوب ويجب أن يكون أكبر من صفر.';
            SET @ErrorType = 1;
            RETURN;
        END

        IF EXISTS (SELECT 1 FROM ProductionStages WHERE StageName = @StageName COLLATE SQL_Latin1_General_CP1_CI_AS)
        BEGIN
            SET @Message = N'اسم هذه المرحلة مستخدم مسبقًا.';
            SET @ErrorType = 3;
            RETURN;
        END

        IF EXISTS (SELECT 1 FROM ProductionStages WHERE DisplayOrder = @DisplayOrder)
        BEGIN
            SET @Message = N'ترتيب العرض (DisplayOrder) مستخدم مسبقًا لمرحلة أخرى.';
            SET @ErrorType = 3;
            RETURN;
        END

        INSERT INTO ProductionStages (StageName, Description, DisplayOrder)
        VALUES (@StageName, @Description, @DisplayOrder);

        SET @NewID = SCOPE_IDENTITY();
        SET @Message = N'تمت إضافة مرحلة الإنتاج بنجاح.';
        SET @ErrorType = 0;  -- Success
    END TRY
    BEGIN CATCH
        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;  -- DatabaseError
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddProductionStageWastes]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[SP_AddProductionStageWastes]
    @StageEntryID int,
    @WasteQuantity int,
    @Email nvarchar(MAX),
    @Notes nvarchar(MAX),
    @WasteTypeID int,
    @WasteReasonID int,
    @NewID INT OUTPUT,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        SET @NewID = -1;
        SET @Message = NULL;
        SET @ErrorType = 0;

        IF @WasteQuantity IS NULL OR @WasteQuantity <= 0
        BEGIN
            SET @Message = N'كمية الهدر يجب أن تكون أكبر من صفر.';
            SET @ErrorType = 1;
            RETURN;
        END

        IF NULLIF(LTRIM(RTRIM(@Email)), '') IS NULL
        BEGIN
            SET @Message = N'البريد الإلكتروني مطلوب.';
            SET @ErrorType = 1;
            RETURN;
        END

        IF NOT EXISTS (
            SELECT 1
            FROM Users
            WHERE Email = @Email
              AND IsActive = 1
        )
        BEGIN
            SET @Message = N'المستخدم غير موجود أو غير فعال.';
            SET @ErrorType = 3;
            RETURN;
        END

        IF NOT EXISTS (
            SELECT 1
            FROM ProductionStageEntries
            WHERE ID = @StageEntryID
        )
        BEGIN
            SET @Message = N'سجل الإنتاج غير موجود.';
            SET @ErrorType = 3;
            RETURN;
        END

        IF NOT EXISTS (
            SELECT 1
            FROM WasteTypes
            WHERE ID = @WasteTypeID
              AND IsActive = 1
        )
        BEGIN
            SET @Message = N'نوع الهدر غير موجود أو غير فعال.';
            SET @ErrorType = 3;
            RETURN;
        END

        IF NOT EXISTS (
            SELECT 1
            FROM WasteReasons
            WHERE ID = @WasteReasonID
              AND IsActive = 1
        )
        BEGIN
            SET @Message = N'سبب الهدر غير موجود أو غير فعال.';
            SET @ErrorType = 3;
            RETURN;
        END

        DECLARE
            @OrderID INT,
            @StageID INT,
            @DisplayOrder INT,
            @EntryQuantity INT,
            @CurrentWaste INT,
            @NewTotalWaste INT,
            @NextStageID INT,
            @NextStageQuantity INT,
            @StageProduced INT,
            @StageWasteAfterInsert INT,
            @AvailableAfterWaste INT;

        SELECT
            @OrderID = PO.ID,
            @StageID = POS.StageID,
            @DisplayOrder = PS.DisplayOrder,
            @EntryQuantity = PSE.Quantity
        FROM ProductionStageEntries AS PSE
        INNER JOIN ProductionOrderStages AS POS
            ON POS.ID = PSE.OrderStageID
        INNER JOIN ProductionOrders AS PO
            ON PO.ID = POS.OrderID
        INNER JOIN ProductionStages AS PS
            ON PS.ID = POS.StageID
        WHERE PSE.ID = @StageEntryID;

        IF @DisplayOrder IS NULL
        BEGIN
            SET @Message = N'إعدادات مرحلة الإنتاج غير صحيحة.';
            SET @ErrorType = 3;
            RETURN;
        END

        BEGIN TRANSACTION;

        /*
            قفل الطلبية حتى لا تتجاوز عمليتا إنتاج/هدر متزامنتان
            الكمية المتاحة في نفس اللحظة.
        */
        SELECT 1
        FROM ProductionOrders WITH (UPDLOCK, HOLDLOCK)
        WHERE ID = @OrderID;

        SELECT
            @EntryQuantity = PSE.Quantity
        FROM ProductionStageEntries AS PSE WITH (UPDLOCK, HOLDLOCK)
        WHERE PSE.ID = @StageEntryID;

        SELECT
            @CurrentWaste = ISNULL(SUM(WasteQuantity), 0)
        FROM ProductionStageWastes WITH (UPDLOCK, HOLDLOCK)
        WHERE StageEntryID = @StageEntryID;

        SET @NewTotalWaste =
            ISNULL(@CurrentWaste, 0) + @WasteQuantity;

        IF @NewTotalWaste > @EntryQuantity
        BEGIN
            ROLLBACK TRANSACTION;

            SET @Message =
                N'كمية الهدر تتجاوز الكمية المتاحة في سجل الإنتاج. الكمية المتاحة في السجل: '
                + CAST(@EntryQuantity AS NVARCHAR(30))
                + N'، الهدر المسجل حاليًا: '
                + CAST(ISNULL(@CurrentWaste, 0) AS NVARCHAR(30))
                + N'، الهدر الجديد المطلوب: '
                + CAST(@WasteQuantity AS NVARCHAR(30))
                + N'.';
            SET @ErrorType = 1;
            RETURN;
        END

        /*
            إذا كانت هذه المرحلة قد أرسلت كمية بالفعل إلى المرحلة التالية،
            فلا يجوز أن يجعل الهدر الجديد الكمية المتاحة أقل من الكمية
            المنقولة فعليًا إلى المرحلة التالية.
        */
        SELECT
            @NextStageID = NextStage.ID
        FROM ProductionStages AS CurrentStage
        LEFT JOIN ProductionStages AS NextStage
            ON NextStage.DisplayOrder = CurrentStage.DisplayOrder + 1
        WHERE CurrentStage.ID = @StageID;

        IF @NextStageID IS NOT NULL
        BEGIN

            SELECT
                @StageProduced =
                    ISNULL(SUM(PSE.Quantity), 0)
            FROM ProductionOrderStages AS POS WITH (UPDLOCK, HOLDLOCK)
            LEFT JOIN ProductionStageEntries AS PSE WITH (UPDLOCK, HOLDLOCK)
                ON PSE.OrderStageID = POS.ID
            WHERE POS.OrderID = @OrderID
              AND POS.StageID = @StageID;

            SELECT
                @StageWasteAfterInsert =
                    ISNULL(SUM(PSW.WasteQuantity), 0)
            FROM ProductionOrderStages AS POS WITH (UPDLOCK, HOLDLOCK)
            LEFT JOIN ProductionStageEntries AS PSE WITH (UPDLOCK, HOLDLOCK)
                ON PSE.OrderStageID = POS.ID
            LEFT JOIN ProductionStageWastes AS PSW WITH (UPDLOCK, HOLDLOCK)
                ON PSW.StageEntryID = PSE.ID
            WHERE POS.OrderID = @OrderID
              AND POS.StageID = @StageID;

            SET @StageWasteAfterInsert =
                ISNULL(@StageWasteAfterInsert, 0)
                + @WasteQuantity;

            SELECT
                @NextStageQuantity =
                    ISNULL(SUM(PSE.Quantity), 0)
            FROM ProductionOrderStages AS POS WITH (UPDLOCK, HOLDLOCK)
            LEFT JOIN ProductionStageEntries AS PSE WITH (UPDLOCK, HOLDLOCK)
                ON PSE.OrderStageID = POS.ID
            WHERE POS.OrderID = @OrderID
              AND POS.StageID = @NextStageID;

            SET @AvailableAfterWaste =
                ISNULL(@StageProduced, 0)
                - ISNULL(@StageWasteAfterInsert, 0);

            IF @AvailableAfterWaste < ISNULL(@NextStageQuantity, 0)
            BEGIN
                ROLLBACK TRANSACTION;

                SET @Message =
                    N'لا يمكن إضافة هذا الهدر لأنه سيجعل الكمية المتاحة أقل من الكمية '
                    + N'المنقولة فعليًا إلى المرحلة التالية. الكمية المتاحة بعد الهدر: '
                    + CAST(@AvailableAfterWaste AS NVARCHAR(30))
                    + N'، الكمية المنقولة فعليًا: '
                    + CAST(ISNULL(@NextStageQuantity, 0) AS NVARCHAR(30))
                    + N'.';
                SET @ErrorType = 1;
                RETURN;
            END
        END

        INSERT INTO ProductionStageWastes
        (
            StageEntryID,
            WasteQuantity,
            CreatedBy,
            Notes,
            WasteTypeID,
            WasteReasonID,
            CreatedAt
        )
        VALUES
        (
            @StageEntryID,
            @WasteQuantity,
            (SELECT ID FROM Users WHERE Email = @Email AND IsActive = 1),
            @Notes,
            @WasteTypeID,
            @WasteReasonID,
            GETDATE()
        );

        COMMIT TRANSACTION;

        SET @NewID = CONVERT(INT, SCOPE_IDENTITY());
        SET @Message = N'تمت إضافة سجل الهدر بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;

    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddProducts]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* ================================================================
   3) SP_AddProducts
   المشكلة: لا يوجد أي فاليديشن + رسالة النجاح بالإنجليزي
   التعديل: ProductName مطلوب + منع تكرار الاسم + ترجمة الرسالة
   ================================================================ */
CREATE   PROCEDURE [dbo].[SP_AddProducts]
    @ProductName nvarchar(MAX),
    @Description nvarchar(MAX)
    ,@NewID INT OUTPUT
    ,@Message NVARCHAR(250) OUTPUT
    ,@ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SET @NewID = -1;
        SET @Message = NULL;
        SET @ErrorType = 0;

        IF @ProductName IS NULL OR LTRIM(RTRIM(@ProductName)) = ''
        BEGIN
            SET @Message = N'اسم المنتج مطلوب.';
            SET @ErrorType = 1;
            RETURN;
        END

        IF EXISTS (SELECT 1 FROM Products WHERE ProductName = @ProductName COLLATE SQL_Latin1_General_CP1_CI_AS)
        BEGIN
            SET @Message = N'اسم هذا المنتج مستخدم مسبقًا.';
            SET @ErrorType = 3;
            RETURN;
        END

        INSERT INTO Products (ProductName, Description, IsActive, CreatedAt, UpdatedAt)
        VALUES (@ProductName, @Description, 1, GETDATE(), NULL);

        SET @NewID = SCOPE_IDENTITY();
        SET @Message = N'تمت إضافة المنتج بنجاح.';
        SET @ErrorType = 0;  -- Success
    END TRY
    BEGIN CATCH
        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;  -- DatabaseError
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddRoles]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/* ================================================================
   4) SP_AddRoles
   المشكلة: لا يوجد أي فاليديشن + رسالة النجاح بالإنجليزي
   التعديل: RoleName مطلوب + منع تكرار الاسم + ترجمة الرسالة
   ================================================================ */
CREATE   PROCEDURE [dbo].[SP_AddRoles]
    @RoleName nvarchar(MAX),
    @Description nvarchar(MAX)
    ,@NewID INT OUTPUT
    ,@Message NVARCHAR(250) OUTPUT
    ,@ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SET @NewID = -1;
        SET @Message = NULL;
        SET @ErrorType = 0;

        IF @RoleName IS NULL OR LTRIM(RTRIM(@RoleName)) = ''
        BEGIN
            SET @Message = N'اسم الدور مطلوب.';
            SET @ErrorType = 1;
            RETURN;
        END

        IF EXISTS (SELECT 1 FROM Roles WHERE RoleName = @RoleName COLLATE SQL_Latin1_General_CP1_CI_AS)
        BEGIN
            SET @Message = N'اسم هذا الدور مستخدم مسبقًا.';
            SET @ErrorType = 3;
            RETURN;
        END

        INSERT INTO Roles (RoleName, Description, IsActive,CreatedAt,UpdatedAt)
        VALUES (@RoleName, @Description, 1,getdate(),null);

        SET @NewID = SCOPE_IDENTITY();
        SET @Message = N'تمت إضافة الدور بنجاح.';
        SET @ErrorType = 0;  -- Success
    END TRY
    BEGIN CATCH
        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;  -- DatabaseError
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddStatuses]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* ================================================================
   5) SP_AddStatuses
   المشكلة: لا يوجد أي فاليديشن + رسالة النجاح بالإنجليزي
   التعديل: StatusName مطلوب + منع تكرار الاسم + ترجمة الرسالة
   ================================================================ */
CREATE   PROCEDURE [dbo].[SP_AddStatuses]
    @StatusName nvarchar(MAX),
    @Description nvarchar(MAX)
    ,@NewID INT OUTPUT
    ,@Message NVARCHAR(250) OUTPUT
    ,@ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SET @NewID = -1;
        SET @Message = NULL;
        SET @ErrorType = 0;

        IF @StatusName IS NULL OR LTRIM(RTRIM(@StatusName)) = ''
        BEGIN
            SET @Message = N'اسم الحالة مطلوب.';
            SET @ErrorType = 1;
            RETURN;
        END

        IF EXISTS (SELECT 1 FROM Statuses WHERE StatusName = @StatusName COLLATE SQL_Latin1_General_CP1_CI_AS)
        BEGIN
            SET @Message = N'اسم هذه الحالة مستخدم مسبقًا.';
            SET @ErrorType = 3;
            RETURN;
        END

        INSERT INTO Statuses (StatusName, Description, IsActive)
        VALUES (@StatusName, @Description, 1);

        SET @NewID = SCOPE_IDENTITY();
        SET @Message = N'تمت إضافة الحالة بنجاح.';
        SET @ErrorType = 0;  -- Success
    END TRY
    BEGIN CATCH
        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;  -- DatabaseError
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddUsers]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* ================================================================
   6) SP_AddUsers
   المشكلة: رسائل الفاليديشن بالإنجليزي + لا يوجد فاليديشن على
            الإيميل (مطلوب / تكراره) رغم أنه يُستخدم لتسجيل
            الدخول في SP_LoginRequest، وأيضًا لا يوجد فاليديشن
            على FullName
   التعديل: ترجمة الرسائل + إضافة فاليديشن الإيميل و FullName
   ================================================================ */
CREATE   PROCEDURE [dbo].[SP_AddUsers]
    @Username NVARCHAR(MAX),
    @PasswordHash NVARCHAR(MAX),
    @Email NVARCHAR(MAX),
    @FullName NVARCHAR(MAX),
    @RoleID INT,
    @Items dbo.PermissionTableType READONLY,
    @NewID INT OUTPUT,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF @Username IS NULL OR LTRIM(RTRIM(@Username)) = ''
        BEGIN
            SET @NewID = -1;
            SET @Message = N'اسم المستخدم مطلوب.';
            SET @ErrorType = 1;
            RETURN;
        END

        IF @PasswordHash IS NULL OR LTRIM(RTRIM(@PasswordHash)) = ''
        BEGIN
            SET @NewID = -1;
            SET @Message = N'كلمة المرور مطلوبة.';
            SET @ErrorType = 1;
            RETURN;
        END

        -- ***** فاليديشن مضاف: الإيميل مطلوب (يُستخدم لتسجيل الدخول) *****
        IF @Email IS NULL OR LTRIM(RTRIM(@Email)) = ''
        BEGIN
            SET @NewID = -1;
            SET @Message = N'البريد الإلكتروني مطلوب.';
            SET @ErrorType = 1;
            RETURN;
        END

        -- ***** فاليديشن مضاف: صيغة الإيميل يجب أن تكون صحيحة *****
        IF @Email NOT LIKE '_%@_%._%'
        BEGIN
            SET @NewID = -1;
            SET @Message = N'صيغة البريد الإلكتروني غير صحيحة.';
            SET @ErrorType = 1;
            RETURN;
        END

        -- ***** فاليديشن مضاف: الاسم الكامل مطلوب *****
        IF @FullName IS NULL OR LTRIM(RTRIM(@FullName)) = ''
        BEGIN
            SET @NewID = -1;
            SET @Message = N'الاسم الكامل مطلوب.';
            SET @ErrorType = 1;
            RETURN;
        END

        IF NOT EXISTS
        (
            SELECT 1
            FROM Roles
            WHERE ID = @RoleID
        )
        BEGIN
            SET @NewID = -1;
            SET @Message = N'الدور غير صالح.';
            SET @ErrorType = 2;
            RETURN;
        END

        IF EXISTS
        (
            SELECT 1
            FROM Users
            WHERE Username =
                @Username COLLATE SQL_Latin1_General_CP1_CI_AS
        )
        BEGIN
            SET @NewID = -1;
            SET @Message = N'اسم المستخدم هذا مستخدم مسبقًا.';
            SET @ErrorType = 3;
            RETURN;
        END

        -- ***** فاليديشن مضاف: منع تكرار البريد الإلكتروني *****
        IF EXISTS
        (
            SELECT 1
            FROM Users
            WHERE Email = @Email COLLATE SQL_Latin1_General_CP1_CI_AS
        )
        BEGIN
            SET @NewID = -1;
            SET @Message = N'هذا البريد الإلكتروني مستخدم مسبقًا.';
            SET @ErrorType = 3;
            RETURN;
        END

        IF EXISTS
        (
            SELECT 1
            FROM @Items I
            WHERE NOT EXISTS
            (
                SELECT 1
                FROM Permissions P
                WHERE P.ID = I.PermissionID
                  AND P.IsActive = 1
            )
        )
        BEGIN
            SET @NewID = -1;
            SET @Message =
                N'واحدة أو أكثر من الصلاحيات (PermissionIDs) غير صحيحة أو غير فعالة.';
            SET @ErrorType = 2;
            RETURN;
        END

        DECLARE @PermissionMask BIGINT = 0;

        SELECT
            @PermissionMask =
                ISNULL(SUM(P.BitValue), 0)
        FROM @Items I
        INNER JOIN Permissions P
            ON P.ID = I.PermissionID
        WHERE P.IsActive = 1;

        INSERT INTO Users
        (
            Username,
            PasswordHash,
            RoleID,
            Email,
            FullName,
            PermissionMask,
            CreatedAt,
            UpdatedAt,
            IsActive
        )
        VALUES
        (
            @Username,
            @PasswordHash,
            @RoleID,
            @Email,
            @FullName,
            @PermissionMask,
            GETDATE(),
            NULL,
            1
        );

        SET @NewID = SCOPE_IDENTITY();
        SET @Message = N'تمت إضافة المستخدم بنجاح.';
        SET @ErrorType = 0;
    END TRY
    BEGIN CATCH
        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddWasteReasons]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* ================================================================
   7) SP_AddWasteReasons
   المشكلة: لا يوجد أي فاليديشن + رسالة النجاح بالإنجليزي
   التعديل: NameAr مطلوب + منع تكرار الاسم + ترجمة الرسالة
   ================================================================ */
CREATE   PROCEDURE [dbo].[SP_AddWasteReasons]
    @NameAr nvarchar(MAX)
    ,@NewID INT OUTPUT
    ,@Message NVARCHAR(250) OUTPUT
    ,@ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SET @NewID = -1;
        SET @Message = NULL;
        SET @ErrorType = 0;

        IF @NameAr IS NULL OR LTRIM(RTRIM(@NameAr)) = ''
        BEGIN
            SET @Message = N'اسم سبب الهدر مطلوب.';
            SET @ErrorType = 1;
            RETURN;
        END

        IF EXISTS (SELECT 1 FROM WasteReasons WHERE NameAr = @NameAr COLLATE SQL_Latin1_General_CP1_CI_AS)
        BEGIN
            SET @Message = N'اسم سبب الهدر هذا مستخدم مسبقًا.';
            SET @ErrorType = 3;
            RETURN;
        END

        INSERT INTO WasteReasons (NameAr, IsActive,CreatedAt)
        VALUES (@NameAr, 1,GETDATE());

        SET @NewID = SCOPE_IDENTITY();
        SET @Message = N'تمت إضافة سبب الهدر بنجاح.';
        SET @ErrorType = 0;  -- Success
    END TRY
    BEGIN CATCH
        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;  -- DatabaseError
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_AddWasteTypes]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* ================================================================
   8) SP_AddWasteTypes
   المشكلة: لا يوجد أي فاليديشن + رسالة النجاح بالإنجليزي
   التعديل: NameAr مطلوب + منع تكرار الاسم + ترجمة الرسالة
   ================================================================ */
CREATE   PROCEDURE [dbo].[SP_AddWasteTypes]
    @NameAr nvarchar(MAX)
    ,@NewID INT OUTPUT
    ,@Message NVARCHAR(250) OUTPUT
    ,@ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SET @NewID = -1;
        SET @Message = NULL;
        SET @ErrorType = 0;

        IF @NameAr IS NULL OR LTRIM(RTRIM(@NameAr)) = ''
        BEGIN
            SET @Message = N'اسم نوع الهدر مطلوب.';
            SET @ErrorType = 1;
            RETURN;
        END

        IF EXISTS (SELECT 1 FROM WasteTypes WHERE NameAr = @NameAr COLLATE SQL_Latin1_General_CP1_CI_AS)
        BEGIN
            SET @Message = N'اسم نوع الهدر هذا مستخدم مسبقًا.';
            SET @ErrorType = 3;
            RETURN;
        END

        INSERT INTO WasteTypes (NameAr, IsActive,CreatedAt)
        VALUES (@NameAr, 1, GETDATE());

        SET @NewID = SCOPE_IDENTITY();
        SET @Message = N'تمت إضافة نوع الهدر بنجاح.';
        SET @ErrorType = 0;  -- Success
    END TRY
    BEGIN CATCH
        SET @NewID = -1;
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;  -- DatabaseError
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_DeleteProductionOrdersByID]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[SP_DeleteProductionOrdersByID]
    @ID int,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        IF NOT EXISTS (
            SELECT 1 FROM ProductionOrders WHERE ID = @ID
        )
        BEGIN
            SET @Message = N'الطلبية غير موجودة.';
            SET @ErrorType = 2;
            RETURN;
        END

        IF EXISTS (
            SELECT 1
            FROM ProductionOrderStages
            WHERE OrderID = @ID
        )
        BEGIN
            SET @Message =
                N'لا يمكن حذف الطلبية لأنها تحتوي على مراحل إنتاج أو سجل إنتاج مرتبط بها.';
            SET @ErrorType = 4;
            RETURN;
        END

        DELETE FROM ProductionOrders
        WHERE ID = @ID;

        SET @Message = N'تم حذف الطلبية بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_DeleteProductionStageEntriesByID]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[SP_DeleteProductionStageEntriesByID]
    @ID int,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        IF NOT EXISTS (
            SELECT 1 FROM ProductionStageEntries WHERE ID = @ID
        )
        BEGIN
            SET @Message = N'سجل الإنتاج غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        DECLARE
            @OrderID INT,
            @StageID INT,
            @DisplayOrder INT,
            @NextStageID INT,
            @NextStageQuantity INT,
            @RemainingStageQuantity INT,
            @StageWasteQuantity INT;

        SELECT
            @OrderID = PO.ID,
            @StageID = POS.StageID,
            @DisplayOrder = PS.DisplayOrder
        FROM ProductionStageEntries AS PSE
        INNER JOIN ProductionOrderStages AS POS
            ON POS.ID = PSE.OrderStageID
        INNER JOIN ProductionOrders AS PO
            ON PO.ID = POS.OrderID
        INNER JOIN ProductionStages AS PS
            ON PS.ID = POS.StageID
        WHERE PSE.ID = @ID;

        IF EXISTS (
            SELECT 1
            FROM ProductionStageWastes
            WHERE StageEntryID = @ID
        )
        BEGIN
            SET @Message =
                N'لا يمكن حذف سجل الإنتاج هذا لأنه يحتوي على سجلات هدر مرتبطة به. '
                + N'يجب حذف سجلات الهدر أولاً.';
            SET @ErrorType = 4;
            RETURN;
        END

        BEGIN TRANSACTION;

        /*
            قفل الطلبية أثناء التحقق والحذف لمنع عملية إضافة متزامنة
            في المرحلة التالية من تجاوز الكمية المتاحة أثناء الحذف.
        */
        SELECT 1
        FROM ProductionOrders WITH (UPDLOCK, HOLDLOCK)
        WHERE ID = @OrderID;

        SELECT @NextStageID = ID
        FROM ProductionStages
        WHERE DisplayOrder = @DisplayOrder + 1;

        IF @NextStageID IS NOT NULL
        BEGIN
            SELECT
                @NextStageQuantity = ISNULL(SUM(PSE.Quantity), 0)
            FROM ProductionOrderStages AS POS WITH (UPDLOCK, HOLDLOCK)
            LEFT JOIN ProductionStageEntries AS PSE WITH (UPDLOCK, HOLDLOCK)
                ON PSE.OrderStageID = POS.ID
            WHERE POS.OrderID = @OrderID
              AND POS.StageID = @NextStageID;

            SELECT
                @RemainingStageQuantity =
                    ISNULL(SUM(PSE.Quantity), 0)
            FROM ProductionOrderStages AS POS WITH (UPDLOCK, HOLDLOCK)
            INNER JOIN ProductionStageEntries AS PSE WITH (UPDLOCK, HOLDLOCK)
                ON PSE.OrderStageID = POS.ID
            WHERE POS.OrderID = @OrderID
              AND POS.StageID = @StageID
              AND PSE.ID <> @ID;

            SELECT
                @StageWasteQuantity =
                    ISNULL(SUM(PSW.WasteQuantity), 0)
            FROM ProductionOrderStages AS POS WITH (UPDLOCK, HOLDLOCK)
            INNER JOIN ProductionStageEntries AS PSE WITH (UPDLOCK, HOLDLOCK)
                ON PSE.OrderStageID = POS.ID
            INNER JOIN ProductionStageWastes AS PSW WITH (UPDLOCK, HOLDLOCK)
                ON PSW.StageEntryID = PSE.ID
            WHERE POS.OrderID = @OrderID
              AND POS.StageID = @StageID
              AND PSE.ID <> @ID;

            IF ISNULL(@RemainingStageQuantity, 0) - ISNULL(@StageWasteQuantity, 0)
               < ISNULL(@NextStageQuantity, 0)
            BEGIN
                ROLLBACK TRANSACTION;
                SET @Message =
                    N'لا يمكن حذف سجل الإنتاج هذا لأن المرحلة التالية تحتوي بالفعل '
                    + N'على كمية إنتاج تعتمد على هذه الكمية.';
                SET @ErrorType = 4;
                RETURN;
            END
        END

        DELETE FROM ProductionStageEntries
        WHERE ID = @ID;

        COMMIT TRANSACTION;

        SET @Message = N'تم حذف سجل الإنتاج بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_DeleteProductionStageWastesByID]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[SP_DeleteProductionStageWastesByID]
    @ID int,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        IF NOT EXISTS (
            SELECT 1 FROM ProductionStageWastes WHERE ID = @ID
        )
        BEGIN
            SET @Message = N'سجل الهدر غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        DELETE FROM ProductionStageWastes
        WHERE ID = @ID;

        SET @Message = N'تم حذف سجل الهدر بنجاح.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllPermissions]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[SP_GetAllPermissions]
AS
BEGIN

SELECT ID, Code, Name, ModuleName, ActionName, IsActive FROM     Permissions
;
END

GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllProductionOrders]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_GetAllProductionOrders]
AS
BEGIN

SELECT ProductionOrders.ID, ProductionOrders.ProductName, ProductionOrders.RequestedQuantity, Statuses.StatusName, ProductionOrders.CreatedAt, ProductionOrders.UpdatedAt, ProductionOrders.Notes, Users.FullName as [CreatedBy] FROM     ProductionOrders INNER JOIN                   Users ON ProductionOrders.CreatedBy = Users.ID INNER JOIN                   Products ON ProductionOrders.ProductID = Products.ID INNER JOIN                   Statuses ON ProductionOrders.StatusID = Statuses.ID
;
END


GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllProductionOrderStages]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_GetAllProductionOrderStages]
AS
BEGIN

SELECT      ProductionOrderStages.ID,     ProductionOrderStages.OrderID,     ProductionStages.StageName,     Statuses.StatusName,      ProductionOrderStages.CreatedAt FROM ProductionOrderStages  INNER JOIN ProductionOrders     ON ProductionOrderStages.OrderID = ProductionOrders.ID  INNER JOIN ProductionStages     ON ProductionOrderStages.StageID = ProductionStages.ID  INNER JOIN Statuses     ON ProductionOrderStages.StatusID = Statuses.ID  ORDER BY     CASE         WHEN ProductionOrderStages.StatusID = 1 THEN 1         WHEN ProductionOrderStages.StatusID = 2 THEN 2         WHEN ProductionOrderStages.StatusID = 3 THEN 3         ELSE 4     END
;
END


GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllProductionStageEntries]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_GetAllProductionStageEntries]
AS
BEGIN

SELECT      ProductionStageEntries.ID,     ProductionOrderStages.OrderID,     ProductionStageEntries.OrderStageID,        ProductionStageEntries.Quantity,     ProductionStageEntries.CreatedAt,     ProductionStageEntries.Notes, Users.UserName FROM ProductionStageEntries INNER JOIN ProductionOrderStages      ON ProductionStageEntries.OrderStageID = ProductionOrderStages.ID INNER JOIN ProductionOrders      ON ProductionOrderStages.OrderID = ProductionOrders.ID INNER JOIN ProductionStages      ON ProductionOrderStages.StageID = ProductionStages.ID INNER JOIN Users      ON Users.ID = ProductionStageEntries.CreatedBy
;
END

GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllProductionStages]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_GetAllProductionStages]
AS
BEGIN

        SELECT
            [ProductionStages].[ID],
            [ProductionStages].[StageName],
            [ProductionStages].[Description],
            [ProductionStages].[DisplayOrder],
            [ProductionStages].[CreatedAt],
            [ProductionStages].[IsActive]
        FROM [ProductionStages]
;
END

GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllProductionStageWastes]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_GetAllProductionStageWastes]
AS
BEGIN

SELECT      ProductionStageWastes.ID,      ProductionStageWastes.StageEntryID,   ProductionStages.StageName,     ProductionStageWastes.WasteQuantity, Users.UserName as[CreatedBy],     WasteTypes.NameAr AS [WasteTypesName],     WasteReasons.NameAr AS [WasteReasonsName],     ProductionStageWastes.CreatedAt,       ProductionStageWastes.Notes  FROM ProductionStageWastes INNER JOIN ProductionStageEntries      ON ProductionStageWastes.StageEntryID = ProductionStageEntries.ID INNER JOIN WasteReasons      ON ProductionStageWastes.WasteReasonID = WasteReasons.ID INNER JOIN WasteTypes      ON ProductionStageWastes.WasteTypeID = WasteTypes.ID INNER JOIN ProductionOrderStages      ON ProductionStageEntries.OrderStageID = ProductionOrderStages.ID INNER JOIN ProductionStages      ON ProductionOrderStages.StageID = ProductionStages.ID inner join Users on ProductionStageWastes.CreatedBy=Users.ID
;
END

GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllProducts]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_GetAllProducts]
AS
BEGIN

        SELECT
            [Products].[ID],
            [Products].[ProductName],
            [Products].[Description],
            [Products].[IsActive],
            [Products].[CreatedAt],
            [Products].[UpdatedAt]
        FROM [Products]
;
END


GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllRoles]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_GetAllRoles]
AS
BEGIN

        SELECT
            [Roles].[ID],
            [Roles].[RoleName],
            [Roles].[Description],
            [Roles].[IsActive],
            [Roles].[CreatedAt],
            [Roles].[UpdatedAt]
        FROM [Roles]
;
END


GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllStatuses]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_GetAllStatuses]
AS
BEGIN

        SELECT
            [Statuses].[ID],
            [Statuses].[StatusName],
            [Statuses].[Description],
            [Statuses].[CreatedAt],
            [Statuses].[UpdatedAt],
            [Statuses].[IsActive]
        FROM [Statuses]
;
END


GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllUsers]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_GetAllUsers]
AS
BEGIN

SELECT Users.ID, Users.UserName, Users.Email, Users.FullName, Users.CreatedAt,Users.UpdatedAt,  Roles.RoleName,Users.IsActive FROM     Users INNER JOIN                   Roles ON Users.RoleID = Roles.ID
;
END


GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllWasteReasons]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_GetAllWasteReasons]
AS
BEGIN

        SELECT
            [WasteReasons].[ID],
            [WasteReasons].[NameAr],
            [WasteReasons].[IsActive],
            [WasteReasons].[CreatedAt]
        FROM [WasteReasons]
;
END


GO
/****** Object:  StoredProcedure [dbo].[SP_GetAllWasteTypes]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_GetAllWasteTypes]
AS
BEGIN

SELECT ID, NameAr, IsActive, CreatedAt FROM     WasteTypes
;
END


GO
/****** Object:  StoredProcedure [dbo].[SP_GetPermissionsByID]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/* ================================================================
   ملاحظة مهمة على كل إجراءات GetByID التالية:
   كان نوع @Message معرّف VARCHAR(150) وليس NVARCHAR(150).
   VARCHAR لا يدعم اليونيكود (Unicode)، وبما أن الرسائل الآن
   أصبحت بالعربية، فإن استخدام VARCHAR سيحوّل الأحرف العربية
   إلى علامات استفهام "؟؟؟؟" عند التنفيذ الفعلي على السيرفر.
   لذلك تم تغيير النوع إلى NVARCHAR(150) في كل الإجراءات أدناه.
   ================================================================ */

/* 10) SP_GetPermissionsByID */
CREATE   PROCEDURE [dbo].[SP_GetPermissionsByID]
    @ID int,
    @Message NVARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (
            SELECT 1
            FROM [Permissions]
            WHERE [Permissions].[ID] = @ID
        )
        BEGIN
            SET @Message = N'الصلاحية غير موجودة.';
            SET @ErrorType = 2;
            RETURN;
        END

        SELECT ID, Code, Name, ModuleName, ActionName, IsActive FROM
        Permissions
        WHERE [Permissions].[ID] = @ID

        SET @Message = N'تم تحميل بيانات الصلاحية بنجاح.';
        SET @ErrorType = 0;
    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetProductionOrdersByID]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 11) SP_GetProductionOrdersByID */
CREATE   PROCEDURE [dbo].[SP_GetProductionOrdersByID]
    @ID int,
    @Message NVARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (
            SELECT 1
            FROM [ProductionOrders]
            WHERE [ProductionOrders].[ID] = @ID
        )
        BEGIN
            SET @Message = N'الطلبية غير موجودة.';
            SET @ErrorType = 2;
            RETURN;
        END

        SELECT ProductionOrders.ID, ProductionOrders.ProductName, ProductionOrders.RequestedQuantity, Statuses.StatusName, ProductionOrders.CreatedAt, ProductionOrders.UpdatedAt, ProductionOrders.Notes, Users.FullName as [CreatedBy] FROM
        ProductionOrders INNER JOIN
                      Users ON ProductionOrders.CreatedBy = Users.ID INNER JOIN
                      Products ON ProductionOrders.ProductID = Products.ID INNER JOIN
                      Statuses ON ProductionOrders.StatusID = Statuses.ID
        WHERE [ProductionOrders].[ID] = @ID

        SET @Message = N'تم تحميل بيانات الطلبية بنجاح.';
        SET @ErrorType = 0;
    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetProductionOrderStagesByID]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 12) SP_GetProductionOrderStagesByID */
CREATE   PROCEDURE [dbo].[SP_GetProductionOrderStagesByID]
    @ID int,
    @Message NVARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (
            SELECT 1
            FROM [ProductionOrderStages]
            WHERE [ProductionOrderStages].[ID] = @ID
        )
        BEGIN
            SET @Message = N'مرحلة الطلبية غير موجودة.';
            SET @ErrorType = 2;
            RETURN;
        END

        SELECT
            ProductionOrderStages.ID,
            ProductionOrderStages.OrderID,
            ProductionStages.StageName,
            Statuses.StatusName,
            ProductionOrderStages.CreatedAt
        FROM ProductionOrderStages
        INNER JOIN ProductionOrders
            ON ProductionOrderStages.OrderID = ProductionOrders.ID
        INNER JOIN ProductionStages
            ON ProductionOrderStages.StageID = ProductionStages.ID
        INNER JOIN Statuses
            ON ProductionOrderStages.StatusID = Statuses.ID
        WHERE [ProductionOrderStages].[ID] = @ID
        ORDER BY
            CASE
                WHEN ProductionOrderStages.StatusID = 1 THEN 1
                WHEN ProductionOrderStages.StatusID = 2 THEN 2
                WHEN ProductionOrderStages.StatusID = 3 THEN 3
                ELSE 4
            END

        SET @Message = N'تم تحميل بيانات مرحلة الطلبية بنجاح.';
        SET @ErrorType = 0;
    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetProductionStageEntriesByID]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 13) SP_GetProductionStageEntriesByID */
CREATE   PROCEDURE [dbo].[SP_GetProductionStageEntriesByID]
    @ID int,
    @Message NVARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (
            SELECT 1
            FROM [ProductionStageEntries]
            WHERE [ProductionStageEntries].[ID] = @ID
        )
        BEGIN
            SET @Message = N'سجل الإنتاج غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        SELECT
            ProductionStageEntries.ID,
            ProductionOrderStages.OrderID,
            ProductionStageEntries.OrderStageID,
            ProductionStageEntries.Quantity,
            ProductionStageEntries.CreatedAt,
            ProductionStageEntries.Notes, Users.UserName
        FROM ProductionStageEntries INNER JOIN ProductionOrderStages
            ON ProductionStageEntries.OrderStageID = ProductionOrderStages.ID
        INNER JOIN ProductionOrders
            ON ProductionOrderStages.OrderID = ProductionOrders.ID
        INNER JOIN ProductionStages
            ON ProductionOrderStages.StageID = ProductionStages.ID
        INNER JOIN Users
            ON Users.ID = ProductionStageEntries.CreatedBy
        WHERE [ProductionStageEntries].[ID] = @ID

        SET @Message = N'تم تحميل سجل الإنتاج بنجاح.';
        SET @ErrorType = 0;
    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetProductionStagesByID]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 15) SP_GetProductionStagesByID */
CREATE   PROCEDURE [dbo].[SP_GetProductionStagesByID]
    @ID int,
    @Message NVARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (
            SELECT 1
            FROM [ProductionStages]
            WHERE [ProductionStages].[ID] = @ID
        )
        BEGIN
            SET @Message = N'مرحلة الإنتاج غير موجودة.';
            SET @ErrorType = 2;
            RETURN;
        END

        SELECT
            [ProductionStages].[ID],
            [ProductionStages].[StageName],
            [ProductionStages].[Description],
            [ProductionStages].[DisplayOrder],
            [ProductionStages].[CreatedAt],
            [ProductionStages].[IsActive]
        FROM [ProductionStages]
        WHERE [ProductionStages].[ID] = @ID

        SET @Message = N'تم تحميل بيانات مرحلة الإنتاج بنجاح.';
        SET @ErrorType = 0;
    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetProductionStageWastesByID]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 14) SP_GetProductionStageWastesByID */
CREATE   PROCEDURE [dbo].[SP_GetProductionStageWastesByID]
    @ID int,
    @Message NVARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (
            SELECT 1
            FROM [ProductionStageWastes]
            WHERE [ProductionStageWastes].[ID] = @ID
        )
        BEGIN
            SET @Message = N'سجل الهدر غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        SELECT
            ProductionStageWastes.ID,
            ProductionStageWastes.StageEntryID,
            ProductionStages.StageName,
            ProductionStageWastes.WasteQuantity, Users.UserName as[CreatedBy],
            WasteTypes.NameAr AS [WasteTypesName],
            WasteReasons.NameAr AS [WasteReasonsName],
            ProductionStageWastes.CreatedAt,
            ProductionStageWastes.Notes
        FROM ProductionStageWastes INNER JOIN ProductionStageEntries
            ON ProductionStageWastes.StageEntryID = ProductionStageEntries.ID
        INNER JOIN WasteReasons
            ON ProductionStageWastes.WasteReasonID = WasteReasons.ID
        INNER JOIN WasteTypes
            ON ProductionStageWastes.WasteTypeID = WasteTypes.ID
        INNER JOIN ProductionOrderStages
            ON ProductionStageEntries.OrderStageID = ProductionOrderStages.ID
        INNER JOIN ProductionStages
            ON ProductionOrderStages.StageID = ProductionStages.ID
        inner join Users on ProductionStageWastes.CreatedBy=Users.ID
        WHERE [ProductionStageWastes].[ID] = @ID

        SET @Message = N'تم تحميل سجل الهدر بنجاح.';
        SET @ErrorType = 0;
    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetProductsByID]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 16) SP_GetProductsByID */
CREATE   PROCEDURE [dbo].[SP_GetProductsByID]
    @ID int,
    @Message NVARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (
            SELECT 1
            FROM [Products]
            WHERE [Products].[ID] = @ID
        )
        BEGIN
            SET @Message = N'المنتج غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        SELECT
            [Products].[ID],
            [Products].[ProductName],
            [Products].[Description],
            [Products].[IsActive],
            [Products].[CreatedAt],
            [Products].[UpdatedAt]
        FROM [Products]
        WHERE [Products].[ID] = @ID

        SET @Message = N'تم تحميل بيانات المنتج بنجاح.';
        SET @ErrorType = 0;
    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetRolesByID]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 17) SP_GetRolesByID */
CREATE   PROCEDURE [dbo].[SP_GetRolesByID]
    @ID int,
    @Message NVARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (
            SELECT 1
            FROM [Roles]
            WHERE [Roles].[ID] = @ID
        )
        BEGIN
            SET @Message = N'الدور غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        SELECT
            [Roles].[ID],
            [Roles].[RoleName],
            [Roles].[Description],
            [Roles].[IsActive],
            [Roles].[CreatedAt],
            [Roles].[UpdatedAt]
        FROM [Roles]
        WHERE [Roles].[ID] = @ID

        SET @Message = N'تم تحميل بيانات الدور بنجاح.';
        SET @ErrorType = 0;
    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetStatusesByID]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 18) SP_GetStatusesByID */
CREATE   PROCEDURE [dbo].[SP_GetStatusesByID]
    @ID int,
    @Message NVARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (
            SELECT 1
            FROM [Statuses]
            WHERE [Statuses].[ID] = @ID
        )
        BEGIN
            SET @Message = N'الحالة غير موجودة.';
            SET @ErrorType = 2;
            RETURN;
        END

        SELECT
            [Statuses].[ID],
            [Statuses].[StatusName],
            [Statuses].[Description],
            [Statuses].[CreatedAt],
            [Statuses].[UpdatedAt],
            [Statuses].[IsActive]
        FROM [Statuses]
        WHERE [Statuses].[ID] = @ID

        SET @Message = N'تم تحميل بيانات الحالة بنجاح.';
        SET @ErrorType = 0;
    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetUserPasswordByEmail]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[SP_GetUserPasswordByEmail]
    @Email NVARCHAR(500),
    @PasswordHash NVARCHAR(500) OUTPUT,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        IF @Email IS NULL
           OR LTRIM(RTRIM(@Email)) = ''
        BEGIN
            SET @PasswordHash = NULL;
            SET @Message = N'البريد الإلكتروني مطلوب.';
            SET @ErrorType = 1;
            RETURN;
        END

        SELECT
            @PasswordHash = PasswordHash
        FROM Users
        WHERE Email COLLATE SQL_Latin1_General_CP1_CI_AS =
              @Email COLLATE SQL_Latin1_General_CP1_CI_AS;

        IF @PasswordHash IS NULL
        BEGIN
            SET @Message = N'البريد الإلكتروني غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        SET @Message = N'تم العثور على المستخدم.';
        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH

        SET @PasswordHash = NULL;

        SET @Message =
            ERROR_MESSAGE();

        SET @ErrorType = 5;

    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetUsersByID]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 19) SP_GetUsersByID */
CREATE   PROCEDURE [dbo].[SP_GetUsersByID]
    @ID int,
    @Message NVARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (
            SELECT 1
            FROM [Users]
            WHERE [Users].[ID] = @ID
        )
        BEGIN
            SET @Message = N'المستخدم غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        SELECT Users.ID, Users.UserName, Users.Email, Users.FullName, Users.CreatedAt,Users.UpdatedAt,  Roles.RoleName,Users.IsActive FROM
        Users INNER JOIN
                      Roles ON Users.RoleID = Roles.ID
        WHERE [Users].[ID] = @ID

        SET @Message = N'تم تحميل بيانات المستخدم بنجاح.';
        SET @ErrorType = 0;
    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetWasteReasonsByID]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 20) SP_GetWasteReasonsByID */
CREATE   PROCEDURE [dbo].[SP_GetWasteReasonsByID]
    @ID int,
    @Message NVARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (
            SELECT 1
            FROM [WasteReasons]
            WHERE [WasteReasons].[ID] = @ID
        )
        BEGIN
            SET @Message = N'سبب الهدر غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        SELECT
            [WasteReasons].[ID],
            [WasteReasons].[NameAr],
            [WasteReasons].[IsActive],
            [WasteReasons].[CreatedAt]
        FROM [WasteReasons]
        WHERE [WasteReasons].[ID] = @ID

        SET @Message = N'تم تحميل بيانات سبب الهدر بنجاح.';
        SET @ErrorType = 0;
    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_GetWasteTypesByID]    Script Date: 8/29/2026 10:48:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 21) SP_GetWasteTypesByID */
CREATE   PROCEDURE [dbo].[SP_GetWasteTypesByID]
    @ID int,
    @Message NVARCHAR(150) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (
            SELECT 1
            FROM [WasteTypes]
            WHERE [WasteTypes].[ID] = @ID
        )
        BEGIN
            SET @Message = N'نوع الهدر غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        SELECT ID, NameAr, IsActive, CreatedAt FROM
        WasteTypes
        WHERE [WasteTypes].[ID] = @ID

        SET @Message = N'تم تحميل بيانات نوع الهدر بنجاح.';
        SET @ErrorType = 0;
    END TRY
    BEGIN CATCH
        SET @Message =
            ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_LoginRequest]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* ================================================================
   9) SP_LoginRequest
   التعديل: ترجمة كل الرسائل للعربية (كانت بالإنجليزي رغم N'')
   ================================================================ */
CREATE   PROCEDURE [dbo].[SP_LoginRequest]
    @Email NVARCHAR(256),
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- ==========================================
        -- Validate Email
        -- ==========================================
        IF @Email IS NULL
           OR LTRIM(RTRIM(@Email)) = ''
        BEGIN
            SET @Message = N'البريد الإلكتروني مطلوب.';
            SET @ErrorType = 1;
            RETURN;
        END

        -- ==========================================
        -- User Not Found
        -- ==========================================
        IF NOT EXISTS
        (
            SELECT 1
            FROM Users
            WHERE Email = @Email
        )
        BEGIN
            SET @Message = N'اسم المستخدم أو كلمة المرور غير صحيحة.';
            SET @ErrorType = 2;
            RETURN;
        END

        -- ==========================================
        -- Account Deactivated
        -- ==========================================
        IF EXISTS
        (
            SELECT 1
            FROM Users
            WHERE Email = @Email
              AND IsActive = 0
        )
        BEGIN
            SET @Message = N'هذا الحساب معطل.';
            SET @ErrorType = 3;
            RETURN;
        END

        -- ==========================================
        -- Get User Data
        -- ==========================================
        SELECT
            U.ID AS UserID,
            U.Email AS Email,
            U.PasswordHash,
            U.PermissionMask,
            R.RoleName AS [Role]
        FROM Users AS U
        INNER JOIN Roles AS R
            ON R.ID = U.RoleID
        WHERE U.Email = @Email;

        SET @Message = N'تم تسجيل الدخول بنجاح.';
        SET @ErrorType = 0;
    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE();
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_SearchPermissions]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[SP_SearchPermissions]
    @ModuleName nvarchar(MAX)=NULL
AS
BEGIN

SELECT ID, Code, Name, ModuleName, ActionName, IsActive FROM     Permissions
where
(
(@ModuleName is null or ModuleName COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @ModuleName + '%')
)
;
END

GO
/****** Object:  StoredProcedure [dbo].[SP_SearchProductionOrders]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_SearchProductionOrders]
     @ProductName nvarchar(MAX)=NULL,
     @StatusName nvarchar(MAX)=NULL
 AS
 BEGIN

 SELECT ProductionOrders.ID, ProductionOrders.ProductName, ProductionOrders.RequestedQuantity, Statuses.StatusName, ProductionOrders.CreatedAt, ProductionOrders.UpdatedAt, ProductionOrders.Notes, Users.FullName as [CreatedBy] FROM     ProductionOrders INNER JOIN                   Users ON ProductionOrders.CreatedBy = Users.ID INNER JOIN                   Products ON ProductionOrders.ProductID = Products.ID INNER JOIN                   Statuses ON ProductionOrders.StatusID = Statuses.ID
 where
 (
 (@ProductName is null or Products.ProductName COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @ProductName + '%')
  and
 (@StatusName is null or Statuses.StatusName COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @StatusName + '%')
 )
 ;
 END


GO
/****** Object:  StoredProcedure [dbo].[SP_SearchProductionOrderStages]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_SearchProductionOrderStages]
    @OrderID int=NULL,
    @StageName nvarchar(MAX)=NULL,
    @StatusName nvarchar(MAX)=NULL
AS
BEGIN

SELECT      ProductionOrderStages.ID,     ProductionOrderStages.OrderID,     ProductionStages.StageName,     Statuses.StatusName,   
ProductionOrderStages.CreatedAt FROM ProductionOrderStages  INNER JOIN ProductionOrders 
ON ProductionOrderStages.OrderID = ProductionOrders.ID  INNER JOIN ProductionStages   
ON ProductionOrderStages.StageID = ProductionStages.ID  INNER JOIN Statuses 
ON ProductionOrderStages.StatusID = Statuses.ID  
where
(
(@OrderID is null or ProductionOrderStages.OrderID =@OrderID)
 and
(@StageName is null or ProductionStages.StageName COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @StageName + '%')
 and
(@StatusName is null or Statuses.StatusName COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @StatusName + '%')
)
ORDER BY     CASE   
WHEN ProductionOrderStages.StatusID = 1 THEN 1     
WHEN ProductionOrderStages.StatusID = 2 THEN 2         
WHEN ProductionOrderStages.StatusID = 3 THEN 3      
ELSE 4   
END
;
END
GO
/****** Object:  StoredProcedure [dbo].[SP_SearchProductionStageEntries]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_SearchProductionStageEntries]
    @OrderID int=NULL,
    @OrderStageID int=NULL,
    @StageID int = NULL
AS
BEGIN

SELECT      ProductionStageEntries.ID,     ProductionOrderStages.OrderID,     ProductionStageEntries.OrderStageID,       ProductionStageEntries.Quantity,     ProductionStageEntries.CreatedAt,     ProductionStageEntries.Notes, Users.UserName FROM ProductionStageEntries INNER JOIN ProductionOrderStages      ON ProductionStageEntries.OrderStageID = ProductionOrderStages.ID INNER JOIN ProductionOrders      ON ProductionOrderStages.OrderID = ProductionOrders.ID INNER JOIN ProductionStages      ON ProductionOrderStages.StageID = ProductionStages.ID INNER JOIN Users      ON Users.ID = ProductionStageEntries.CreatedBy
where

(
(@OrderID is null or OrderID =@OrderID)
 and

(@OrderStageID is null or OrderStageID =@OrderStageID)
 and

(@StageID is null OR StageID =@StageID)
)
;
END

GO
/****** Object:  StoredProcedure [dbo].[SP_SearchProductionStageWastes]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_SearchProductionStageWastes]
    @OrderStageID int=NULL,
    @StageName nvarchar(MAX)=NULL,
    @WasteTypesName nvarchar(MAX)=NULL,
    @WasteReasonsName nvarchar(MAX)=NULL
AS
BEGIN

SELECT      ProductionStageWastes.ID,     ProductionStageWastes.StageEntryID,     ProductionStages.StageName,     ProductionStageWastes.WasteQuantity, 	Users.UserName as[CreatedBy],     WasteTypes.NameAr AS [WasteTypesName],     WasteReasons.NameAr AS [WasteReasonsName],     ProductionStageWastes.CreatedAt,       ProductionStageWastes.Notes 	 FROM ProductionStageWastes INNER JOIN ProductionStageEntries      ON ProductionStageWastes.StageEntryID = ProductionStageEntries.ID INNER JOIN WasteReasons      ON ProductionStageWastes.WasteReasonID = WasteReasons.ID INNER JOIN WasteTypes      ON ProductionStageWastes.WasteTypeID = WasteTypes.ID INNER JOIN ProductionOrderStages      ON ProductionStageEntries.OrderStageID = ProductionOrderStages.ID INNER JOIN ProductionStages      ON ProductionOrderStages.StageID = ProductionStages.ID 	inner join Users 	on ProductionStageWastes.CreatedBy=Users.ID
where
(
(@OrderStageID is null or OrderStageID =@OrderStageID)
 and
(@StageName is null or StageName COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @StageName + '%')
 and
(@WasteTypesName is null or WasteTypes.NameAr COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @WasteTypesName + '%')
 and
(@WasteReasonsName is null or WasteReasons.NameAr COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @WasteReasonsName + '%')
)
;
END
GO
/****** Object:  StoredProcedure [dbo].[SP_SearchReport_CancelledOrders]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* ============================================================
   تقرير جديد مستقل: SP_SearchReport_CancelledOrders

   الهدف: عرض الطلبيات "الملغاة" فقط (StatusID = 5)، مع تفاصيل
   ما تم إنتاجه فعلياً بكل مرحلة قبل الإلغاء، وكمية الهدر.

   هذا التقرير منفصل تماماً عن التقارير الأربعة الأخرى —
   بياناته لا تظهر ولا تُحسب في أي منها (لأنها كلها بتستثني
   StatusID = 5 حالياً)، وهو المصدر الوحيد لمتابعة خسائر
   الطلبيات الملغاة.
============================================================ */

CREATE PROCEDURE [dbo].[SP_SearchReport_CancelledOrders]
    @OrderID INT = NULL,
    @ProductName NVARCHAR(MAX) = NULL,
    @FromDate DATETIME = NULL,
    @ToDate DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH StageData AS
    (
        SELECT
            PO.ID AS OrderID,
            PO.ProductName,
            PO.RequestedQuantity,

            POS.StageID,

            ISNULL(SUM(PSE.Quantity), 0) AS ProductionQuantity,

            ISNULL(SUM(W.WasteQuantity), 0) AS WasteQuantity

        FROM ProductionOrders AS PO

        LEFT JOIN ProductionOrderStages AS POS
            ON POS.OrderID = PO.ID

        LEFT JOIN ProductionStageEntries AS PSE
            ON PSE.OrderStageID = POS.ID

        OUTER APPLY
        (
            SELECT
                ISNULL(SUM(PSW.WasteQuantity), 0) AS WasteQuantity

            FROM ProductionStageWastes AS PSW

            WHERE PSW.StageEntryID = PSE.ID

        ) AS W

        WHERE
            (@OrderID IS NULL OR PO.ID = @OrderID)

            AND
            (
                @ProductName IS NULL
                OR PO.ProductName COLLATE SQL_Latin1_General_CP1_CI_AS
                   LIKE @ProductName + '%'
            )

            AND
            (
                @FromDate IS NULL
                OR PO.CreatedAt >= @FromDate
            )

            AND
            (
                @ToDate IS NULL
                OR PO.CreatedAt <
                   DATEADD(DAY, 1, CAST(@ToDate AS DATE))
            )

            -- ***** الشرط الأساسي: الطلبيات الملغاة فقط *****
            AND PO.StatusID = 5

        GROUP BY
            PO.ID,
            PO.ProductName,
            PO.RequestedQuantity,
            POS.StageID,
            PSE.ID
    ),

    OrderSummary AS
    (
        SELECT
            OrderID,
            ProductName,
            RequestedQuantity,

            SUM(CASE WHEN StageID = 1 THEN ProductionQuantity ELSE 0 END) AS CuttingQuantity,
            SUM(CASE WHEN StageID = 1 THEN WasteQuantity ELSE 0 END) AS CuttingWaste,

            SUM(CASE WHEN StageID = 2 THEN ProductionQuantity ELSE 0 END) AS PaintingQuantity,
            SUM(CASE WHEN StageID = 2 THEN WasteQuantity ELSE 0 END) AS PaintingWaste,

            SUM(CASE WHEN StageID = 3 THEN ProductionQuantity ELSE 0 END) AS PackagingQuantity,
            SUM(CASE WHEN StageID = 3 THEN WasteQuantity ELSE 0 END) AS PackagingWaste,

            SUM(WasteQuantity) AS TotalWasteQuantity

        FROM StageData

        GROUP BY
            OrderID,
            ProductName,
            RequestedQuantity
    )

    SELECT
        OS.OrderID,
        OS.ProductName,
        OS.RequestedQuantity,

        ---------------------------------------------------------
        -- القص
        ---------------------------------------------------------
        ISNULL(OS.CuttingQuantity, 0) AS CuttingQuantity,
        ISNULL(OS.CuttingWaste, 0) AS CuttingWaste,
        ISNULL(OS.CuttingQuantity, 0) - ISNULL(OS.CuttingWaste, 0) AS CuttingGoodQuantity,

        ---------------------------------------------------------
        -- التلوين
        ---------------------------------------------------------
        ISNULL(OS.PaintingQuantity, 0) AS PaintingQuantity,
        ISNULL(OS.PaintingWaste, 0) AS PaintingWaste,
        ISNULL(OS.PaintingQuantity, 0) - ISNULL(OS.PaintingWaste, 0) AS PaintingGoodQuantity,

        ---------------------------------------------------------
        -- التعبئة والتغليف
        ---------------------------------------------------------
        ISNULL(OS.PackagingQuantity, 0) AS PackagingQuantity,
        ISNULL(OS.PackagingWaste, 0) AS PackagingWaste,
        ISNULL(OS.PackagingQuantity, 0) - ISNULL(OS.PackagingWaste, 0) AS FinalProducedQuantity,

        ---------------------------------------------------------
        -- الإجمالي
        --
        -- ما تم إنتاجه فعلياً عبر كل المراحل قبل الإلغاء
        -- (بدون ازدواج، أي نفس القطعة لا تُحسب أكثر من مرة
        -- لأنها بتتحرك مرحلة وحدة بكل مرة بالمعادلة أعلاه)
        ---------------------------------------------------------
        ISNULL(OS.CuttingQuantity, 0)
            + ISNULL(OS.PaintingQuantity, 0)
            + ISNULL(OS.PackagingQuantity, 0)
            AS TotalProducedAcrossStages,

        ISNULL(OS.TotalWasteQuantity, 0) AS TotalWasteQuantity,

        ---------------------------------------------------------
        -- نسبة الهدر من الكمية المطلوبة أصلاً
        ---------------------------------------------------------
        CASE
            WHEN OS.RequestedQuantity > 0
            THEN (ISNULL(OS.TotalWasteQuantity, 0) * 100.0) / OS.RequestedQuantity
            ELSE 0
        END AS WastePercentage,

        S.StatusName,
        PO.CreatedAt

    FROM OrderSummary AS OS
    INNER JOIN ProductionOrders AS PO ON PO.ID = OS.OrderID
    INNER JOIN Statuses AS S ON S.ID = PO.StatusID

    ORDER BY PO.CreatedAt DESC;

END
GO
/****** Object:  StoredProcedure [dbo].[SP_SearchReport_Orders]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_SearchReport_Orders]
    @OrderID INT = NULL,
    @ProductName NVARCHAR(MAX) = NULL,
    @StatusName NVARCHAR(MAX) = NULL,
    @FromDate DATETIME = NULL,
    @ToDate DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH StageData AS
    (
        SELECT
            PO.ID AS OrderID,
            PO.ProductName,
            PO.RequestedQuantity,

            POS.StageID,

            ISNULL(SUM(PSE.Quantity), 0) AS ProductionQuantity,

            ISNULL(SUM(W.WasteQuantity), 0) AS WasteQuantity

        FROM ProductionOrders AS PO

        LEFT JOIN ProductionOrderStages AS POS
            ON POS.OrderID = PO.ID

        LEFT JOIN ProductionStageEntries AS PSE
            ON PSE.OrderStageID = POS.ID

        OUTER APPLY
        (
            SELECT
                ISNULL(SUM(PSW.WasteQuantity), 0) AS WasteQuantity

            FROM ProductionStageWastes AS PSW

            WHERE PSW.StageEntryID = PSE.ID

        ) AS W

        WHERE
            (@OrderID IS NULL OR PO.ID = @OrderID)

            AND
            (
                @ProductName IS NULL
                OR PO.ProductName COLLATE SQL_Latin1_General_CP1_CI_AS
                   LIKE @ProductName + '%'
            )

            AND
            (
                @StatusName IS NULL
                OR EXISTS
                (
                    SELECT 1
                    FROM Statuses AS S
                    WHERE S.ID = PO.StatusID
                      AND S.StatusName COLLATE SQL_Latin1_General_CP1_CI_AS
                          LIKE @StatusName + '%'
                )
            )

            AND
            (
                @FromDate IS NULL
                OR PO.CreatedAt >= @FromDate
            )

            AND
            (
                @ToDate IS NULL
                OR PO.CreatedAt <
                   DATEADD(DAY, 1, CAST(@ToDate AS DATE))
            )

            -- ***** استثناء الطلبيات الملغاة بالكامل *****
            AND PO.StatusID <> 5

        GROUP BY
            PO.ID,
            PO.ProductName,
            PO.RequestedQuantity,
            POS.StageID,
            PSE.ID
    ),

    OrderSummary AS
    (
        SELECT
            OrderID,
            ProductName,
            RequestedQuantity,

            ---------------------------------------------------------
            -- Cutting
            ---------------------------------------------------------

            SUM(
                CASE
                    WHEN StageID = 1
                    THEN ProductionQuantity
                    ELSE 0
                END
            ) AS CuttingQuantity,

            SUM(
                CASE
                    WHEN StageID = 1
                    THEN WasteQuantity
                    ELSE 0
                END
            ) AS CuttingWaste,

            ---------------------------------------------------------
            -- Painting
            ---------------------------------------------------------

            SUM(
                CASE
                    WHEN StageID = 2
                    THEN ProductionQuantity
                    ELSE 0
                END
            ) AS PaintingQuantity,

            SUM(
                CASE
                    WHEN StageID = 2
                    THEN WasteQuantity
                    ELSE 0
                END
            ) AS PaintingWaste,

            ---------------------------------------------------------
            -- Packaging
            ---------------------------------------------------------

            SUM(
                CASE
                    WHEN StageID = 3
                    THEN ProductionQuantity
                    ELSE 0
                END
            ) AS PackagingQuantity,

            SUM(
                CASE
                    WHEN StageID = 3
                    THEN WasteQuantity
                    ELSE 0
                END
            ) AS PackagingWaste,

            ---------------------------------------------------------
            -- Total Waste
            ---------------------------------------------------------

            SUM(WasteQuantity) AS TotalWasteQuantity

        FROM StageData

        GROUP BY
            OrderID,
            ProductName,
            RequestedQuantity
    )

    SELECT
        ---------------------------------------------------------
        -- Order Information
        ---------------------------------------------------------

        OS.OrderID,

        OS.ProductName,

        OS.RequestedQuantity,

        ---------------------------------------------------------
        -- Cutting
        ---------------------------------------------------------

        ISNULL(OS.CuttingQuantity, 0)
            AS CuttingQuantity,

        ISNULL(OS.CuttingWaste, 0)
            AS CuttingWaste,

        ISNULL(OS.CuttingQuantity, 0)
        -
        ISNULL(OS.CuttingWaste, 0)
            AS CuttingGoodQuantity,

        ---------------------------------------------------------
        -- Painting
        ---------------------------------------------------------

        ISNULL(OS.PaintingQuantity, 0)
            AS PaintingQuantity,

        ISNULL(OS.PaintingWaste, 0)
            AS PaintingWaste,

        ISNULL(OS.PaintingQuantity, 0)
        -
        ISNULL(OS.PaintingWaste, 0)
            AS PaintingGoodQuantity,

        ---------------------------------------------------------
        -- Packaging
        ---------------------------------------------------------

        ISNULL(OS.PackagingQuantity, 0)
            AS PackagingQuantity,

        ISNULL(OS.PackagingWaste, 0)
            AS PackagingWaste,

        ISNULL(OS.PackagingQuantity, 0)
        -
        ISNULL(OS.PackagingWaste, 0)
            AS FinalProducedQuantity,

        ---------------------------------------------------------
        -- Total Waste
        ---------------------------------------------------------

        ISNULL(OS.TotalWasteQuantity, 0)
            AS TotalWasteQuantity,

        ---------------------------------------------------------
        -- Remaining Quantity
        ---------------------------------------------------------

        CASE
            WHEN
                OS.RequestedQuantity
                -
                (
                    ISNULL(OS.PackagingQuantity, 0)
                    -
                    ISNULL(OS.PackagingWaste, 0)
                ) > 0
            THEN
                OS.RequestedQuantity
                -
                (
                    ISNULL(OS.PackagingQuantity, 0)
                    -
                    ISNULL(OS.PackagingWaste, 0)
                )
            ELSE 0
        END AS RemainingQuantity,

        ---------------------------------------------------------
        -- Production Completion %
        --
        -- Final Produced Quantity / Requested Quantity * 100
        --
        ---------------------------------------------------------

        CASE
            WHEN OS.RequestedQuantity > 0
            THEN
                (
                    (
                        ISNULL(OS.PackagingQuantity, 0)
                        -
                        ISNULL(OS.PackagingWaste, 0)
                    ) * 100.0
                )
                / OS.RequestedQuantity
            ELSE 0
        END AS ProductionCompletionPercentage,

        ---------------------------------------------------------
        -- Waste %
        --
        -- Total Waste / Requested Quantity * 100
        --
        ---------------------------------------------------------

        CASE
            WHEN OS.RequestedQuantity > 0
            THEN
                (
                    ISNULL(OS.TotalWasteQuantity, 0) * 100.0
                )
                / OS.RequestedQuantity
            ELSE 0
        END AS WastePercentage,

        ---------------------------------------------------------
        -- Order Status
        ---------------------------------------------------------

        S.StatusName,

        ---------------------------------------------------------
        -- Created Date
        ---------------------------------------------------------

        PO.CreatedAt

    FROM OrderSummary AS OS

    INNER JOIN ProductionOrders AS PO
        ON PO.ID = OS.OrderID

    INNER JOIN Statuses AS S
        ON S.ID = PO.StatusID

    ORDER BY
        PO.CreatedAt DESC;

END
GO
/****** Object:  StoredProcedure [dbo].[SP_SearchReport_ProductComparison]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_SearchReport_ProductComparison]

    @FromDate DATETIME = NULL,
    @ToDate DATETIME = NULL

AS
BEGIN

    SET NOCOUNT ON;


    ;WITH StageEntryWastes AS
    (
        SELECT
            StageEntryID,

            SUM(WasteQuantity) AS WasteQuantity

        FROM ProductionStageWastes

        GROUP BY
            StageEntryID
    ),


    OrderStageData AS
    (
        SELECT

            PO.ID AS OrderID,

            PO.ProductID,

            PO.ProductName,

            PO.RequestedQuantity,

            POS.StageID,

            ISNULL(
                SUM(PSE.Quantity),
                0
            ) AS ProductionQuantity,

            ISNULL(
                SUM(SEW.WasteQuantity),
                0
            ) AS WasteQuantity

        FROM ProductionOrders AS PO


        INNER JOIN ProductionOrderStages AS POS
            ON POS.OrderID = PO.ID


        LEFT JOIN ProductionStageEntries AS PSE
            ON PSE.OrderStageID = POS.ID


        LEFT JOIN StageEntryWastes AS SEW
            ON SEW.StageEntryID = PSE.ID


        WHERE

            (
                @FromDate IS NULL
                OR PO.CreatedAt >= @FromDate
            )

            AND

            (
                @ToDate IS NULL
                OR PO.CreatedAt <
                    DATEADD(
                        DAY,
                        1,
                        CAST(@ToDate AS DATE)
                    )
            )

            -- ***** استثناء الطلبيات الملغاة بالكامل *****
            AND PO.StatusID <> 5


        GROUP BY

            PO.ID,

            PO.ProductID,

            PO.ProductName,

            PO.RequestedQuantity,

            POS.StageID
    ),


    OrderSummary AS
    (
        SELECT

            OrderID,

            ProductID,

            ProductName,

            RequestedQuantity,


            ---------------------------------------------------------
            -- Packaging Production
            ---------------------------------------------------------

            SUM(
                CASE
                    WHEN StageID = 3
                    THEN ProductionQuantity
                    ELSE 0
                END
            ) AS PackagingProduction,


            ---------------------------------------------------------
            -- Packaging Waste
            ---------------------------------------------------------

            SUM(
                CASE
                    WHEN StageID = 3
                    THEN WasteQuantity
                    ELSE 0
                END
            ) AS PackagingWaste,


            ---------------------------------------------------------
            -- Total Waste
            ---------------------------------------------------------

            SUM(WasteQuantity)
                AS TotalWasteQuantity


        FROM OrderStageData


        GROUP BY

            OrderID,

            ProductID,

            ProductName,

            RequestedQuantity
    ),


    ProductSummary AS
    (
        SELECT

            ProductID,

            ProductName,


            ---------------------------------------------------------
            -- Total Requested
            ---------------------------------------------------------

            SUM(RequestedQuantity)
                AS TotalRequestedQuantity,


            ---------------------------------------------------------
            -- Packaging Production
            ---------------------------------------------------------

            SUM(PackagingProduction)
                AS PackagingProduction,


            ---------------------------------------------------------
            -- Packaging Waste
            ---------------------------------------------------------

            SUM(PackagingWaste)
                AS PackagingWaste,


            ---------------------------------------------------------
            -- Total Waste
            ---------------------------------------------------------

            SUM(TotalWasteQuantity)
                AS TotalWasteQuantity


        FROM OrderSummary


        GROUP BY

            ProductID,

            ProductName
    ),


    FinalData AS
    (
        SELECT

            ProductID,

            ProductName,

            ISNULL(
                TotalRequestedQuantity,
                0
            ) AS TotalRequestedQuantity,


            ---------------------------------------------------------
            -- Final Produced Quantity
            --
            -- Packaging Production - Packaging Waste
            ---------------------------------------------------------

            (
                ISNULL(
                    PackagingProduction,
                    0
                )
                -
                ISNULL(
                    PackagingWaste,
                    0
                )
            ) AS TotalProducedQuantity,


            ---------------------------------------------------------
            -- Total Waste
            --
            -- Waste from ALL stages
            ---------------------------------------------------------

            ISNULL(
                TotalWasteQuantity,
                0
            ) AS TotalWasteQuantity

        FROM ProductSummary
    )


    SELECT

        ---------------------------------------------------------
        -- Product
        ---------------------------------------------------------

        ProductID,

        ProductName,


        ---------------------------------------------------------
        -- Requested
        ---------------------------------------------------------

        TotalRequestedQuantity,


        ---------------------------------------------------------
        -- Final Produced
        ---------------------------------------------------------

        TotalProducedQuantity,


        ---------------------------------------------------------
        -- Total Waste
        ---------------------------------------------------------

        TotalWasteQuantity,


        ---------------------------------------------------------
        -- Remaining
        ---------------------------------------------------------

        CASE

            WHEN
                TotalRequestedQuantity
                -
                TotalProducedQuantity > 0

            THEN
                TotalRequestedQuantity
                -
                TotalProducedQuantity

            ELSE 0

        END AS RemainingQuantity,


        ---------------------------------------------------------
        -- Production Completion %
        --
        -- Final Produced / Requested * 100
        ---------------------------------------------------------

        CAST(

            CASE

                WHEN TotalRequestedQuantity > 0

                THEN
                    (
                        TotalProducedQuantity
                        * 100.0
                    )
                    /
                    TotalRequestedQuantity

                ELSE 0

            END

            AS DECIMAL(18,2)

        ) AS ProductionCompletionPercentage,


        ---------------------------------------------------------
        -- Waste %
        --
        -- Total Waste / Requested * 100
        ---------------------------------------------------------

        CAST(

            CASE

                WHEN TotalRequestedQuantity > 0

                THEN
                    (
                        TotalWasteQuantity
                        * 100.0
                    )
                    /
                    TotalRequestedQuantity

                ELSE 0

            END

            AS DECIMAL(18,2)

        ) AS WastePercentage


    FROM FinalData


    ORDER BY

        TotalProducedQuantity DESC,

        ProductName ASC;

END
GO
/****** Object:  StoredProcedure [dbo].[SP_SearchReport_ProductionSummary]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_SearchReport_ProductionSummary]

    @FromDate DATETIME = NULL,
    @ToDate DATETIME = NULL

AS
BEGIN

    SET NOCOUNT ON;

    ;WITH StageEntryWastes AS
    (
        SELECT
            StageEntryID,
            SUM(WasteQuantity) AS WasteQuantity

        FROM ProductionStageWastes

        GROUP BY
            StageEntryID
    ),

    OrderStageSummary AS
    (
        SELECT

            PO.ID AS OrderID,

            PO.RequestedQuantity,

            PO.StatusID,

            POS.StageID,

            ISNULL(
                SUM(PSE.Quantity),
                0
            ) AS ProductionQuantity,

            ISNULL(
                SUM(SEW.WasteQuantity),
                0
            ) AS WasteQuantity

        FROM ProductionOrders AS PO

        LEFT JOIN ProductionOrderStages AS POS
            ON POS.OrderID = PO.ID

        LEFT JOIN ProductionStageEntries AS PSE
            ON PSE.OrderStageID = POS.ID

        LEFT JOIN StageEntryWastes AS SEW
            ON SEW.StageEntryID = PSE.ID

        WHERE

            (
                @FromDate IS NULL
                OR PO.CreatedAt >= @FromDate
            )

            AND

            (
                @ToDate IS NULL
                OR PO.CreatedAt <
                    DATEADD(
                        DAY,
                        1,
                        CAST(@ToDate AS DATE)
                    )
            )

            -- ***** استثناء الطلبيات الملغاة بالكامل *****
            AND PO.StatusID <> 5

        GROUP BY

            PO.ID,
            PO.RequestedQuantity,
            PO.StatusID,
            POS.StageID
    ),

    OrderData AS
    (
        SELECT

            OrderID,

            MAX(RequestedQuantity)
                AS RequestedQuantity,

            MAX(StatusID)
                AS StatusID,

            ---------------------------------------------------------
            -- Final Produced
            ---------------------------------------------------------

            ISNULL(
                SUM(
                    CASE
                        WHEN StageID = 3
                        THEN ProductionQuantity
                        ELSE 0
                    END
                ),
                0
            )
            -
            ISNULL(
                SUM(
                    CASE
                        WHEN StageID = 3
                        THEN WasteQuantity
                        ELSE 0
                    END
                ),
                0
            )
            AS FinalProducedQuantity,

            ---------------------------------------------------------
            -- Total Waste
            ---------------------------------------------------------

            ISNULL(
                SUM(WasteQuantity),
                0
            )
            AS TotalWasteQuantity

        FROM OrderStageSummary

        GROUP BY
            OrderID
    )

    SELECT

        ---------------------------------------------------------
        -- Orders Count
        ---------------------------------------------------------

        COUNT(*) AS OrdersCount,

        ---------------------------------------------------------
        -- Requested
        ---------------------------------------------------------

        ISNULL(
            SUM(RequestedQuantity),
            0
        ) AS TotalRequestedQuantity,

        ---------------------------------------------------------
        -- Produced
        ---------------------------------------------------------

        ISNULL(
            SUM(FinalProducedQuantity),
            0
        ) AS TotalProducedQuantity,

        ---------------------------------------------------------
        -- Remaining
        ---------------------------------------------------------

        CASE

            WHEN
                ISNULL(SUM(RequestedQuantity), 0)
                -
                ISNULL(SUM(FinalProducedQuantity), 0)
                > 0

            THEN
                ISNULL(SUM(RequestedQuantity), 0)
                -
                ISNULL(SUM(FinalProducedQuantity), 0)

            ELSE 0

        END AS RemainingQuantity,

        ---------------------------------------------------------
        -- Total Waste
        ---------------------------------------------------------

        ISNULL(
            SUM(TotalWasteQuantity),
            0
        ) AS TotalWasteQuantity,

        ---------------------------------------------------------
        -- Completion %
        ---------------------------------------------------------

        CAST(

            CASE

                WHEN
                    ISNULL(SUM(RequestedQuantity), 0) > 0

                THEN
                    ISNULL(SUM(FinalProducedQuantity), 0)
                    * 100.0
                    /
                    SUM(RequestedQuantity)

                ELSE 0

            END

            AS DECIMAL(18,2)

        ) AS ProductionCompletionPercentage,

        ---------------------------------------------------------
        -- Waste %
        ---------------------------------------------------------

        CAST(

            CASE

                WHEN
                    ISNULL(SUM(RequestedQuantity), 0) > 0

                THEN
                    ISNULL(SUM(TotalWasteQuantity), 0)
                    * 100.0
                    /
                    SUM(RequestedQuantity)

                ELSE 0

            END

            AS DECIMAL(18,2)

        ) AS WastePercentage,

        ---------------------------------------------------------
        -- Completed Orders
        -- StatusID = 3  =>  الحالة "مكتملة"
        ---------------------------------------------------------

        ISNULL(
            SUM(
                CASE
                    WHEN StatusID = 3
                    THEN 1
                    ELSE 0
                END
            ),
            0
        ) AS CompletedOrdersCount,

        ---------------------------------------------------------
        -- Incomplete Orders
        --
        -- أي طلبية حالتها غير "مكتملة" (قيد الانتظار / قيد التنفيذ / متوقفة)
        -- ملاحظة: الطلبيات الملغاة مستثناة بالكامل من هذا الإجراء أصلاً،
        -- فلا تظهر هنا ولا هناك.
        ---------------------------------------------------------

        ISNULL(
            SUM(
                CASE
                    WHEN StatusID <> 3
                    THEN 1
                    ELSE 0
                END
            ),
            0
        ) AS IncompleteOrdersCount

    FROM OrderData;

END
GO
/****** Object:  StoredProcedure [dbo].[SP_SearchReport_ProductProduction]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_SearchReport_ProductProduction]

    @ProductID INT = NULL,
    @FromDate DATETIME = NULL,
    @ToDate DATETIME = NULL

AS
BEGIN

    SET NOCOUNT ON;

    ;WITH StageEntryWastes AS
    (
        SELECT
            StageEntryID,
            SUM(WasteQuantity) AS WasteQuantity

        FROM ProductionStageWastes

        GROUP BY
            StageEntryID
    ),

    OrderStageData AS
    (
        SELECT
            PO.ID AS OrderID,
            PO.ProductID,
            PO.ProductName,
            PO.RequestedQuantity,
            POS.StageID,

            ISNULL(
                SUM(PSE.Quantity),
                0
            ) AS ProductionQuantity,

            ISNULL(
                SUM(SEW.WasteQuantity),
                0
            ) AS WasteQuantity

        FROM ProductionOrders AS PO

        INNER JOIN ProductionOrderStages AS POS
            ON POS.OrderID = PO.ID

        LEFT JOIN ProductionStageEntries AS PSE
            ON PSE.OrderStageID = POS.ID

        LEFT JOIN StageEntryWastes AS SEW
            ON SEW.StageEntryID = PSE.ID

        WHERE

            (
                @ProductID IS NULL
                OR PO.ProductID = @ProductID
            )

            AND

            (
                @FromDate IS NULL
                OR PO.CreatedAt >= @FromDate
            )

            AND

            (
                @ToDate IS NULL
                OR PO.CreatedAt <
                    DATEADD(
                        DAY,
                        1,
                        CAST(@ToDate AS DATE)
                    )
            )

            -- ***** استثناء الطلبيات الملغاة بالكامل *****
            AND PO.StatusID <> 5

        GROUP BY
            PO.ID,
            PO.ProductID,
            PO.ProductName,
            PO.RequestedQuantity,
            POS.StageID
    ),

    OrderProductionSummary AS
    (
        SELECT

            OrderID,
            ProductID,
            ProductName,
            MAX(RequestedQuantity)
                AS RequestedQuantity,

            SUM(
                CASE
                    WHEN StageID = 1
                    THEN ProductionQuantity
                    ELSE 0
                END
            ) AS CuttingQuantity,

            SUM(
                CASE
                    WHEN StageID = 1
                    THEN WasteQuantity
                    ELSE 0
                END
            ) AS CuttingWaste,

            SUM(
                CASE
                    WHEN StageID = 2
                    THEN ProductionQuantity
                    ELSE 0
                END
            ) AS PaintingQuantity,

            SUM(
                CASE
                    WHEN StageID = 2
                    THEN WasteQuantity
                    ELSE 0
                END
            ) AS PaintingWaste,

            SUM(
                CASE
                    WHEN StageID = 3
                    THEN ProductionQuantity
                    ELSE 0
                END
            ) AS PackagingQuantity,

            SUM(
                CASE
                    WHEN StageID = 3
                    THEN WasteQuantity
                    ELSE 0
                END
            ) AS PackagingWaste,

            SUM(WasteQuantity)
                AS TotalWasteQuantity

        FROM OrderStageData

        GROUP BY
            OrderID,
            ProductID,
            ProductName
    ),

    ProductSummary AS
    (
        SELECT

            ProductID,
            ProductName,

            SUM(RequestedQuantity)
                AS TotalRequestedQuantity,

            SUM(CuttingQuantity)
                AS CuttingQuantity,

            SUM(CuttingWaste)
                AS CuttingWaste,

            SUM(PaintingQuantity)
                AS PaintingQuantity,

            SUM(PaintingWaste)
                AS PaintingWaste,

            SUM(PackagingQuantity)
                AS PackagingQuantity,

            SUM(PackagingWaste)
                AS PackagingWaste,

            SUM(TotalWasteQuantity)
                AS TotalWasteQuantity

        FROM OrderProductionSummary

        GROUP BY
            ProductID,
            ProductName
    )

    SELECT

        ProductID,
        ProductName,

        ISNULL(
            TotalRequestedQuantity,
            0
        ) AS TotalRequestedQuantity,

        ---------------------------------------------------------
        -- Cutting
        ---------------------------------------------------------

        ISNULL(
            CuttingQuantity,
            0
        ) AS CuttingQuantity,

        ISNULL(
            CuttingWaste,
            0
        ) AS CuttingWaste,

        ISNULL(CuttingQuantity, 0)
        -
        ISNULL(CuttingWaste, 0)
            AS CuttingGoodQuantity,

        ---------------------------------------------------------
        -- Painting
        ---------------------------------------------------------

        ISNULL(
            PaintingQuantity,
            0
        ) AS PaintingQuantity,

        ISNULL(
            PaintingWaste,
            0
        ) AS PaintingWaste,

        ISNULL(PaintingQuantity, 0)
        -
        ISNULL(PaintingWaste, 0)
            AS PaintingGoodQuantity,

        ---------------------------------------------------------
        -- Packaging
        ---------------------------------------------------------

        ISNULL(
            PackagingQuantity,
            0
        ) AS PackagingQuantity,

        ISNULL(
            PackagingWaste,
            0
        ) AS PackagingWaste,

        ---------------------------------------------------------
        -- Final Produced
        ---------------------------------------------------------

        ISNULL(PackagingQuantity, 0)
        -
        ISNULL(PackagingWaste, 0)
            AS FinalProducedQuantity,

        ---------------------------------------------------------
        -- Total Waste
        ---------------------------------------------------------

        ISNULL(
            TotalWasteQuantity,
            0
        ) AS TotalWasteQuantity,

        ---------------------------------------------------------
        -- Remaining
        ---------------------------------------------------------

        CASE
            WHEN
                TotalRequestedQuantity
                -
                (
                    ISNULL(PackagingQuantity, 0)
                    -
                    ISNULL(PackagingWaste, 0)
                ) > 0

            THEN
                TotalRequestedQuantity
                -
                (
                    ISNULL(PackagingQuantity, 0)
                    -
                    ISNULL(PackagingWaste, 0)
                )

            ELSE 0

        END AS RemainingQuantity,

        ---------------------------------------------------------
        -- Production Completion %
        ---------------------------------------------------------

        CAST(
            CASE
                WHEN TotalRequestedQuantity > 0

                THEN
                    (
                        (
                            ISNULL(PackagingQuantity, 0)
                            -
                            ISNULL(PackagingWaste, 0)
                        ) * 100.0
                    )
                    /
                    TotalRequestedQuantity

                ELSE 0
            END
            AS DECIMAL(18,2)
        ) AS ProductionCompletionPercentage,

        ---------------------------------------------------------
        -- Waste %
        ---------------------------------------------------------

        CAST(
            CASE
                WHEN TotalRequestedQuantity > 0

                THEN
                    ISNULL(TotalWasteQuantity, 0)
                    * 100.0
                    /
                    TotalRequestedQuantity

                ELSE 0
            END
            AS DECIMAL(18,2)
        ) AS WastePercentage

    FROM ProductSummary

    ORDER BY
        FinalProducedQuantity DESC,
        ProductName ASC;

END
GO
/****** Object:  StoredProcedure [dbo].[SP_SearchUsers]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_SearchUsers]
    @ID int=NULL,
    @UserName nvarchar(MAX)=NULL,
    @IsActive bit=NULL
AS
BEGIN

SELECT Users.ID, Users.UserName, Users.Email, Users.FullName, Users.CreatedAt,Users.UpdatedAt,  Roles.RoleName,Users.IsActive FROM     Users INNER JOIN                   Roles ON Users.RoleID = Roles.ID
where
(
(@ID is null or Users.ID =@ID)
 and
(@UserName is null or UserName COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @UserName + '%')
 and
(@IsActive is null or Users.IsActive=@IsActive)
)
;
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdatePermissionsByID]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/* 22) SP_UpdatePermissionsByID */
CREATE   PROCEDURE [dbo].[SP_UpdatePermissionsByID]
    @ID int,
    @Name nvarchar(MAX),
    @IsActive bit,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM [Permissions] WHERE [ID] = @ID)
        BEGIN
            SET @Message = N'الصلاحية غير موجودة.'; SET @ErrorType = 2; RETURN;
        END
        IF @Name IS NOT NULL AND LTRIM(RTRIM(@Name)) = ''
        BEGIN
            SET @Message = N'الاسم لا يمكن أن يكون فارغًا.'; SET @ErrorType = 1; RETURN;
        END

        UPDATE [Permissions]
        SET [Name] = COALESCE(@Name,Name),
            [IsActive] = COALESCE(@IsActive,IsActive)
        WHERE [ID] = @ID;

        SET @Message = N'تم تحديث الصلاحية بنجاح.'; SET @ErrorType = 0;

        SELECT [Permissions].[ID], [Permissions].[Code], [Permissions].[Name], [Permissions].[ModuleName], [Permissions].[ActionName], [Permissions].[BitIndex], [Permissions].[BitValue]
        FROM [Permissions] WHERE [ID] = @ID;
    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateProductionOrdersByID]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[SP_UpdateProductionOrdersByID]
     @ID int,
     @StatusID int,
     @Message NVARCHAR(250) OUTPUT,
     @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        IF NOT EXISTS (
            SELECT 1
            FROM ProductionOrders
            WHERE ID = @ID
        )
        BEGIN
            SET @Message = N'الطلبية غير موجودة.';
            SET @ErrorType = 2;
            RETURN;
        END

        IF @StatusID IS NOT NULL
           AND NOT EXISTS (
                SELECT 1
                FROM Statuses
                WHERE ID = @StatusID
                  AND IsActive = 1
           )
        BEGIN
            SET @Message = N'حالة الطلبية غير موجودة أو غير فعالة.';
            SET @ErrorType = 3;
            RETURN;
        END

        UPDATE ProductionOrders
        SET
            StatusID = COALESCE(@StatusID, StatusID),
            UpdatedAt = GETDATE()
        WHERE ID = @ID;

        SET @Message = N'تم تحديث الطلبية بنجاح.';
        SET @ErrorType = 0;

        SELECT
            ProductionOrders.ID,
            ProductionOrders.ProductID,
            ProductionOrders.RequestedQuantity,
            ProductionOrders.StatusID,
            (
                SELECT Users.Email
                FROM Users
                WHERE Users.ID = ProductionOrders.CreatedBy
            ) AS Email,
            ProductionOrders.Notes
        FROM ProductionOrders
        WHERE ProductionOrders.ID = @ID;

    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE() + N' | Line: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateProductionOrderStagesByID]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_UpdateProductionOrderStagesByID]
    @ID int,
    @StatusID int,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        IF NOT EXISTS (
            SELECT 1
            FROM ProductionOrderStages
            WHERE ID = @ID
        )
        BEGIN
            SET @Message = N'مرحلة الطلبية غير موجودة.';
            SET @ErrorType = 2;
            RETURN;
        END

        IF @StatusID IS NOT NULL
           AND NOT EXISTS (
                SELECT 1
                FROM Statuses
                WHERE ID = @StatusID
                  AND IsActive = 1
           )
        BEGIN
            SET @Message = N'حالة المرحلة غير موجودة أو غير فعالة.';
            SET @ErrorType = 3;
            RETURN;
        END

        -- ***** التعديل الجديد: حصر حالة المرحلة بـ 3 قيم فقط *****
        IF @StatusID IS NOT NULL AND @StatusID NOT IN (1, 2, 3)
        BEGIN
            SET @Message = N'حالة المرحلة يجب أن تكون "قيد الانتظار" أو "قيد التنفيذ" أو "مكتملة" فقط. حالتا "متوقفة" و"ملغاة" خاصتان بالطلبية نفسها.';
            SET @ErrorType = 1;
            RETURN;
        END

        UPDATE ProductionOrderStages
        SET StatusID = COALESCE(@StatusID, StatusID)
        WHERE ID = @ID;

        SET @Message = N'تم تحديث مرحلة الطلبية بنجاح.';
        SET @ErrorType = 0;

        SELECT
            ProductionOrderStages.ID,
            ProductionOrderStages.OrderID
        FROM ProductionOrderStages
        WHERE ID = @ID;

    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE() + N' | Line: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateProductionStageEntriesByID]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[SP_UpdateProductionStageEntriesByID]
    @ID int,
    @Notes nvarchar(MAX),
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        IF NOT EXISTS (
            SELECT 1
            FROM ProductionStageEntries
            WHERE ID = @ID
        )
        BEGIN
            SET @Message = N'سجل الإنتاج غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        UPDATE ProductionStageEntries
        SET Notes = COALESCE(@Notes, Notes)
        WHERE ID = @ID;

        SET @Message = N'تم تحديث سجل الإنتاج بنجاح.';
        SET @ErrorType = 0;

        SELECT
            ProductionStageEntries.ID,
            ProductionStageEntries.OrderStageID,
            ProductionStageEntries.Quantity,
            ProductionStageEntries.Notes
        FROM ProductionStageEntries
        WHERE ID = @ID;

    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE() + N' | Line: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateProductionStagesByID]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 23) SP_UpdateProductionStagesByID */
CREATE   PROCEDURE [dbo].[SP_UpdateProductionStagesByID]
    @ID int,
    @Description nvarchar(MAX),
    @IsActive bit,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- تحقق وجود الصف
        IF NOT EXISTS (SELECT 1 FROM [ProductionStages] WHERE [ID] = @ID)
        BEGIN
            SET @Message = N'مرحلة الإنتاج غير موجودة.';
            SET @ErrorType = 2;
            RETURN;
        END

        -- تحقق الأعمدة الأجنبية

        -- تحديث الصف
        UPDATE [ProductionStages]
        SET
            [Description] = COALESCE(@Description,Description),
            [IsActive] = COALESCE(@IsActive,IsActive)
        WHERE [ID] = @ID;

        SET @Message = N'تم تحديث مرحلة الإنتاج بنجاح.';
        SET @ErrorType = 0;

        -- ارجاع الصف المحدث
        SELECT [ProductionStages].[ID], [ProductionStages].[StageName], [ProductionStages].[Description], [ProductionStages].[DisplayOrder]
        FROM [ProductionStages]
        WHERE [ID] = @ID;
    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateProductionStageWastesByID]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[SP_UpdateProductionStageWastesByID]
    @ID int,
    @Notes nvarchar(MAX),
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        IF NOT EXISTS (
            SELECT 1
            FROM ProductionStageWastes
            WHERE ID = @ID
        )
        BEGIN
            SET @Message = N'سجل الهدر غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        UPDATE ProductionStageWastes
        SET Notes = COALESCE(@Notes, Notes)
        WHERE ID = @ID;

        SET @Message = N'تم تحديث سجل الهدر بنجاح.';
        SET @ErrorType = 0;

        SELECT
            ProductionStageWastes.ID,
            ProductionStageWastes.StageEntryID,
            ProductionStageWastes.WasteQuantity,
            ProductionStageWastes.Notes,
            ProductionStageWastes.WasteTypeID,
            ProductionStageWastes.WasteReasonID
        FROM ProductionStageWastes
        WHERE ID = @ID;

    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE() + N' | Line: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateProductsByID]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 24) SP_UpdateProductsByID */
CREATE   PROCEDURE [dbo].[SP_UpdateProductsByID]
    @ID int,
    @Description nvarchar(MAX),
    @IsActive bit,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- تحقق وجود الصف
        IF NOT EXISTS (SELECT 1 FROM [Products] WHERE [ID] = @ID)
        BEGIN
            SET @Message = N'المنتج غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        -- تحقق الأعمدة الأجنبية

        -- تحديث الصف
        UPDATE [Products]
        SET
            [Description] = COALESCE(@Description,Description),
            [IsActive] = COALESCE(@IsActive,IsActive),
            [UpdatedAt]=GETDATE()
        WHERE [ID] = @ID;

        SET @Message = N'تم تحديث المنتج بنجاح.';
        SET @ErrorType = 0;

        -- ارجاع الصف المحدث
        SELECT [Products].[ID], [Products].[ProductName], [Products].[Description]
        FROM [Products]
        WHERE [ID] = @ID;
    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateRolesByID]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 25) SP_UpdateRolesByID */
CREATE   PROCEDURE [dbo].[SP_UpdateRolesByID]
    @ID int,
    @Description nvarchar(MAX),
    @IsActive bit,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- تحقق وجود الصف
        IF NOT EXISTS (SELECT 1 FROM [Roles] WHERE [ID] = @ID)
        BEGIN
            SET @Message = N'الدور غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        -- تحقق الأعمدة الأجنبية

        -- تحديث الصف
        UPDATE [Roles]
        SET
            [Description] = COALESCE(@Description,Description),
            [IsActive] = COALESCE(@IsActive,IsActive),
            [UpdatedAt]=GETDATE()
        WHERE [ID] = @ID;

        SET @Message = N'تم تحديث الدور بنجاح.';
        SET @ErrorType = 0;

        -- ارجاع الصف المحدث
        SELECT [Roles].[ID], [Roles].[RoleName], [Roles].[Description]
        FROM [Roles]
        WHERE [ID] = @ID;
    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateStatusesByID]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 26) SP_UpdateStatusesByID */
CREATE   PROCEDURE [dbo].[SP_UpdateStatusesByID]
    @ID int,
    @Description nvarchar(MAX),
    @IsActive bit,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- تحقق وجود الصف
        IF NOT EXISTS (SELECT 1 FROM [Statuses] WHERE [ID] = @ID)
        BEGIN
            SET @Message = N'الحالة غير موجودة.';
            SET @ErrorType = 2;
            RETURN;
        END

        -- تحقق الأعمدة الأجنبية

        -- تحديث الصف
        UPDATE [Statuses]
        SET
            [Description] = COALESCE(@Description,Description),
            [IsActive] = COALESCE(@IsActive,IsActive),
            [UpdatedAt]=GETDATE()
        WHERE [ID] = @ID;

        SET @Message = N'تم تحديث الحالة بنجاح.';
        SET @ErrorType = 0;

        -- ارجاع الصف المحدث
        SELECT [Statuses].[ID], [Statuses].[StatusName], [Statuses].[Description]
        FROM [Statuses]
        WHERE [ID] = @ID;
    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateUserPassword]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE   PROCEDURE [dbo].[SP_UpdateUserPassword]
    @Email NVARCHAR(500),
    @NewPasswordHash NVARCHAR(500),
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        -- =================================================
        -- Validate Email
        -- =================================================

        IF @Email IS NULL
           OR LTRIM(RTRIM(@Email)) = ''
        BEGIN
            SET @Message =
                N'البريد الإلكتروني مطلوب.';

            SET @ErrorType = 1;

            RETURN;
        END


        -- =================================================
        -- Validate New Password Hash
        -- =================================================

        IF @NewPasswordHash IS NULL
           OR LTRIM(RTRIM(@NewPasswordHash)) = ''
        BEGIN
            SET @Message =
                N'كلمة المرور الجديدة مطلوبة.';

            SET @ErrorType = 1;

            RETURN;
        END


        -- =================================================
        -- Check User
        -- =================================================

        IF NOT EXISTS
        (
            SELECT 1
            FROM Users
            WHERE Email COLLATE SQL_Latin1_General_CP1_CI_AS =
                  @Email COLLATE SQL_Latin1_General_CP1_CI_AS
        )
        BEGIN
            SET @Message =
                N'البريد الإلكتروني غير موجود.';

            SET @ErrorType = 2;

            RETURN;
        END


        -- =================================================
        -- Update Password
        -- =================================================

        UPDATE Users
        SET
            PasswordHash = @NewPasswordHash,
            UpdatedAt = GETDATE()
        WHERE Email COLLATE SQL_Latin1_General_CP1_CI_AS =
              @Email COLLATE SQL_Latin1_General_CP1_CI_AS;


        -- =================================================
        -- Success
        -- =================================================

        SET @Message =
            N'تم تحديث كلمة المرور بنجاح.';

        SET @ErrorType = 0;

    END TRY
    BEGIN CATCH

        SET @Message =
            ERROR_MESSAGE();

        SET @ErrorType = 5;

    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateWasteReasonsByID]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 27) SP_UpdateWasteReasonsByID */
CREATE   PROCEDURE [dbo].[SP_UpdateWasteReasonsByID]
    @ID int,
    @IsActive bit,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- تحقق وجود الصف
        IF NOT EXISTS (SELECT 1 FROM [WasteReasons] WHERE [ID] = @ID)
        BEGIN
            SET @Message = N'سبب الهدر غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        -- تحقق الأعمدة الأجنبية

        -- تحديث الصف
        UPDATE [WasteReasons]
        SET
            [IsActive] = COALESCE(@IsActive,IsActive)
        WHERE [ID] = @ID;

        SET @Message = N'تم تحديث سبب الهدر بنجاح.';
        SET @ErrorType = 0;

        -- ارجاع الصف المحدث
        SELECT [WasteReasons].[ID], [WasteReasons].[NameAr]
        FROM [WasteReasons]
        WHERE [ID] = @ID;
    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[SP_UpdateWasteTypesByID]    Script Date: 8/29/2026 10:48:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* 28) SP_UpdateWasteTypesByID */
CREATE   PROCEDURE [dbo].[SP_UpdateWasteTypesByID]
    @ID int,
    @IsActive bit,
    @Message NVARCHAR(250) OUTPUT,
    @ErrorType INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- تحقق وجود الصف
        IF NOT EXISTS (SELECT 1 FROM [WasteTypes] WHERE [ID] = @ID)
        BEGIN
            SET @Message = N'نوع الهدر غير موجود.';
            SET @ErrorType = 2;
            RETURN;
        END

        -- تحقق الأعمدة الأجنبية

        -- تحديث الصف
        UPDATE [WasteTypes]
        SET
            [IsActive] = COALESCE(@IsActive,IsActive)
        WHERE [ID] = @ID;

        SET @Message = N'تم تحديث نوع الهدر بنجاح.';
        SET @ErrorType = 0;

        -- ارجاع الصف المحدث
        SELECT [WasteTypes].[ID], [WasteTypes].[NameAr]
        FROM [WasteTypes]
        WHERE [ID] = @ID;
    END TRY
    BEGIN CATCH
        SET @Message = ERROR_MESSAGE() + N' | السطر: ' + CAST(ERROR_LINE() AS NVARCHAR);
        SET @ErrorType = 5;
    END CATCH
END
GO
USE [master]
GO
ALTER DATABASE [AluminumProduction] SET  READ_WRITE 
GO
