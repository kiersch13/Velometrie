using System.Threading.Tasks;
using App.Models;

namespace App.Services
{
    public interface IStravaWebhookService
    {
        Task HandleEventAsync(StravaWebhookEvent webhookEvent);
    }
}
