let transaction;
let webPageTabId = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // chrome.tabs.create({url:"tab/main.html"});
  console.log(msg);
  console.log(sender);
  console.log(sender.id === chrome.runtime.id);

  /*
    var enc = CryptoJS.AES.encrypt("dsikfjsd", "12312312312312321");

    console.log(enc.toString());
    console.log(CryptoJS.AES.decrypt(enc, "12312312312312321").toString(CryptoJS.enc.Utf8));*/

  switch (msg.type) {
    case "true": {
      console.log("chrome.tabs.query");
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        console.log("chrome.tabs.sendMessage");
        chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"});
      });
      window.open("src/main.html", "extension_popup", "width=550,height=700,status=no,scrollbars=yes,resizable=no");
      break
    }
    case "confirm-transaction": {
      console.log(msg);
      transaction = msg;
      window.open("src/wallets-send.html", "extension_popup", "width=550,height=700,status=no,scrollbars=yes,resizable=no");
      break
    }
    case "show-operation-info": {
      console.log(msg);
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        console.log("chrome.tabs.sendMessage");
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'show-operation-info',
          data: transaction.data
        });
      });
      break
    }
    case "select-wallet": {
      console.log("chrome.tabs.query");
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        webPageTabId = tabs[0].id;
        chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"});
      });
      window.open("src/wallets.html", "extension_popup", "width=550,height=700,status=no,scrollbars=yes,resizable=no");
      break
    }
    case "wallet-selected": {
      console.log(msg);
      chrome.tabs.query({active: true, currentWindow: true}, () => {
        chrome.tabs.sendMessage(webPageTabId, {
          action: "wallet_selected",
          wallet: msg.wallet
        });
      });
      break
    }
    case "sign-transaction": {
      let fullOp = msg.data.bytes;
      let passwd = msg.data.passwd;
      console.log(fullOp);
      getSecretKey(msg.data.key).then((secretKey) => {

        try {
          let decryptedKey = CryptoJS.AES.decrypt(secretKey, passwd).toString(CryptoJS.enc.Utf8);

          if (decryptedKey.length > 0) {
            let signed = eztz.crypto.sign(
              fullOp.opbytes,
              getKeysByKey(decryptedKey).sk,
              eztz.watermark.generic
            );
            console.log(signed.sbytes);
            fullOp.opOb.signature = signed.edsig;
            fullOp.opbytes = signed.sbytes;
            console.log(fullOp);

            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: "inject_transaction",
                data: fullOp
              });
            });
          } else {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: "error",
                data: "Password incorrect!"
              });
            });
          }
        } catch (e) {
          chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "error",
              data: "Signing transaction error (probably password incorrect)!"
            });
          });
        }
      });
      break
    }
    case "showAllWallets": {
      chrome.runtime.sendMessage({
        msg: "something_completed",
        data: {
          subject: "Loading",
          content: "Just completed!"
        }
      });
      /* chrome.storage.local.get('keys', (result) => {
         let keys = result.keys;

         console.log(keys);

         keys = new Map(JSON.parse(keys));
         console.log(keys);*/


      //
      // let esk = keys.get('tz1QLLbmqmrnfy7pBSzLCsY4RGSoB7t7Y72q').toString();
      //
      // console.log(CryptoJS.AES.decrypt(esk, 'q').toString(CryptoJS.enc.Utf8))
      // let e = "U2FsdGVkX18xdemrlYMCehI3jJ5nSiAH5qEsxOkPRxUFGgVyGlwisDn290R1T4rbQtW/u98A/gaHpmx7 J84jOuvTbVwbmrGIPLwJsCcorpoDlOO2BtHZ7JZ22JTpjXMzv4hsB7zRT6aqsP9BstQFEnEw7DFqoM2yGH1BTYdlkg="
      // console.log(CryptoJS.AES.decrypt("U2FsdGVkX18xdemrlYMCehI3jJ5nSiAH5qEsxOkPRxUFGgVyGlwisDn290R1T4rbQtW/u98A/gaHpmx7+J84jOuvTbVwbmrGIPLwJsCcorpoDlOO2BtHZ7JZ22JTpjXMzv4hsB7zRT6aqsP9BstQFEnEw7DFqoM2yGH1BTYdlkg=", 'q').toString(CryptoJS.enc.Utf8))
      // });
      break
    }
    default:
      console.log(msg);
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "error"});
      });
      break
  }

  return true;
});


function getKeysByKey(pKey) {
  return eztz.crypto.extractKeys(pKey)
}

function getSecretKey(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('keys', (result) => {
      if (result.keys == null) reject("Keys not found!");

      let keys = result.keys;
      keys = new Map(JSON.parse(keys));
      resolve(keys.get(key).esk)
    });
  });
}
