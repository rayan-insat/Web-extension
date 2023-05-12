const toggle = document.getElementById('toggle');

toggle.addEventListener('change', () => {
  const isChecked = toggle.checked;
  chrome.storage.sync.set({ isOn: isChecked });
  chrome.runtime.sendMessage({ isOn: isChecked });
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.reload(tabs[0].id);
  });

});

chrome.storage.sync.get('isOn', ({ isOn }) => {
  toggle.checked = isOn;
});