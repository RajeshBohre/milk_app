import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket: Socket = io('http://localhost:8084');

  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }

  getMessages(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('message', (data) => observer.next(data));
    });
  }
}
