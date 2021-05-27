using System;
using System.Collections.Generic;
using System.Text;
using Appartogo.Core.DAL.Interfaces;
using System.Threading.Tasks;
using System.Data.SqlClient;

namespace Infrastructure.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        public UnitOfWork(  IAccountRepository accountRepository,                           IAddressRepository addressRepository,
                            IApartmentRepository apartmentRepository,                       IApplicationRepository applicationRepository,
                            IAttachmentRepository attachmentRepository,                     IConversationRepository conversationRepository,
                            IListingRepository listingRepository,                           IMessageRepository messageRepository,
                            IOrganizationRepository organizationRepository,                 IOrganizationAccountRepository organizationAccountRepository,
                            IPropertyRepository propertyRepository,                         ITenantRepository tenantRepository)
        {
            Account                 = accountRepository;
            Address                 = addressRepository;
            Apartment               = apartmentRepository;
            Application             = applicationRepository;
            Attachment              = attachmentRepository;
            Conversation            = conversationRepository;
            Listing                 = listingRepository;
            Message                 = messageRepository;
            Organization            = organizationRepository;
            OrganizationAccount     = organizationAccountRepository;
            Property                = propertyRepository;
            Tenant                  = tenantRepository;
        }

        public IAccountRepository               Account             { get; }
        public IAddressRepository               Address             { get; }
        public IApartmentRepository             Apartment           { get; }
        public IApplicationRepository           Application         { get; }
        public IAttachmentRepository            Attachment          { get; }
        public IConversationRepository          Conversation        { get; }
        public IMessageRepository               Message             { get; }
        public IListingRepository               Listing             { get; }
        public IOrganizationRepository          Organization        { get; }
        public IOrganizationAccountRepository   OrganizationAccount { get; }
        public IPropertyRepository              Property            { get; }
        public ITenantRepository                Tenant              { get; }
    }
}
