CREATE TABLE [dbo].[Conversation]
(
	[Id]									uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID(),
	[ListingId]								uniqueidentifier NOT NULL,
	[CreatedById]							uniqueidentifier NOT NULL,
	[OtherParticipantId]					uniqueidentifier NOT NULL,
	[Archived]								BIT				 NOT NULL DEFAULT 0,
	CONSTRAINT PK_Conversation				PRIMARY KEY(Id),
	CONSTRAINT FK_Conversation_Account		FOREIGN KEY(CreatedById) REFERENCES Account(Id),
	CONSTRAINT FK_Conversation_Account_O	FOREIGN KEY(OtherParticipantId) REFERENCES Account(Id),
	CONSTRAINT FK_Conversation_Listing		FOREIGN KEY(ListingId)	 REFERENCES Listing(Id)
)
