CREATE TABLE [dbo].[ApplicationStatus]
(
	[Id]		INT NOT NULL IDENTITY(0,1),
	[Status]	VARCHAR(50) NOT NULL,
	CONSTRAINT	PK_ApplicationStatus	PRIMARY KEY(Id)
)