using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UrbanAI.Domain.Entities;
using UrbanAI.Domain.Interfaces;
using UrbanAI.Infrastructure.Data;

namespace UrbanAI.Infrastructure.Repositories
{
    public class IssueRepository : IIssueRepository
    {
        private readonly ApplicationDbContext _context;

        public IssueRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Issue?> GetByIdAsync(Guid id)
        {
            return await _context.Issues.FindAsync(id);
        }

        public async Task<IEnumerable<Issue>> GetAllAsync()
        {
            return await _context.Issues.ToListAsync();
        }

        public async Task AddAsync(Issue issue)
        {
            await _context.Issues.AddAsync(issue);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Issue issue)
        {
            _context.Entry(issue).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Issue issue)
        {
            _context.Issues.Remove(issue);
            await _context.SaveChangesAsync();
        }
    }
}
