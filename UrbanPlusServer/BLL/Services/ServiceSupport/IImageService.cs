using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Services.ServiceSupport
{
    public interface IImageService
    {
        string Save(IFormFile file);
        void Delete(string fileName);
    }
}

