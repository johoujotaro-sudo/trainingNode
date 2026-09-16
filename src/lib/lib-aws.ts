import { Config } from "../../config/appconfig.js";
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { Lib } from "./lib.js";
import { S3Client } from "@aws-sdk/client-s3";
export class LibAwsBedRock {
    private config: Config;
    private lib: Lib;
    public accessKeyId: string;
    public secretAccessKey: string;
    private bedrockClient: BedrockRuntimeClient;
    private modelId: string;

    constructor() {
        this.config = new Config();
        this.lib = new Lib();
        this.accessKeyId = this.config.aws.accessKeyId as string;
        this.secretAccessKey = this.config.aws.secretAccessKey as string;
        this.bedrockClient = new BedrockRuntimeClient({
            region: this.config.aws.region as string,
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey
            },
        });
        this.modelId = this.config.aws.bedrock.modelId as string;
    }

    /**
     * Bedrockにリクエスト送信/レスポンス取得
     * @param role ロール情報。
     * @param text メッセージの内容。
     * @param system システムメッセージの内容。
     * @returns ConverseCommandのレスポンス。
     */
    async converseCommand(role: any, text: string, system: string) : Promise<string> {
        try {
            // 入力チェック
            if (this.lib.isNullOrEmpty(text)) {
                throw new Error("Messages cannot be null or empty");
            }
            if (this.lib.isNullOrEmpty(system)) {
                throw new Error("System message cannot be null or empty");
            }
            if (this.lib.isNullOrEmpty(role)) {
                throw new Error("Role cannot be null or empty");
            }
            
            const command = new ConverseCommand({
                modelId: this.modelId,
                system: [
                    {
                        text: system
                    }
                ],
                messages: [
                    {
                        role: role,
                        content: [
                            {
                                text: text
                            }
                        ]
                    }
                ],
            });

            const response = await this.bedrockClient.send(command);
            const responseText = response.output?.message?.content
				?.find(content => content.text !== undefined)
				?.text
				?.trim();

            if (this.lib.isNullOrEmpty(responseText)) {
                throw new Error("Response text is null or empty");
            }
            return responseText;
        } catch (error) {
            throw new Error(`Failed to create ConverseCommand: ${error}`);
        }
    }
}

export class LibAwsS3 {
    private config: Config;
    private lib: Lib;
    public accessKeyId: string;
    public secretAccessKey: string;
    private s3Client: S3Client;

    constructor() {
        this.config = new Config();
        this.accessKeyId = this.config.aws.accessKeyId as string;
        this.secretAccessKey = this.config.aws.secretAccessKey as string;
        this.s3Client = new S3Client({
            region: this.config.aws.region as string,
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey
            }
        });
    }
}