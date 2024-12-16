import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection: signalR.HubConnection;

  constructor() {
    this.startConection();
  }

  public startConection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5124/hospitalHub')
    .build();

    this.hubConnection
      .start()
      .then(() => console.log('Conexión SignalR iniciada'))
      .catch((err) => console.error('Error al conectar con SignalR', err));
    
  }

  public addMessageListener(): void {
    this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
      console.log(`Mensaje de ${user}: ${message}`);
    });
  }

  public listenForUpdates(callback: (tableName: string) => void): void {
    this.hubConnection.on('TableUpdated', (tableName: string) => {
      callback(tableName);
    });
  }
}
