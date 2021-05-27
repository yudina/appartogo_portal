CREATE TABLE [dbo].[Account]
(
	[Id]								uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID(),
	[AddressId]							uniqueidentifier NOT NULL,
	[Email]								VARCHAR(50),
	[FirstName]							VARCHAR(50),
	[LastName]							VARCHAR(50),
	[PhoneNumber]						VARCHAR(10),
	[ProfilePictureUrl]					VARCHAR(120),
	CONSTRAINT PK_Account				PRIMARY KEY(Id),
	CONSTRAINT FK_Account_Address		FOREIGN KEY(AddressId)	REFERENCES Address(Id)
)
