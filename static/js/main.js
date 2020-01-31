s = io(window.location.origin, {transports: ['websocket']});

s.on('connect', function () {
    console.log('connected!');
});

s.on('error', function () {
    console.log('error');
});

s.on('message', function (e) {
    console.log(e);
});