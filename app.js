var fs		= require('fs'),
	url		= require('url'),
	http	= require('http'),
	path	= require('path'),
	express	= require('express'),
	app		= express(),
	server  = http.createServer(app),
	io		= require('socket.io').listen(server),
	root	= __dirname,
	port    = 8080,
	watchers= {};


app.use(function (req, res, next) {
	
	req.on('static', function(){
		var file = url.parse(req.url).pathname,
			mode = 'stylesheet';

		if (file[file.length - 1] == '/'){
			file += 'index.html';
			mode = reload;
		}

		createWatcher(file, mode);
	});
	
	next();

});


app.use(express.static(root));

function createWatcher(file, ev){
	var absolute = path.join(root, file);

	console.log(absolute);
	
	if (watchers[absolute])
		return;

	fs.watchFile(absolute, function(curr, prev){
		if (curr.mtime !== prev.mtime){
			console.log('...........createWatcher..........');
			console.log(ev);
			io.sockets.emit(ev, file);

		}
	});

	watchers[absolute] = true;
}

server.listen(port);