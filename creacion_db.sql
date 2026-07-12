-- 1. CREACIÓN DE LA BASE DE DATOS (Opcional pero muy profesional)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'RicaInventoryDb')
BEGIN
    CREATE DATABASE [RicaInventoryDb];
END
GO

USE [RicaInventoryDb]
GO

-- 2. TABLA DE USUARIOS
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Username] [nvarchar](50) NOT NULL,
    [PasswordHash] [nvarchar](256) NOT NULL,
    [Role] [nvarchar](20) NOT NULL,
    [CreatedAt] [datetime2](7) NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY]
GO

-- Crear el índice único para evitar usernames duplicados (súper importante para el Login)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Username' AND object_id = OBJECT_ID('[dbo].[Users]'))
BEGIN
    CREATE UNIQUE INDEX [IX_Users_Username] ON [dbo].[Users] ([Username]);
END
GO

-- 3. TABLA DE PRODUCTOS (Ya incluye los campos finales de imagen y activación)
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [Description] [nvarchar](500) NOT NULL,
    [Quantity] [int] NOT NULL,
    [CreatedAt] [datetime2](7) NOT NULL,
    [UpdatedAt] [datetime2](7) NOT NULL,
    [ImageUrl] [nvarchar](max) NULL,
    [Active] [bit] NOT NULL,
    [IsDesactivate] [bit] NOT NULL,
    CONSTRAINT [PK_Products] PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-- 4. RESTRICCIONES POR DEFECTO
ALTER TABLE [dbo].[Products] ADD DEFAULT (CONVERT([bit],(1))) FOR [Active]
GO
ALTER TABLE [dbo].[Products] ADD DEFAULT (CONVERT([bit],(0))) FOR [IsDesactivate]
GO