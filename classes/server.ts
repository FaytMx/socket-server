import express from 'express';
import { SERVER_PORT } from '../global/enviroment';
import socketIo from 'socket.io';
import http from 'http';

import * as socket from '../sockets/socket';

export default class Server {
    private static _instance: Server;
    public app: express.Application;
    public port: number;
    public io: socketIo.Server;
    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server(this.app);
        this.io = socketIo(this.httpServer);
        this.escucharsockets();
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private escucharsockets() {
        console.log('Escuchando conexiones - sockets');
        this.io.on('connection', cliente => {
            // console.log('Cliente conectado');
            console.log(cliente.id);
            //conectar cliente
            socket.conectarCliente(cliente);
            //configurar usuario
            socket.configurarUsuario(cliente, this.io);

            //mensajes
            socket.mensaje(cliente, this.io);

            //desconectar cliente
            socket.desconectar(cliente);

            //configurar usuario
            socket.configurarUsuario(cliente, this.io);
           
        })
    }

    start(callback: Function) {
        this.httpServer.listen(this.port, callback());
    }
}