using System.ComponentModel.DataAnnotations;

namespace PromptPad.API.Models
{
    public class Role
    {
        public int Id { get; private set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; private set; }
        [MaxLength(100)]
        public string? Description { get; private set; }

        // Navegação
        public virtual List<RoleClaim> RoleClaims { get; private set; } = new();
        public virtual List<User>? Users { get; private set; } = new();

        private Role() { }

        public static Role Create(
            string name,
            string? description = null)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Nome não pode estar vazio");

            return new Role
            {
                Name = name,
                Description = description
            };
        }

        public static Role CreateSeed(
            int id,
            string name,
            string? description = null)
        {
            var role = Create(name, description);
            role.Id = id;

            return role;
        }

        public void UpdateName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Nome não pode estar vazio");

            Name = name;
        }
        public void UpdateDescription(string? description)
        {
            Description = description;
        }
        public void UpdateClaims(IEnumerable<int> claimIds)
        {
            var newClaims = claimIds.ToHashSet();

            RoleClaims.RemoveAll(rc => !newClaims.Contains(rc.ClaimId));

            var existingClaimIds = RoleClaims
                .Select(rc => rc.ClaimId)
                .ToHashSet();

            var claimsToAdd = newClaims.Except(existingClaimIds);

            foreach (var claimId in claimsToAdd)
            {
                RoleClaims.Add(RoleClaim.Create(Id, claimId));
            }
        }
    }
}
