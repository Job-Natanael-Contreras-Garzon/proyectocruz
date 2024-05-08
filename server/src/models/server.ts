import  express, {Application}  from "express";
import cors from 'cors'
import routesProducto from '../routes/producto';
import routerUser from '../routes/user';
import { User } from "./User";


class Server{
    private app: Application;
    private port: String;

    constructor(){
        this.app = express();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.midlewares();
        this.routes();
        this.dbConnect();
    }

    listen(){
        this.app.listen(this.port,() => {
            console.log('Aplicacion corriendo en el puerto ' + this.port);
        })
    }

    routes(){
        this.app.use('/api/producto', routesProducto);
        this.app.use('/api/users',routerUser);
    }

    midlewares(){
        this.app.use(express.json());
        //cors
        this.app.use(cors())
    }

    async dbConnect(){
        try {
            await User.sync();
            console.log('Base conectada con existo');
        } catch (error) {
            console.log('Error en la base de datos: ',error);
        }
    }

}

export default Server;