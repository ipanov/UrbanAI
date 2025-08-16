using Microsoft.EntityFrameworkCore;
using UrbanAI.Domain.Entities;
using UrbanAI.Domain.Interfaces;
using UrbanAI.Infrastructure.Data;

namespace UrbanAI.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User> CreateAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _context.Users
                .Include(u => u.ExternalLogins)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> GetByExternalLoginAsync(string provider, string externalId)
        {
            return await _context.Users
                .Include(u => u.ExternalLogins)
                .FirstOrDefaultAsync(u => u.ExternalLogins.Any(l => l.Provider == provider && l.ExternalId == externalId));
        }

        public async Task<User> UpdateAsync(User user)
        {
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task DeleteAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users
                .Include(u => u.ExternalLogins)
                .ToListAsync();
        }
    }
}
