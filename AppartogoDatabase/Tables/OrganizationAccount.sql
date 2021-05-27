CREATE TABLE [dbo].[OrganizationAccount]
(
	[Id]											uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID(),
	[AccountId]										uniqueidentifier NOT NULL,
	[OrganizationId]								uniqueidentifier NOT NULL,
	CONSTRAINT PK_OrganizationAccount				PRIMARY KEY(Id),
	CONSTRAINT FK_OrganizationAccount_Account		FOREIGN KEY(AccountId)			REFERENCES Account(Id),
	CONSTRAINT FK_OrganizationAccount_Organization	FOREIGN KEY(OrganizationId)		REFERENCES Organization(Id)
)
