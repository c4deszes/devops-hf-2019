import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import path from 'path';

import { Request, Response, Router, Express } from 'express';
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

// Sets up shutdown hook on Windows
const os = require('os');

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

const http = require('http');

import { V1Pod, V1NamespaceList, V1Namespace, V1PodList, CoreV1Api } from '@kubernetes/client-node';

const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();

kc.loadFromDefault();

const k8sApi:CoreV1Api = kc.makeApiClient(k8s.CoreV1Api);

/**
 * Creates a new room
 */
router.post('/create', async (req: Request, res: Response) => {
	//k8sApi.createNamespacedPod();
	res.send('Not implemented').status(200);
});

/**
 * Returns all available rooms
 */
router.get('/rooms', async (req: Request, res: Response) => {
    k8sApi.listNamespacedPod('default').then((result: any) => {
		let rooms: IRoom[] = [];
		const namespace: V1PodList = result.body;
		namespace.items.forEach((element: V1Pod) => {
			if (element.metadata ) {
				if (element.metadata.name === 'chat-service') {
					rooms.push({ID: element.metadata.uid ? element.metadata.uid : 'undefined'});
				}
			}
		});
		res.json(rooms).status(200);
	});
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
