using Microsoft.AspNetCore.SignalR;

namespace ApiHospital.Hubs 
{
    public class HospitalHub : Hub
    {

        public async Task NotifyTableUpdate(string tableName) {
            await Clients.All.SendAsync("TableUpdated", tableName);
        }
        
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task SendToSpecific(string conectionId, string message)
        {
            await Clients.Client(conectionId).SendAsync("RecieveMessage", message);
        }
    }
}