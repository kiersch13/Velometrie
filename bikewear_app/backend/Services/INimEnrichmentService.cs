using System.Threading.Tasks;
using App.Models;

namespace App.Services
{
    public interface INimEnrichmentService
    {
        /// <summary>
        /// Uses the Nvidia NIM AI API to enrich a partially-filled TeilVorlage.
        /// The caller provides at minimum a Name; all other fields will be
        /// completed / corrected by the AI.
        /// </summary>
        Task<TeilVorlage> EnrichAsync(TeilVorlage partial);

        /// <summary>
        /// Checks whether the input looks like a real bicycle wear part.
        /// Returns (true, "") when valid.
        /// Returns (false, grund) when rejected — grund is a German explanation.
        /// On any error (API failure, missing key, parse failure) returns (true, "") — fail open.
        /// </summary>
        Task<(bool IsValid, string Grund)> ValidateAsync(TeilVorlage partial);
    }
}
