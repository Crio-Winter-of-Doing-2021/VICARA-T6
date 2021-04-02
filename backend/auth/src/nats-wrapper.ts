import nats, {Stan} from 'node-nats-streaming';

export class NatsWrapper {
    private _client: Stan;
    private static instance: NatsWrapper;

    private constructor() {
        // Check if required environment variables are set
        if (
            !process.env.NATS_URL ||
            !process.env.NATS_CLUSTER_ID ||
            !process.env.NATS_CLIENT_ID
        ) {
            throw new Error('NATS_URL, NATS_CLUSTER_ID and NATS_CLIENT_ID' +
                'should be set in environment variables for NATS');
        }
        this._client = nats.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            {url: process.env.NATS_URL}
        );
    }

    static client() {
        if (!NatsWrapper.instance) {
            throw new Error('Cannot access client before calling connect');
        }
        return NatsWrapper.instance._client;
    }

    static connect(): Promise<void> {
        if (!NatsWrapper.instance) {
            NatsWrapper.instance = new NatsWrapper();
        }
        return new Promise((resolve, reject) => {
            NatsWrapper.instance._client.on('connect', () => {
                console.log('Connected to NATS');
                resolve();
            });
            NatsWrapper.instance._client.on('error', (err) => {
                reject(err);
            });
        });
    }
}
