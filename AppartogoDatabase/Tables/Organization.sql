CREATE TABLE [dbo].[Organization]
(
	[Id]								uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID(),
	[AddressId]							uniqueidentifier NOT NULL,
	[Name]								VARCHAR(50)	NOT NULL,
	CONSTRAINT PK_Organization			PRIMARY KEY(Id),
	CONSTRAINT FK_Organization_Address	FOREIGN KEY(AddressId) REFERENCES Address(Id)
)
