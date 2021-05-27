CREATE TABLE [dbo].[Property]
(
	[Id]								uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID(),
	[AddressId]							uniqueidentifier NOT NULL,
	[OrganizationId]					uniqueidentifier NOT NULL,
	[ApartmentCount]					INT,
	[CanSmoke]							BIT,
	[AnimalsFriendly]					BIT,
	[Archived]							BIT				 NOT NULL DEFAULT 0,
	CONSTRAINT PK_Property				PRIMARY KEY(Id),
	CONSTRAINT FK_Property_Address		FOREIGN KEY(AddressId)		REFERENCES Address(Id),
	CONSTRAINT FK_Property_Organization FOREIGN KEY(OrganizationId) REFERENCES Organization(Id)

)
