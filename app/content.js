chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    case 'new-wallet':
      response(tabStorage[msg.tabId]);
      break;
    default:
      console.log(msg);
      console.error("Unknown message:\n" + msg);
      break;
  }


  var enc = CryptoJS.AES.encrypt("dsikfjsd", "12312312312312321");

  console.log(enc.toString());
  console.log(CryptoJS.AES.decrypt(enc, "12312312312312321").toString(CryptoJS.enc.Utf8));
});

document.addEventListener("test-event", (data) => {
  console.log(data);
  chrome.runtime.sendMessage(chrome.runtime.id, {type : data.detail});
  
  chrome.storage.local.get('keys', (result) => {
      let keys = result.keys;
      
      console.log(keys);
      
  });
});

document.addEventListener("confirm-transaction", (data) => {
  console.log(data);
  chrome.runtime.sendMessage(chrome.runtime.id, {
    type : "confirm-transaction",
    data : data.detail
  });
});

document.addEventListener("select-wallet", (data) => {
  console.log(data);
  chrome.runtime.sendMessage(chrome.runtime.id, {
    type : "select-wallet"
  });
});

document.addEventListener("new-wallet", (data) => {
  chrome.runtime.sendMessage(chrome.runtime.id, data.detail);
  
  chrome.storage.local.get('keys', (result) => {
    let keys = result.keys;
    
    console.log(keys);
    
  });
});

function save() {
    let channels = document.getElementById('channels');
    let keywords = document.getElementById('keywords');

    console.log(channels);
    console.log(keywords);
}
