CREATE TABLE [dbo].[Address]
(
	[Id]					uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID(),
	[CivicNumber]			VARCHAR(30),
	[StreetName]			VARCHAR(50),
	[City]					VARCHAR(50),
	[PostalCode]			VARCHAR(10),
	[Country]				VARCHAR(75),
	[State]					VARCHAR(50),
	[ApartmentNumber]		VARCHAR(30),
	CONSTRAINT PK_Address	PRIMARY KEY(Id)
)
