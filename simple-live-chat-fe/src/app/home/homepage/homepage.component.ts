import { environment } from './../../../environments/environment';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';

export interface SimplePayload  {
  id: string,
  payload : any;
  error? : any;
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit{
  private socket: Socket
  message: string = '';
  messages: string[];
  users: string[];

  constructor() {
    this.socket = io(environment.backendUrl);
  }
  ngOnInit(): void {
    this.messages = [];
    this.socket.on('connect', function() {
      console.log('Connected');
    });

    this.socket.on('server:messageAdded', data => this.handleOnMessageAdded(data));

    this.socket.on('server:userConnected', data => this.handleOnUserConnected(data));

    this.socket.on('server:userDisconnected', data => this.handleOnUserDisconnected(data));

    this.socket.on('exception', function(data) {
      console.log('event', data);
    });
    this.socket.on('disconnect', function() {
      console.log('Disconnected');
    });
  }

  handleOnUserConnected(data: SimplePayload): void {
    this.users = data.payload.users;
    console.log("Il server mi dice che ci sono " + data.payload.length + " utenti connessi, compreso me.")
  }

  handleOnUserDisconnected(data: SimplePayload): void {
    this.users = data.payload;
    console.log("Il server mi dice che ci sono " + data.payload.length + " utenti connessi, compreso me.")
  }

  addChat(){
    if (this.message.trim().length) {
      this.socket.emit("client:addMessage", {id: this.socket.id, payload: this.message}, (res : SimplePayload) => {
        if ("error" in res) {
          // handle the error
          return;
        }
        console.log("Server return"+res.payload);
        //this.messages.push("["+this.socket.id+"]:"+res.payload);
        // this.messages.push("[server]:"+ res.payload);
      });
      this.message = '';
    }
  }

  handleOnMessageAdded(data : SimplePayload){
    console.log('event', data);
    this.messages.push("["+data.id+"]:"+ data.payload);
  }

}
