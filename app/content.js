/*
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");

    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });
*/

/*chrome.runtime.onMessage.addListener(msgObj => {
  console.log()
});*/

chrome.runtime.onMessage.addListener(msg => {
  console.log(msg);

  switch (msg.action) {
    case 'wallet_selected':
      document.dispatchEvent(new CustomEvent('wallet-selected', {detail: {wallet: msg.wallet}}));
      break;
    default:
      console.log(msg);
      console.error("Unknown message:\n" + msg);
      break;
  }
});

document.addEventListener("test-event", (data) => {
  console.log(data);
  chrome.runtime.sendMessage(chrome.runtime.id, {type: data.detail});

  chrome.storage.local.get('keys', (result) => {
    let keys = result.keys;

    console.log(keys);

  });
});

document.addEventListener("confirm-transaction", (data) => {
  console.log(data);
  chrome.runtime.sendMessage(chrome.runtime.id, {
    type: "confirm-transaction",
    data: data.detail
  });
});

document.addEventListener("select-wallet", (data) => {
  console.log(data);
  chrome.runtime.sendMessage(chrome.runtime.id, {
    type: "select-wallet"
  });
});

document.addEventListener("new-wallet", (data) => {
  chrome.runtime.sendMessage(chrome.runtime.id, data.detail);

  chrome.storage.local.get('keys', (result) => {
    let keys = result.keys;

    console.log(keys);

  });
});

document.addEventListener("wallet-selected", (data) => {
  console.log(data);
});

function save() {
  let channels = document.getElementById('channels');
  let keywords = document.getElementById('keywords');

  console.log(channels);
  console.log(keywords);
}
