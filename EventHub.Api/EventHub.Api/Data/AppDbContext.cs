using EventHub.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Data.Entity;

namespace EventHub.Api.Data
{
    public class AppDbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public Microsoft.EntityFrameworkCore.DbSet<User> Users => Set<User>();
        public Microsoft.EntityFrameworkCore.DbSet<Event> Events => Set<Event>();
        public Microsoft.EntityFrameworkCore.DbSet<Comment> Comments => Set<Comment>();
    }
}
