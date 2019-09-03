showAllWallets(callbackButton);

function callbackButton(k, v, walletsEl) {
  let btn = document.createElement("button");
  btn.className = "wallet-btn";
  btn.innerHTML = k;
  btn.id = k;
  walletsEl.appendChild(btn);

  document.getElementById(k.toString()).addEventListener('click', () => {
    showEncryptKeys(k, v.esk)
  });
}


document.addEventListener('DOMContentLoaded', () => {
  // document.getElementById('status').textContent = "Extension loaded";
/*  let button = document.getElementById('save');
  button.addEventListener('click', () => {
    let channels = document.getElementById('channels').value;
    let keywords = document.getElementById('keywords').value;

    chrome.runtime.sendMessage(chrome.runtime.id, 'data.detail');

    load(channels, keywords);
    console.log(channels);
    console.log(keywords);
  });*/

  document.getElementById('decrypt-btn').addEventListener('click', () => {
    document.getElementById('public').innerText;
    let decryptPass = document.getElementById('decrypt-pass-input').value;
    let secretKey = document.getElementById('encrypted-secret').innerText;

    console.log(secretKey);
    console.log(decryptPass);
    try {
      let decryptedKey = CryptoJS.AES.decrypt(secretKey, decryptPass).toString(CryptoJS.enc.Utf8);

      console.log(decryptedKey);
      if (decryptedKey.length > 0) document.getElementById('decrypted-secret').innerHTML = '<p class="success">' + decryptedKey + '<p>';
      else document.getElementById('decrypted-secret').innerHTML = '<p class="error">Password incorrect!<p>';
    } catch (e) {
      document.getElementById('decrypted-secret').innerHTML = '<p class="error">Password incorrect!<p>';
    }
  })
});

function showEncryptKeys(publicKey, secretKey) {
  document.getElementById('wallets-list').style.display = 'none';
  document.getElementById('wallet-decrypt').style.display = 'block';

  document.getElementById('public').innerText = publicKey;
  document.getElementById('encrypted-secret').innerText = secretKey;
}