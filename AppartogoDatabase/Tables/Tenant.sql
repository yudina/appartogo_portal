CREATE TABLE [dbo].[Tenant]
(
	[Id]								uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID(),
	[AccountId]							uniqueidentifier NOT NULL,
	[CreditScore]						INT,
	[RentalInsuranceNumber]				VARCHAR(50),
	[ActiveLease]						BIT				 NOT NULL DEFAULT 0,
	CONSTRAINT PK_Tenant				PRIMARY KEY(Id),
	CONSTRAINT FK_Tenant_Account		FOREIGN KEY(AccountId) REFERENCES Account(Id)
)
