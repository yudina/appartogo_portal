CREATE TABLE [dbo].[Apartment]
(
	[Id]								uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID(),
	[ApartmentNumber]					VARCHAR(30),
	[TenantId]							uniqueidentifier NULL,
	[PropertyId]						uniqueidentifier NOT NULL,
	[ApartmentType]						VARCHAR(20),
	[Rooms]								INT,
	[Bathrooms]							INT,
	[Size]								VARCHAR(10),
	[HasWater]							BIT,
	[HasHeater]							BIT,
	[HasParking]						BIT,
	[HasFurniture]						BIT,
	[HasAirconditioner]					BIT,
	[HasCable]							BIT,
	[HasInternet]						BIT,
	[AvailibityDate]					DATETIME,
	[Archived]							BIT				NOT NULL DEFAULT 0,
	CONSTRAINT PK_Apartment				PRIMARY KEY(Id),
	CONSTRAINT FK_Apartment_Tenant		FOREIGN KEY(TenantId) REFERENCES Tenant(Id),
	CONSTRAINT FK_Apartment_Property	FOREIGN KEY(PropertyId) REFERENCES Property(Id)

)
