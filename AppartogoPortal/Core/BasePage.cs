using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Extensions.Options;
using System;

namespace AppartogoPortal.Core
{
    public abstract class BasePage<T> : RazorPage<T>
    {
        private Uri uri;
        private bool? debug;

        public bool Debug
        {
            get
            {
                if (debug == null)
                {
                    var appSettings = GetService<IOptions<AppSettings>>();
                    debug = appSettings.Value.Debug;
                }

                return debug.Value;
            }
        }

        public string Language => Context.Request.GetLanguage();

        public Uri Uri
        {
            get
            {
                if (uri == null)
                    uri = new Uri(Context.Request.GetDisplayUrl());
                return uri;
            }
        }

        public string Host => $"{Uri?.Scheme}://{Uri?.Host}{(Uri?.IsDefaultPort ?? true ? string.Empty : ":" + Uri?.Port.ToString())}";

        private TService GetService<TService>()
        {
            return (TService)Context.RequestServices.GetService(typeof(TService));
        }
    }
}