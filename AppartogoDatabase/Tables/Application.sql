CREATE TABLE [dbo].[Application]
(
	[Id]								uniqueidentifier	NOT NULL DEFAULT NEWSEQUENTIALID(),
	[AccountId]							uniqueidentifier	NOT NULL,
	[ListingId]							uniqueidentifier	NOT NULL,
	[ConsentForCreditCheck]				BIT					NOT NULL,
	[WantsRentalInsurance]				BIT					NOT NULL,
	[Status]							INT					NOT NULL,
	[ApplicationDate]					DATETIME			NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT CHK_status				CHECK ([Status]>=0 AND [Status]<3),
	CONSTRAINT PK_Application			PRIMARY KEY(Id),
	CONSTRAINT FK_Application_Account	FOREIGN KEY(AccountId) REFERENCES Account(Id),
	CONSTRAINT FK_Application_Listing	FOREIGN KEY(ListingId) REFERENCES Listing(Id)

)
