const { spawn } = require('child_process');

const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router({
	prefix: '/api/tasks'
});

router.get('/', (ctx, next)=>{
	logger.info(`index page access`);
	ctx.status = 200;
});
// create task
const CBAPI = 'http://127.0.0.1:3001/api/feedbacks';
router.put('/', (ctx, next)=>{
	let tasks = ctx.request.body.tasks;
	try{
		for(let task of tasks){
			logger.info(`task ${JSON.stringify(task)} execute`);
			console.log(task);
			let phantomjs = spawn('phantomjs', ['phantom_call.js', task.url, `${CBAPI}/${task.id}`]);
			phantomjs.stdout.on('data', data=>{
				console.log(`stdout: ${data}`);
			});
			phantomjs.stderr.on('data', data=>{
				console.log(`stderr: ${data}`);
			});
			phantomjs.on('close', code=>{
				console.log(`child process exited with code ${code}`);
			});
		}
		ctx.status = 200;
	} catch(e){
		ctx.status = 500;
	}
});

module.exports = router;