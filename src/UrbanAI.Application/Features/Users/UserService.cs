using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrbanAI.Domain.Entities; // Correct using directive

namespace UrbanAI.Application.Features.Users
{
    public class UserService : IUserService
    {
        public Task<User> GetOrCreateAnonymousUserAsync(string provider, string externalId)
        {
            throw new NotImplementedException();
        }
    }
}
