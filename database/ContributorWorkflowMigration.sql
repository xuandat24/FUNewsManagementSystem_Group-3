-- SAFE MIGRATION for existing FUNMS_Group3 database.
-- DO NOT rerun FUNMS-Query.sql against a database with data: it DROPS the database.
USE FUNMS_Group3;
GO

IF COL_LENGTH('dbo.NewsArticle', 'WorkflowStatus') IS NULL
BEGIN
    ALTER TABLE dbo.NewsArticle ADD WorkflowStatus NVARCHAR(30) NULL;
END;
GO

IF COL_LENGTH('dbo.NewsArticle', 'ReviewFeedback') IS NULL
BEGIN
    ALTER TABLE dbo.NewsArticle ADD ReviewFeedback NVARCHAR(MAX) NULL;
END;
GO

-- Preserve all pre-existing articles as published.
UPDATE dbo.NewsArticle
SET WorkflowStatus = N'PUBLISHED'
WHERE WorkflowStatus IS NULL;
GO
