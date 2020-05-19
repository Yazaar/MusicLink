var s = io(window.location.origin, {transports: ['websocket']});

s.on('connect', function () {
    console.log('connected!');
});

s.on('error', function () {
    console.log('error');
});

s.on('message', function (e) {
    console.log(e);
});

s.on('pong', function (e) {
    console.log(e);
});

document.querySelector('button').addEventListener('click', function(){
    if (s.connected) {
        s.emit('ping', 'ping');
    } else {
        alert('not connected to the server!');
    }
});