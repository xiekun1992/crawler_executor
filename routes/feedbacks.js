const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router({
	prefix: '/api/feedbacks'
});
const rp = require('request-promise');

router.post('/:id', async (ctx, next)=>{
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	let result = await rp({
		method: 'POST',
		uri: `http://192.168.245.128:3000/api/configs/${ctx.params.id}`,
		body: {
			html: ctx.request.body.html,
			status: ctx.request.body.status
		},
		json: true
	});
	if(result.code == 20000){
		logger.info(`configId#${ctx.params.id} save successfully`);
	}else{
		logger.error(`configId#${ctx.params.id} fail to save`);
	}
	ctx.body = result;
});

module.exports = router;