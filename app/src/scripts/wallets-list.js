showAllWallets(callbackButtons);

function callbackButtons(k, v, walletsEl) {
  console.log("k = " + k + "\nv = " + v);
  let btn = document.createElement("button");
  btn.className = "wallet-btn";
  btn.innerHTML = k;
  btn.id = k;
  walletsEl.appendChild(btn);

  document.getElementById(k.toString()).addEventListener('click', () => {
    console.log("k = " + k + "\nv = " + v);

    /*    let evt = new CustomEvent('Event', {
          wallet: k
        });
        evt.initEvent("wallet-selected");
        document.dispatchEvent(evt);*/


/*    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type:"getText"}, function(response){
        console.log(response);
      });
    });*/

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log(tabs);
      chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
        console.log(response);
      });
    });


    chrome.runtime.sendMessage(chrome.runtime.id, {
      type: "wallet-selected",
      wallet: k
    });


  });
}