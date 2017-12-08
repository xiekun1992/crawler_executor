const fs = require('fs');
const path =require('path');
// const https = require('spdy');
const http = require('http');
const Koa = require('koa');
const app = new Koa();
const static = require('koa-static');
const reqLogger = require('koa-logger');
const bodyParser = require('koa-body');

const log4js = require('log4js');
log4js.configure({
	appenders: { cheese: { type: 'file', filename: 'logs/log.log' } },
	categories: { default: { appenders: ['cheese'], level: 'debug' } }
});
const logger = log4js.getLogger();

global.logger = logger;

const index = require('./routes/index');
const feedbacks = require('./routes/feedbacks');

const options = {
	key: fs.readFileSync('private.pem'),
	cert: fs.readFileSync('file.crt')
};

app.use(reqLogger());
app.use(bodyParser({
	jsonLimit: '10mb'
}));
app.use(static(path.join(__dirname + '/static')));

app.use(index.routes());
app.use(feedbacks.routes());

// app.on('error', (err, ctx)=>{
// 	log.error('server error', err, ctx);
// });

// https.createServer(options, app.callback()).listen(3001);
http.createServer(app.callback()).listen(3001);

// app.use(async (ctx, next)=>{
// 	const start = Date.now();
// 	await next();
// 	const ms = Date.now() - start;
// 	ctx.set('X-Response-Time', `${ms}ms`);
// });

// app.use(async (ctx, next)=>{
// 	const start = Date.now();
// 	await next();
// 	const ms = Date.now() - start;
// 	console.log(`${ctx.method} ${ctx.url} - ${ms}`);
// });

// app.use(async ctx=>{
// 	ctx.cookies.set('crawler', 'koa.js', {
// 		httpOnly: true
// 	});
// 	ctx.body=`
// 		${ctx.method}\n
// 		${ctx.url}\n
// 		${ctx.path}\n
// 		${ctx.querystring}\n
// 		${ctx.ip}\n
// 		${ctx.request.ips}\n
// 		${ctx.host}\n
// 		${ctx.secure}\n
// 		${ctx.subdomains}
// 	`;
// });
// app.listen(3001);
// console.log(app.env)