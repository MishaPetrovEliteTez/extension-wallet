let operation;
let pks;

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(request);
    switch (request.action) {
      case "inject_transaction": {
        rpc.inject(request.data.opOb, request.data.opbytes).then((resp) => {
          console.log(resp);
          console.log(resp.hash);
          document.getElementById('transaction-progress').innerText = resp.hash.toString();
        });
        break
      }
      case "show-operation-info": {
        console.log(request);
        console.log(request.data);
        operation = request.data.operation;
        let str = JSON.stringify(request.data.operation, null, 2);
        console.log(str);

        document.getElementById('transaction-data').innerText = str;
        break
      }
      case "error": {
        document.getElementById('transaction-progress').innerText = request.data;
        break
      }
      default:
    }
  }
);

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('send-btn').addEventListener('click', () => {

    eztz.node.setProvider('http://alphanet-node.tzscan.io');

    document.getElementById('in-progress').style.display = 'block';
    let keys = pks;
    if(!operation) operation = JSON.parse(document.getElementById('transaction-data').innerText);

    if (operation.parameters.email.length > 0)
      operation.parameters = '{"prim":"Left","args":[{"string":"' + operation.parameters.email + '"}]}';
    else
      delete operation.parameters;

    console.log(operation);
    prepareBytes(
      keys.pkh,
      operation,
      keys
    ).then(function (fullOp) {
      console.log(fullOp);
      console.log(operation);
      operation = null;

      let data = {
        passwd: document.getElementById('decrypt-pass-input').value,
        key: keys.pkh,
        bytes: fullOp
      };

      chrome.runtime.sendMessage(chrome.runtime.id, {
        type: "sign-transaction",
        data: data
      });
    });
  })
});

chrome.runtime.sendMessage(chrome.runtime.id, {type: 'show-operation-info'});

showAllWallets(callbackButtons);

function callbackButtons(k, v, walletsEl) {
  let btn = document.createElement("button");
  btn.className = "wallet-btn";
  btn.innerHTML = k;
  btn.id = k;
  walletsEl.appendChild(btn);

  document.getElementById(k.toString()).addEventListener('click', (it) => {
    console.log(it);
    pks = {pkh: k, pk: v.pk};
    document.getElementById('public-key').innerText = k;
    document.getElementById('wallets').style.display = 'none';
    document.getElementById('decrypt').style.display = 'block';
  });
}


function prepareBytes(from, operation, keys, revealFee) {
  console.log(keys);
  console.log(operation);
  return eztz.rpc.prepareOperation(from, operation, keys, revealFee)
}