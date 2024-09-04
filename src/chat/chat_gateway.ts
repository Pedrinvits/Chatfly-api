import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket,Server } from "socket.io";

@WebSocketGateway(3002, { cors : {origin: '*'}})
export class ChatGateway implements OnGatewayConnection,OnGatewayDisconnect{

    @WebSocketServer() server : Server;

    handleConnection(client: Socket, ...args: any[]) {
        client.emit('user-join',{
            message : `New user joined the chat ${client.id}`
        })
        
    }
    handleDisconnect(client: Socket, ...args: any[]) {
        console.log('client disconnected, id = ',client.id);
        
    }
    @SubscribeMessage('New message')
    handleNewMessage(client : Socket,message : any){
        // conseguimos capturar as informacoes da pessoa que enviou
        // console.log(message);
        // client.emit('reply','this is a reply')
        this.server.emit('message', message)
    }
}