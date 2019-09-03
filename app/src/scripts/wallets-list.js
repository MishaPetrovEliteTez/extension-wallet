
showAllWallets(callbackButton);

function callbackButton(k, v, walletsEl) {
  let btn = document.createElement("button");
  btn.className = "wallet-btn";
  btn.innerHTML = k;
  btn.id = k;
  walletsEl.appendChild(btn);

  document.getElementById(v.toString()).addEventListener('click', () => {
    showEncryptKeys(k, v.esk)
  });
}

function showEncryptKeys(publicKey, secretKey) {
  document.getElementById('wallets-list').style.display = 'none';
  document.getElementById('wallet-decrypt').style.display = 'block';

  document.getElementById('public').innerText = publicKey;
  document.getElementById('encrypted-secret').innerText = secretKey;
}