using System;

namespace UrbanAI.Domain.Entities
{
    public enum IssueStatus
    {
        Open,
        InProgress,
        Resolved,
        Closed
    }

    public class Issue
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }
        public IssueStatus Status { get; set; }
        public string? Classification { get; set; }
        public string? ReportedBy { get; set; }
        public DateTimeOffset ReportedDate { get; set; }
        public DateTimeOffset LastUpdatedDate { get; set; }
        public string? ResolutionDetails { get; set; }

        public Issue()
        {
            Id = Guid.NewGuid();
            ReportedDate = DateTimeOffset.UtcNow;
            LastUpdatedDate = DateTimeOffset.UtcNow;
            Status = IssueStatus.Open;
        }
    }
}
