import { Router } from 'express';
import express from "express";
import { Lib } from '../lib/lib.js';
import { LibAwsBedRock } from '../lib/lib-aws.js';
import { Config } from '../../config/appconfig.js';

export class GetMoodRouter {
	public router: Router;
    private lib: Lib;
    private config: Config;
	private app: express.Application;
    private libAwsBedRock: LibAwsBedRock;

    constructor() {
        this.router = Router();
        this.lib = new Lib();
        this.config = new Config();
		this.app = express();
		this.app.use(express.json());
        this.libAwsBedRock = new LibAwsBedRock();


		// ルート呼び出し
		this.setRoutes();
    }

	/**
	 * ルート遷移時処理
	 */
	private setRoutes() {
		this.router.get('/', (_req: express.Request, res: express.Response) => {
				res.json({ message: 'use POST /getmood with JSON body: { "message": "..." }' });
		});

		this.router.post('/', async (request: express.Request, response: express.Response) => {
            const message = request.body?.message;
			
			// messageが空の場合は400エラーを返す
            if ( this.lib.isNullOrEmpty(message)) {
                response.status(400).json({ message: 'message is required' });
                return;
            }
            await this.getMood(message, response);
        });
	}

	/**
	 * 感情分析を行う処理
	 * @param message ユーザーからのメッセージ
	 * @param res レスポンスオブジェクト
	 */
	private async getMood(message: string, res: express.Response) {
		const system = 
		`
		受信したメッセージを、以下の6種類の感情のいずれか1つに分類してください。

		- fan
		- sad
		- angry
		- fear
		- surprise
		- disgust

		また、文章から感情の強さを推測し、0〜10の整数で表してください。

		以下のJSON形式のみを返してください。
		説明文、Markdown、コードブロック、その他の文字列は一切不要です。

		{
		"mindKind": "fan",
		"intensity": 8
		}
		`;
		
		try {
			const response = await this.libAwsBedRock.converseCommand("user", message, system);
			const resultJson = this.lib.removeJsonCodeBlock(response);
			const result:string = JSON.parse(resultJson);
			console.log(result);

			res.status(200).json(result);
		} catch (error) {
			console.error(error);
			res.status(500).json({ レスポンス: 'Internal Server Error' });
		}
	}
}

export default new GetMoodRouter().router;