import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import getMoodRouter from './src/routes/getmood.js';
import getMusicRouter from './src/routes/getmusic.js';
import { Config } from './config/appconfig.js';

export class Server {
	private config: Config;
	private app: express.Application;
	private port: number;

	constructor() {
		this.config = new Config();
		this.app = express();
		this.app.use(express.json());
		this.port = this.config.port;

		this.app.use('/getmusic', getMusicRouter);
		this.app.use('/getmood', getMoodRouter);

		this.app.get('/', (req: Request, res: Response) => {
		res.json({ message: 'Hello from Express!' });
		});

		this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		console.error(err.stack);
		res.status(500).json({ message: 'Something went wrong!' });
		next();
		});

		this.app.listen(this.port, '0.0.0.0',() => {
			console.log(`Server running on http://localhost:${this.port}`);
		});
	}
}

new Server();