
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export interface SimplePayload  {
  id: string,
  payload : any;
  error? : any;
}
@WebSocketGateway(
  {
    cors: {
      origin: '*',
    },
  }
)
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  users : string[] = [];
  messages : string[] = [];

  handleDisconnect(client: any) {
    const index = this.users.indexOf(client.id, 0);
    if (index > -1) {
      this.users.splice(index, 1);
    }
    console.log("client disconnected:"+JSON.stringify(client.id));
    let payload : SimplePayload = {
      id : "SERVER",
      payload : this.users
    };
    this.server.emit('server:userDisconnected',  payload);
  }

  handleConnection(client : Socket, ...args: any[]) {
    console.log("client connected:"+JSON.stringify(client.id));
    this.users.push(client.id);
    let payload : SimplePayload = {
      id : "SERVER",
      payload : {
        users: this.users
      }
    };
    
    this.server.emit('server:userConnected',  payload);
  }

  @WebSocketServer() server: Server

  @SubscribeMessage('client:addMessage')
  handleAddMessages(@MessageBody() mesPayload: SimplePayload,  @ConnectedSocket() client: Socket): SimplePayload {
    console.log(mesPayload.payload);
    this.messages = mesPayload.payload;
    this.server.emit('server:messageAdded',  mesPayload)
    return mesPayload;
  }

  @SubscribeMessage('client:getMessages')
  handleGetMessages(@MessageBody() mesPayload: SimplePayload,  @ConnectedSocket() client: Socket): SimplePayload {
    console.log(mesPayload.payload);
    let payload : SimplePayload = {
      id: "Server",
      payload: this.messages
    }
    return payload;
  }
}
