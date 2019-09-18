chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg === "something_completed") {
      //  To do something
      console.log(request);
      console.log(request.data.subject);
      console.log(request.data.content)
    }
  }
);

function showAllWallets(func) {
  let walletsEl = document.getElementById('wallets');

  // chrome.runtime.sendMessage(chrome.runtime.id, {type : 'showAllWallets'});

  load('keys').then((map) => {
    console.log(map);

    if (map != null)
      new Map(JSON.parse(map)).forEach((v, k, map) => {
        func(k, v, walletsEl)
      });
    else
      walletsEl.innerHTML = '<p>Wallets not found!</p>'
  });
}


function load(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (items) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(items[key]);
      }
    });
  });
}

function transfer (from, keys, to, amount, fee, parameter, gasLimit, storageLimit, revealFee) {
  if (typeof revealFee == 'undefined') revealFee = '1269';
  if (typeof gasLimit == 'undefined') gasLimit = '10200';
  if (typeof storageLimit == 'undefined') storageLimit = '300';
  let operation = {
    "kind": "transaction",
    "fee": fee,
    "gas_limit": gasLimit,
    "storage_limit": storageLimit,
    "amount": eztz.utility.mutez(amount).toString(),
    "destination": to
  };
  console.log("Operation: ");
  console.log(operation);
  if (typeof parameter == 'undefined') parameter = false;
  if (parameter) {
    operation.parameters = eztz.utility.sexp2mic(parameter);
  }

  return sendOperation(from, operation, keys, false, revealFee);
}

function sendOperation (from, operation, keys, skipPrevalidation, revealFee) {
  if (typeof revealFee == 'undefined') revealFee = '1269';
  if (typeof skipPrevalidation == 'undefined') skipPrevalidation = false;
  return prepareOperation(from, operation, keys, revealFee).then(function (fullOp) {
      console.log(fullOp);
  })
}