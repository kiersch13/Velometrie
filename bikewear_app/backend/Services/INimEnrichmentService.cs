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
    }
}
