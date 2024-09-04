import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

@WebSocketGateway(3002, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;

    handleConnection(client: Socket, ...args: any[]) {
        client.emit('user-join', {
            message: `New user joined the chat ${client.id}`,
            userId: client.id
        });
    }

    handleDisconnect(client: Socket, ...args: any[]) {
        console.log('client disconnected, id : ', client.id);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, room: string) {
        client.join(room);
        client.emit('roomJoined', room);
        this.server.to(room).emit('user-join', {
            message: `User ${client.id} has joined room ${room}`,
            userId: client.id
        });
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, room: string) {
        client.leave(room);
        this.server.to(room).emit('user-leave', {
            message: `User ${client.id} has left room ${room}`,
            userId: client.id
        });
    }

    @SubscribeMessage('New message')
    handleNewMessage(client: Socket, { room, content }: { room: string, content: string }) {
        this.server.to(room).emit('message', { content, userId: client.id });
    }
}
