var webpage = require('webpage')
var page = webpage.create();
var fs = require('fs');
var system = require('system');
var args = system.args;

if(args.length <= 1){
	phantom.exit();
}
var site = args[1], callbackAPI = args[2];

page.settings.userAgent = "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)";
page.viewportSize = {width: 1920, height: 1080};

var html = "", siteStatus = "fail", title = '';
var timer, loopCheckTimer;
var requests = {};
page.open(site, function(status){
	siteStatus = status;
	// phantom.exit();
});
// reportResult();
page.onLoadStarted = function(){
	setTimeout(function(){
		loopCheckTimer = setInterval(function(){
			for(var r in requests){
				if(requests.hasOwnProperty(r)){
					requests[r]-=1;
					if(requests[r] < 0){
						delete requests[r];
						isFinished();					
					}
				}
			}
		}, 10);
		
	}, 5000);
}
page.onResourceRequested = function(request){
	requests[request.id] = 5;
};
page.onResourceReceived = function(response){
	delete requests[response.id];
	isFinished();
};
function endRequest(error){
	delete requests[error.id];
	isFinished();
};
page.onResourceTimeout = endRequest;
page.onResourceError = endRequest;

function isFinished(){
	var requestsStr = JSON.stringify(requests);
	console.log(requestsStr);
	if(requestsStr == "{}"){
		if(page.content.length >= html.length){
			html = page.content;
			title = page.title;
			// page.render('baidu.png');
			// fs.write('weibo.html', page.content, 'w');
			reportResult();
		}
	}else{
		clearTimeout(timer);
	}
}

function reportResult(){
	clearTimeout(timer);
	timer = setTimeout(function(){
		console.log('evaluate page');
		clearInterval(loopCheckTimer);
		var action = page.evaluate(function(){
			var elementAction = [];
			for(var a in window){
				if(a.indexOf('on') == 0){
					elementAction.push(a.toString());
				}
			}
			function findElements(name, cb){
				var elements = Array.prototype.slice.call(document.querySelectorAll(name));	
				elements.forEach(function(e){
					cb(e);
				});
			}
			findElements('script', function(script){
				script.remove();
			});
			findElements('a', function(a){
				a.setAttribute('href', 'javascript:void(0)');
			});
			findElements('*', function(e){
				elementAction.forEach(function(a){
					e.removeAttribute(a);
				});
			});
			findElements('input, button', function(e){
				if(e.getAttribute('type').toLowerCase() === 'submit'){
					e.setAttribute('type', 'button');
				}
			});
			findElements('form', function(e){
				e.setAttribute('onsubmit', 'return false;');
			});
			var count = 0;
			findElements('*', function(e){
				e.setAttribute('data-node-id', count);
				count++;
			});	
			return elementAction;
		});
		
		var distPage = webpage.create();
		var settings = {
			operation: "POST",
			encoding: "utf8",
			headers: {
				"Content-Type": "application/json"
			},
			data: JSON.stringify({
				status: siteStatus,
				html: page.content,
				title: page.title
			})
		};
		fs.write('weibo.html', page.content, 'w');
		distPage.open(callbackAPI, settings, function(status){
			console.log('status: ' + status);
			phantom.exit();
		});
	}, 3000);
}