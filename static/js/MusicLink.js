(function(){
    var keyInput = document.querySelector('#selectedKey');
    var results = document.querySelector('#results');
    var key = document.querySelector('#key');
    var url = document.querySelector('#url');
    var HTMLAgentCopy = document.querySelector('#HTMLAgentCopyResponse');

    var HTMLAgentConfigs = {
        youtube: {"elements":[{"name":"title","path":"#info-contents .title","type":"text"},{"name":"author","path":"#upload-info #channel-name a","type":"text"},{"name":"totalTime","path":"video","type":"playerduration"},{"name":"currentTime","path":"video","type":"playertime"},{"name":"YTthumbnail","property":"v","type":"URLParam"}],"name":"YouTube","responseFormat":"","responseFormatDummy":"","website":"www.youtube.com/watch"},
        soundcloud: {"elements":[{"name":"title","path":".playbackSoundBadge__title a span:nth-child(2)","type":"text"},{"name":"author","path":".playbackSoundBadge__titleContextContainer a","type":"text"},{"name":"totalTime","path":".playbackTimeline__progressBackground","property":"width","type":"cssprocessed"},{"name":"currentTime","path":".playbackTimeline__progressBar","property":"width","type":"cssprocessed"},{"name":"CSSURLthumbnail","path":".playbackSoundBadge div.image span","property":"background-image","type":"cssstyle"}],"name":"SoundCloud","responseFormat":"","responseFormatDummy":"","website":"soundcloud.com"}
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
        var href = window.location.origin + '/MusicLink/overlay/' + newValue;
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
                selectedConfig.elements.unshift({"name":"roomId","type":"fixedValue","value":generateKey()});
            } else {
                selectedConfig.elements.unshift({"name":"roomId","type":"fixedValue","value":lastValidValue});
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