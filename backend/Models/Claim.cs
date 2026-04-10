using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PromptPad.API.Models
{
    public class Claim
    {
        public int Id { get; private set; }
        [Required]
        [MaxLength(100)]
        public string Key { get; private set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; private set; }

        // Navigation properties
        public virtual List<RoleClaim> RoleClaims { get; private set; } = new();

        private Claim() { }

        public static Claim Create(
            string key,
            string name)
        {
            if (string.IsNullOrWhiteSpace(key))
                throw new ArgumentException("Chave não pode estar vazia");

            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Nome não pode estar vazio");

            return new Claim
            {
                Key = key,
                Name = name
            };
        }

        public static Claim CreateSeed(
            int id,
            string key,
            string name)
        {
            var claim = Create(key, name);
            claim.Id = id;

            return claim;
        }
    }
}
