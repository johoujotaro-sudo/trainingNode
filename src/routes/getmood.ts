import { Router } from 'express';
import express from "express";
import { Lib } from '../lib.js';
import { Config } from '../../config/appconfig.js';
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

export class GetMoodRouter {
	public router: Router;
    private lib: Lib;
    private config: Config;
    private bedrockClient: BedrockRuntimeClient;
	private command: ConverseCommand;
	private app: express.Application;
    private region: string;
    private modelId: string;

    constructor() {
        this.router = Router();
        this.lib = new Lib();
        this.config = new Config();
		this.app = express();
		this.app.use(express.json());

		this.region = this.config.aws.region as string;
		this.modelId = this.config.aws.modelId as string;

        this.bedrockClient = new BedrockRuntimeClient({
            region: this.region,
			credentials: {
            accessKeyId: this.config.aws.accessKeyId as string,
            secretAccessKey: this.config.aws.secretAccessKey as string
        },
        });

		this.command = new ConverseCommand({
			modelId: this.config.aws.modelId as string,
			messages: [],
		});

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
		const baseText = "以下の文章の感情を、喜び、悲しみ、怒り、恐れ、驚き、嫌悪の6つから分類してください。回答は感情名だけを返してください。";
		const messageWithBaseText = `${baseText}\n\n文章: ${message}`;
		const command = new ConverseCommand({
			modelId: this.modelId,
			messages: [
			{
				role: "user",
				content: [
				{
					text: messageWithBaseText,
				},
				],
			},
			],
		});
		try {
			const response = await this.bedrockClient.send(command);

			const text = response.output?.message?.content
				?.find(content => content.text !== undefined)
				?.text
				?.trim();

			if (!text) {
				res.status(502).json({
					message: "Bedrockから回答テキストを取得できませんでした",
				});
				return;
			}

			res.status(200).json({
				text,
				id: 1,
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ レスポンス: 'Internal Server Error' });
		}
	}
}

export default new GetMoodRouter().router;