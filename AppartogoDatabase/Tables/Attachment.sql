CREATE TABLE [dbo].[Attachment]
(
	[Id]									uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID(),
	[MessageId]								uniqueidentifier NULL,
	[ApplicationId]							uniqueidentifier NULL,
	[ListingId]								uniqueidentifier NULL,
	[Name]									VARCHAR(50) NOT NULL,
	[Type]									VARCHAR(20),
	CONSTRAINT PK_Attachment				PRIMARY KEY(Id),
	CONSTRAINT FK_Attachment_Message		FOREIGN KEY(MessageId) REFERENCES Message(Id),
	CONSTRAINT FK_Attachment_Application	FOREIGN KEY(ApplicationId) REFERENCES Application(Id),
	CONSTRAINT FK_Attachment_Listing		FOREIGN KEY(ListingId) REFERENCES Listing(Id)
)
