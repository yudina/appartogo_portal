CREATE TABLE [dbo].[Listing]
(
	[Id]								uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID(),
	[ApartmentId]						uniqueidentifier NOT NULL,
	[Titre]								VARCHAR(250),
	[Description]						VARCHAR(1000),
	[Rent]								INT,
	[PostedDateTime]					DATETIME		 NOT NULL DEFAULT CURRENT_TIMESTAMP,
	[Archived]							BIT				 NOT NULL DEFAULT 0,
	CONSTRAINT PK_Listing				PRIMARY KEY(Id),
	CONSTRAINT FK_Listing_ApartmentId	FOREIGN KEY(ApartmentId) REFERENCES Apartment(Id)
)
