using System.Threading.Tasks;
using App.Models;

namespace App.Services
{
    public interface INimEnrichmentService
    {
        /// <summary>
        /// Enriches a partial TeilVorlage with AI-generated data from Nvidia NIM.
        /// Only empty/null fields are populated; user-provided values are preserved.
        /// Returns the same object (modified in place) for convenience.
        /// If no API key is configured the object is returned unchanged.
        /// </summary>
        Task<TeilVorlage> EnrichAsync(TeilVorlage teilVorlage);
    }
}
