import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import path from 'path';

import { Request, Response, Router, Express } from 'express';
import { createLogger, format, transports } from 'winston';
const { File, Console } = transports;
import { randomBytes } from 'crypto';

//Configure logging
const log = createLogger({
	level: 'info',
	format: format.timestamp(),
	transports: [
		new File({filename: './logs/log.txt'}),
		new Console({format: format.combine(format.colorize(), format.simple())})
	]
});

//Sets up shutdown hook on Windows
const os = require('os');

if(process.platform === 'win32') {
	let readline = require("readline").createInterface({
		input: process.stdin,
		output: process.stdout
	});
	readline.on("SIGINT", shutdown);
	readline.on("SIGTERM", shutdown);
	log.info("Registered win32 shutdown hook.");
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

let serviceId = randomBytes(8).toString('hex');

log.info("Service started, id: " + serviceId);

let consul = require('consul')({host: process.env.CONSUL_HOST, port: process.env.CONSUL_PORT});

interface Room {
	ID: string;
}

const router = Router();

/**
 * Creates a new room
 */
router.post('/create', async (req: Request, res: Response) => {
	//TODO: docker/kubernetes stuff
	res.json({ID: randomBytes(3).toString('hex').substring(0, 5).toUpperCase()});
});

/**
 * Returns all available rooms
 */
router.get('/rooms', async (req: Request, res: Response) => {
    consul.agent.service.list((err: any, result: any) => {
		if(err) return;
		let map = new Map<string, any>(Object.entries(result));
		let rooms:Room[] = [];
		map.forEach((service, id) => {
			if(service.Service === "chat-service") {
				let a: Room = {ID: service.Meta.inst};
				rooms.push(a);
			}
		});
		res.json(rooms);
	});
});

router.get('/health', async (req: Request, res: Response) => {
    res.json({status: 'up'});
});

app.use('/api', router);

app.get('*', (req: Request, res: Response) => {
    res.sendFile('index.html', {root: staticDir});
});

const appInfo = require('./../package.json');

const port = Number(process.env.PORT || 3000);

const serviceOptions = {
	name: appInfo.name,
	id: appInfo.name+'-'+serviceId,
	tags: [appInfo.version],
	port: port
};

// Start the server
app.listen(port, () => {
	log.info('Server started on port: ' + port);
	
	consul.agent.service.register(serviceOptions, (err: any) => {
		if(err) log.error('Failed to register service, cause: ' + err);
		else log.debug('Registered service.');
	});
});

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {
	consul.agent.service.deregister(serviceOptions.id, (err: any) => {
		log.debug('Deregistered service.');
		process.exit(0);
	});
}