(function(){
    var thumbnail = document.querySelector('#thumbnail');
    var title = document.querySelector('#title');
    var author = document.querySelector('#author');
    var right = document.querySelector('#right');
    var time = document.querySelector('#time');

    var onStart = {
        title: false,
        author: false
    };

    var currentTitle = title.innerText;
    var currentAuthor = author.innerText;
    var currentThumbnail = thumbnail.src;

    var params = new URLSearchParams(window.location.search);

    if (!params.get('previewmode')) {
        var s = io(window.location.origin);
    
        s.on('connect', function(){
            s.emit('bind_to_room', room);
        });
    
        s.on('message', function(msg){
            console.log(msg);
        });
    
        s.on('overlayUpdate', function(data){
            var changes = false;
            if (typeof data.title === 'string' && data.title !== currentTitle) {
                changes = true;
                title.innerText = data.title;
                currentTitle = data.title;
                refreshTicker(title);
            }
            if (typeof data.author === 'string' && data.author !== currentAuthor) {
                changes = true;
                author.innerText = data.author;
                currentAuthor = data.author;
                refreshTicker(author);
            }
            if (typeof data.CSSURLthumbnail === 'string') {
                var processedThumbnail = data.CSSURLthumbnail.match(/url\("(.*)"\)/);
                if (processedThumbnail !== null) {
                    data.thumbnailUrl = processedThumbnail[1];
                }
            }
            if (typeof data.YTthumbnail === 'string') {
                data.thumbnailPrefix = 'https://img.youtube.com/vi/';
                data.thumbnailSuffix = '/default.jpg';
            }
            if (typeof data.thumbnailPrefix === 'string' && typeof data.thumbnailUrl === 'string') {
                data.thumbnailUrl = data.thumbnailPrefix + data.thumbnailUrl;
            }
            if (typeof data.thumbnailSuffix === 'string' && typeof data.thumbnailUrl === 'string') {
                data.thumbnailUrl = data.thumbnailUrl + data.thumbnailSuffix;
            }
            if (typeof data.thumbnailUrl === 'string' && data.thumbnailUrl !== currentThumbnail) {
                changes = true;
                thumbnail.src = thumbnailPrefix + data.thumbnailUrl + thumbnailSuffix;
                currentThumbnail = data.thumbnailUrl;
            }
            if (changes === true) {
                time.style.background = generateRGB();
            }
            if (data.currentTime && data.totalTime) {
                data.timePercentage = (parseFloat(data.currentTime) / parseFloat(data.totalTime)) * 100;
            }
            if (typeof data.timePercentage === 'number') {
                time.style.width = data.timePercentage + '%';
            }
        });
    } else {
        title.innerText = 'Preview of MusicLink';
        author.innerText = 'This is a preview of the MusicLink overlay in action';
    }

    function generateRGB() {
        /*
        Rules:
        Always 1 value should be 255 (FF in hex)
        At least 1 value should be 0 (00 in hex)
        */
        var RGBValues = [0, 0, 0];
        if (Math.random() > 0.75) {
            RGBValues[Math.floor(Math.random() * RGBValues.length)] = 255;
        } else {
            var index1 = Math.floor(Math.random() * RGBValues.length);
            RGBValues[index1] = 255;
            if (Math.random() > 0.5) {
                RGBValues[(index1 + 1) % RGBValues.length] = Math.floor(Math.random() * 256);
            } else {
                if (index1 === 0) {
                    RGBValues[RGBValues.length - 1] = Math.floor(Math.random() * 256);
                } else {
                    RGBValues[index1 - 1] = Math.floor(Math.random() * 256);
                }
            }
        }
        return 'rgb(' + RGBValues[0] + ', ' + RGBValues[1] + ', ' + RGBValues[2] +')';
    }

    function refreshTicker(element){
        element.style.transition = '';
        element.style.marginLeft = '0';
        onStart[element.id] = true;
        transitionEnd(element);
    }

    function transitionEnd(element){
        if (onStart[element.id] === true) {
            onStart[element.id] = false;
            setTimeout(startTicker, 2000, element);
        } else {
            onStart[element.id] = true;
            setTimeout(resetTicker, 5000, element);
        }
    }

    function startTicker(element) {
        var velocity = 75; // pixels per second
        var elementWidth = element.offsetWidth;
        var parentWidth = right.offsetWidth;
        var pushDistance = elementWidth - parentWidth; // d (distance)
        var duration = pushDistance / velocity;

        if (duration > 10) {
            duration = 10;
        } else if (duration < 1) {
            duration = 1;
        }

        if (pushDistance <= 0) {
            return;
        }
        
        element.style.transition = 'margin-left ' + duration + 's linear';
        element.style.marginLeft = (pushDistance * -1) + 'px';
    }

    function resetTicker(element) {
        var velocity = 100; // pixels per second
        var elementWidth = element.offsetWidth;
        var parentWidth = right.offsetWidth;
        var pushDistance = elementWidth - parentWidth; // d (distance)

        if (pushDistance < 0) {
            return;
        }

        var duration = pushDistance / velocity;

        if (duration > 10) {
            duration = 10;
        } else if (duration < 1) {
            duration = 1;
        }

        element.style.transition = 'margin-left ' + duration + 's linear';
        element.style.marginLeft = '0';
    }

    title.addEventListener('transitionend', function(){
        transitionEnd(this);
    });

    author.addEventListener('transitionend', function(){
        transitionEnd(this);
    });

    thumbnail.addEventListener('load', function(){
        if (this.width > this.height) {
            this.style.width = '90vh';
            this.style.height = 'auto';
        } else {
            this.style.height = '90vh';
            this.style.width = 'auto';
        }
    });

    window.addEventListener('resize', function(){
        refreshTicker(title);
        refreshTicker(author);
    });

    startTicker(title);
    startTicker(author);
})();