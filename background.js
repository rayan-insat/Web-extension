let isExtensionOn = true;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ isOn: isExtensionOn }, () => {
    console.log('Extension is on');
  });
});

chrome.storage.sync.get('isOn', ({ isOn }) => {
  isExtensionOn = isOn;
  console.log(isOn);
  updateIcon();
});

chrome.runtime.onMessage.addListener(({ isOn }) => {
  isExtensionOn = isOn;
  console.log(isOn);
  updateIcon();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.sync.get('isOn', ({ isOn }) => {
    if (isOn) {
      chrome.tabs.executeScript({
        code: `
          var video = document.querySelector('video');
          if (video && !video.paused ) {
            video.removeAttribute('controls');
            // Add an event listener to the video to prevent pausing
            video.addEventListener('pause', (event) => {
            event.preventDefault();
            event.stopPropagation();
            video.play();
             });
            video.addEventListener('keydown', function(event) {
              if (event.keyCode === 32) {
                event.preventDefault();
                video.play();
              }
            });

          }
        `
      });
    }
    });
  }
});

function updateIcon() {
  chrome.browserAction.setTitle({
    title: `NoPause is ${isExtensionOn ? 'on' : 'off'}`
  });
}
