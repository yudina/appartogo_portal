using System;
using System.Collections.Generic;
using System.Text;

namespace Appartogo.Core.DAL.Interfaces
{
    public interface IUnitOfWork
    {
        IAccountRepository              Account             { get; }
        IAddressRepository              Address             { get; }
        IApartmentRepository            Apartment           { get; }
        IApplicationRepository          Application         { get; }
        IAttachmentRepository           Attachment          { get; }
        IConversationRepository         Conversation        { get; }
        IListingRepository              Listing             { get; }
        IMessageRepository              Message             { get; }
        IOrganizationRepository         Organization        { get; }
        IOrganizationAccountRepository  OrganizationAccount { get; }
        IPropertyRepository             Property            { get; }
        ITenantRepository               Tenant              { get; }

    }
}
