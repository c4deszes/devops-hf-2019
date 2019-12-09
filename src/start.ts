import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import path from 'path';

import { Request, Response, Router } from 'express';
import { createLogger, format, transports } from 'winston';
const { File, Console } = transports;
import { randomBytes } from 'crypto';

// Configure logging
const log = createLogger({
	level: 'info',
	format: format.timestamp(),
	transports: [
		new File({filename: './logs/log.txt'}),
		new Console({format: format.combine(format.colorize(), format.simple())}),
	],
});


if (process.platform === 'win32') {
	const readline = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	readline.on('SIGINT', shutdown);
	readline.on('SIGTERM', shutdown);
	log.info('Registered win32 shutdown hook.');
}

// Init express
const app = express();
const cors = require('cors');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(process.env.CORS_DISABLED === 'true' ? cors('*') : cors());

const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

////////////////////////////////////////////////////////////////////////////

interface IRoom {
	ID: string;
}

const router = Router();


import { V1Pod, V1PodList, CoreV1Api, KubeConfig, NetworkingV1beta1Api, V1PodStatus } from '@kubernetes/client-node';
import { readFileSync } from 'fs';

const kc: KubeConfig = new KubeConfig();
kc.loadFromDefault();

const k8sCore: CoreV1Api = kc.makeApiClient(CoreV1Api);
const k8sNetworking: NetworkingV1beta1Api = kc.makeApiClient(NetworkingV1beta1Api);

const ingressTemplate: string = readFileSync('env/k8s_config/ingress.json', 'utf-8');
const serviceTemplate: string = readFileSync('env/k8s_config/service.json', 'utf-8');
const podTemplate: string = readFileSync('env/k8s_config/pod.json', 'utf-8');
/**
 * Creates a new room
 */
router.post('/create', async (req: Request, res: Response) => {
	const id = randomBytes(3).toString('hex');

	let regexpr = /undefined/gi;

	const ingressObj = JSON.parse(ingressTemplate.replace(regexpr, id));
	const serviceObj = JSON.parse(serviceTemplate.replace(regexpr, id));
	const podObj = JSON.parse(podTemplate.replace(regexpr, id));

	try {
		k8sNetworking.createNamespacedIngress(process.env.K8S_NAMESPACE ? process.env.K8S_NAMESPACE : 'default', ingressObj)
		.then((s: any) => {}).catch((reason: any) => {
			console.error(reason);
		});

		k8sCore.createNamespacedService(process.env.K8S_NAMESPACE ? process.env.K8S_NAMESPACE : 'default', serviceObj)
		.then((s: any) => {}).catch((reason: any) => {
			console.error(reason);
		});

		k8sCore.createNamespacedPod(process.env.K8S_NAMESPACE ? process.env.K8S_NAMESPACE : 'default', podObj)
		.then((s: any) => {}).catch((reason: any) => {
			console.error(reason);
		});
	}
	catch(err) {
		res.json(err).status(500);
	}

	res.json({ID: id}).status(200);
});

/**
 * Returns all available rooms
 */
router.get('/rooms', async (req: Request, res: Response) => {
	try {
		k8sCore.listNamespacedPod(process.env.K8S_NAMESPACE ? process.env.K8S_NAMESPACE : 'default').then((result: any) => {
			let rooms: IRoom[] = [];
			const namespace: V1PodList = result.body;
			namespace.items.forEach((element: V1Pod) => {
				if (element.metadata && element.metadata.labels !== undefined && element.status !== undefined) {
					if (element.metadata.labels.name === 'chat-service' && element.status.phase === 'Running') {
						rooms.push({ID: element.metadata.labels.instance});
					}
				}
			});
			res.json(rooms).status(200);
		}).catch((reason: any) => {
			console.error(reason);
			res.send(reason).status(500);
		});
	}
	catch(err) {
		console.error(err);
		res.json(err).status(500);
	}
});

router.get('/health', async (req: Request, res: Response) => {
    res.json({status: 'up'});
});

app.use('/api', router);

app.get('*', (req: Request, res: Response) => {
    res.sendFile('index.html', {root: staticDir});
});

const port = Number(process.env.PORT || 3000);

// Start the server
app.listen(port, () => {
	log.info('Server started on port: ' + port);
});

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {

}
