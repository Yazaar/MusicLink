var keyInput = document.querySelector('#selectedKey');
var results = document.querySelector('#results');
var key = document.querySelector('#key');
var url = document.querySelector('#url');

var defaultKeyValues = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
var lastValidValue = '';

function onKeyChange() {
    var newValue = keyInput.value;
    if (newValue.length === 0) {
        lastValidValue = '';
        results.style.display = 'none';
        return;
    }
    if (/^[a-zA-Z1-9]+$/.test(newValue) === false) {
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

keyInput.addEventListener('input', onKeyChange);

document.querySelector('#randomKey').addEventListener('click', function(){
    var keyLength = 10 + Math.floor(Math.random() * 20);
    var generatedKey = '';
    for (var i = 0; i < keyLength; i++) {
        generatedKey += defaultKeyValues[Math.floor(Math.random() * defaultKeyValues.length)];
    }
    keyInput.value = generatedKey;
    onKeyChange();
});