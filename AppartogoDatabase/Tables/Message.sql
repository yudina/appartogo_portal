CREATE TABLE [dbo].[Message]
(
	[Id]								uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID(),
	[ConversationId]					uniqueidentifier NOT NULL,
	[SenderId]							uniqueidentifier NOT NULL,
	[ReceiverId]						uniqueidentifier NOT NULL,
	[Text]								VARCHAR(1000),
	[HasAttachment]						BIT				 NOT NULL DEFAULT 0,
	[SentDate]							DATETIME		 NOT NULL DEFAULT CURRENT_TIMESTAMP,
	[IsPartOfApplication]				BIT				 NOT NULL DEFAULT 0,
	[WasReceived]						BIT				 NOT NULL DEFAULT 0,
	[Archived]							BIT				 NOT NULL DEFAULT 0,
	CONSTRAINT PK_Message				PRIMARY KEY(Id),
	CONSTRAINT FK_Message_Conversation	FOREIGN KEY(ConversationId)		REFERENCES Conversation(Id),
	CONSTRAINT FK_Message_Account_S		FOREIGN KEY(SenderId)			REFERENCES Account(Id),
	CONSTRAINT FK_Message_Account_R		FOREIGN KEY(ReceiverId)			REFERENCES Account(Id)

)
