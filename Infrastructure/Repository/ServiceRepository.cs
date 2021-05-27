using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Appartogo.Core.DAL.Interfaces;

namespace Infrastructure.Repository
{
    public static class ServiceRepository
    {
        public static void AddRepository(this IServiceCollection services)
        {
            services.AddTransient <IAccountRepository            , AccountRepository>();
            services.AddTransient <IAddressRepository            , AddressRepository> ();
            services.AddTransient <IApartmentRepository          , ApartmentRepository> ();
            services.AddTransient <IApplicationRepository        , ApplicationRepository> ();
            services.AddTransient <IAttachmentRepository         , AttachmentRepository> ();
            services.AddTransient <IConversationRepository       , ConversationRepository> ();
            services.AddTransient <IListingRepository            , ListingRepository>();
            services.AddTransient <IMessageRepository            , MessageRepository> ();
            services.AddTransient <IOrganizationRepository       , OrganizationRepository> ();
            services.AddTransient <IOrganizationAccountRepository, OrganizationAccountRepository> ();
            services.AddTransient <IPropertyRepository           , PropertyRepository> ();
            services.AddTransient <ITenantRepository             , TenantRepository>();
            services.AddTransient <IUnitOfWork                   , UnitOfWork>();
        }
    }
}
