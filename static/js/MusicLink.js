(function(){
    var keyInput = document.querySelector('#selectedKey');
    var results = document.querySelector('#results');
    var key = document.querySelector('#key');
    var url = document.querySelector('#url');
    var HTMLAgentCopy = document.querySelector('#HTMLAgentCopyResponse');

    var HTMLAgentConfigs = {
        youtube: {"elements":[{"name":"title","path":"#info-contents .title","type":"text"},{"name":"author","path":"#upload-info #channel-name a","type":"text"},{"name":"totalTime","path":"video","type":"playerduration"},{"name":"currentTime","noAutoPost":true,"path":"video","type":"playertime"},{"argument":"v","name":"YTthumbnail","type":"URLParam"},{"name":"force unexpected time","numArg":1,"numArg2":2,"type":"forcePostLinearIncrement","variableSelect":4},{"argument":1,"name":"timePerSecond","type":"fixedValue"},{"argument":"paused","name":"paused","path":"video","type":"nodeVariable"}],"name":"YouTube","responseFormat":"","responseFormatDummy":"","website":"www.youtube.com/watch"},
        youtubeChapter: {"elements":[{"name":"title","path":".ytp-chapter-title span:nth-child(2)","type":"text"},{"name":"author","path":"#upload-info #channel-name a","type":"text"},{"name":"totalTime","path":"video","type":"playerduration"},{"name":"currentTime","noAutoPost":true,"path":"video","type":"playertime"},{"argument":"v","name":"YTthumbnail","type":"URLParam"},{"name":"force unexpected time","numArg":1,"numArg2":2,"type":"forcePostLinearIncrement","variableSelect":4},{"argument":1,"name":"timePerSecond","type":"fixedValue"},{"argument":"paused","name":"paused","path":"video","type":"nodeVariable"}],"name":"YouTube","responseFormat":"","responseFormatDummy":"","website":"www.youtube.com/watch"},
        soundcloud: {"elements":[{"name":"title","path":".playbackSoundBadge__title a span:nth-child(2)","type":"text"},{"name":"author","path":".playbackSoundBadge__titleContextContainer a","type":"text"},{"argument":"aria-valuemax","localVariable":true,"name":"totalTimeStr","noAutoPost":true,"path":".playbackTimeline__progressWrapper","type":"attribute"},{"argument":"aria-valuenow","localVariable":true,"name":"currentTimeStr","noAutoPost":true,"path":".playbackTimeline__progressWrapper","type":"attribute"},{"argument":"background-image","name":"CSSURLthumbnail","path":".playbackSoundBadge div.image span","type":"cssstyle"},{"argument":"integer","name":"totalTime","type":"cast","variableSelect":3},{"argument":"integer","name":"currentTime","noAutoPost":true,"type":"cast","variableSelect":4},{"argument":"classList.length","localVariable":true,"name":"playingValue","noAutoPost":true,"path":".playControl","type":"nodeVariable"},{"argument":"var8 === 4","name":"paused","operation":"===","type":"math","val1":"var8","val2":4},{"name":"force post: time change","numArg":1,"numArg2":2,"type":"forcePostLinearIncrement","variableSelect":7},{"argument":1,"name":"timePerSecond","type":"fixedValue"}],"name":"SoundCloud","responseFormat":"","responseFormatDummy":"","website":"soundcloud.com"},
        monstercat: {"elements":[{"argument":"player.currentItem.artistTitle","name":"author","type":"variable"},{"argument":"player.currentItem.title","name":"title","type":"variable"},{"argument":"player.currentItem.releaseId","name":"thumbnailUrl","type":"variable"},{"argument":"https://connect.monstercat.com/v2/release/","name":"thumbnailPrefix","type":"fixedValue"},{"argument":"/cover","name":"thumbnailSuffix","type":"fixedValue"},{"argument":"player.audio.currentTime","name":"currentTime","noAutoPost":true,"type":"variable"},{"argument":"player.audio.duration","name":"totalTime","type":"variable"},{"name":"force post: unexpected time","numArg":1,"numArg2":2,"type":"forcePostLinearIncrement","variableSelect":6},{"argument":1,"name":"timePerSecond","type":"fixedValue"},{"argument":"player.audio.paused","name":"paused","type":"variable"}],"name":"Monstercat","responseFormat":"","responseFormatDummy":"","website":"www.monstercat.com"}
    };

    var defaultKeyValues = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var lastValidValue = '';

    function onKeyChange() {
        var newValue = keyInput.value;
        if (newValue.length === 0) {
            lastValidValue = '';
            results.style.display = 'none';
            return;
        }
        if (/^[a-zA-Z0-9]+$/.test(newValue) === false) {
            keyInput.value = lastValidValue;
            return;
        }
        var href = window.location.origin + '/overlay/' + newValue;
        url.href = href;
        url.innerText = href;
        key.innerText = newValue;
        results.style.display = 'block';
        lastValidValue = newValue;
    }

    function generateKey() {
        var keyLength = 10 + Math.floor(Math.random() * 21);
        var generatedKey = '';
        for (var i = 0; i < keyLength; i++) {
            generatedKey += defaultKeyValues[Math.floor(Math.random() * defaultKeyValues.length)];
        }
        return generatedKey;
    }

    keyInput.addEventListener('input', onKeyChange);

    document.querySelector('#randomKey').addEventListener('click', function(){
        keyInput.value = generateKey();
        onKeyChange();
    });

    var HTMLAgentConfigBTNs = document.querySelectorAll('#HTMLAgentConfigs .configBTN');
    for (var i = 0; i < HTMLAgentConfigBTNs.length; i++) {
        HTMLAgentConfigBTNs[i].addEventListener('click', function(){
            var site = this.getAttribute('data-site');
            if (HTMLAgentConfigs[site] === undefined) {
                return;
            }
            var selectedConfig = JSON.parse(JSON.stringify(HTMLAgentConfigs[site]));
            if (lastValidValue === '') {
                selectedConfig.elements.unshift({"name":"roomId","type":"fixedValue","argument":generateKey()});
            } else {
                selectedConfig.elements.unshift({"name":"roomId","type":"fixedValue","argument":lastValidValue});
            }

            var textarea = document.createElement('textarea');
            textarea.style.width = 0;
            textarea.style.height = 0;
            textarea.style.opacity = 0;
            textarea.value = JSON.stringify(selectedConfig);
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            HTMLAgentCopy.style.transition = '';
            HTMLAgentCopy.style.opacity = '1';
            setTimeout(function() {
                HTMLAgentCopy.style.transition = 'opacity 500ms 1s ease-in-out';
                HTMLAgentCopy.style.opacity = '0';
            }, 1);
        });
    }
})();