using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrbanAI.Domain.Entities;

namespace UrbanAI.Application.Features.Issues
{
    public class IssueService : IIssueService
    {
        public Task<IEnumerable<Issue>> GetIssuesAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<Issue> GetIssueAsync(int id, string userId)
        {
            throw new NotImplementedException();
        }

        public Task<Issue> CreateIssueAsync(Issue issue, string userId)
        {
            throw new NotImplementedException();
        }

        public Task UpdateIssueAsync(Issue issue, string userId)
        {
            throw new NotImplementedException();
        }

        public Task DeleteIssueAsync(int id, string userId)
        {
            throw new NotImplementedException();
        }
    }
}
