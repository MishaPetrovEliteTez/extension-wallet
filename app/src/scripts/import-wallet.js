let pkh, keyPair, importType = 'private';

document.addEventListener('DOMContentLoaded', () => {
  let btnDrop = document.getElementById('dropdown-list');
  let btnByPrivate = document.getElementById('import-private');
  let btnByMnemonic = document.getElementById('import-mnemonic');
  let encryptPass = document.getElementById('encrypt-pass-input');
  let btnNext = document.getElementById('next-btn');
  let btnSave = document.getElementById('save-btn');
  let btnBack = document.getElementById('back-btn');

  btnDrop.addEventListener('click', () => {
    document.getElementById("dropdown").classList.toggle("show");
  });
  btnByPrivate.addEventListener('click', () => {
    btnDrop.innerHTML = "Import by private key";
    document.getElementById('form-private').style.display = 'block';
    document.getElementById('form-mnemonic').style.display = 'none';
    importType = 'private'
  });
  btnByMnemonic.addEventListener('click', () => {
    btnDrop.innerHTML = "Import by mnemonic phase";
    document.getElementById('form-private').style.display = 'none';
    document.getElementById('form-mnemonic').style.display = 'block';
    importType = 'mnemonic'
  });
  btnNext.addEventListener('click', () => {
    document.getElementById('form-private').style.display = 'none';
    document.getElementById('form-mnemonic').style.display = 'none';
    document.getElementById('encrypt-pass').style.display = 'none';
    document.getElementById('dropdown-id').style.display = 'none';
    document.getElementById('save').style.display = 'block';

    let keys;
    switch (importType) {
      case 'private':
        keys = getKeysByKey(document.getElementById('private-key').value);
        break;
      case 'mnemonic':
        keys = getKeysByPhrase(document.getElementById('mnemonic-phrase').value,
          document.getElementById('mnemonic-passwd').value);
        break;
      default:
        throw new Error('Unknown wallet import type:' + importType);
    }

    pkh = keys.pkh;
    keyPair = {
      pk: keys.pk,
      esk: CryptoJS.AES.encrypt(keys.sk, encryptPass.value).toString()
    };
    keys = null;

    document.getElementById('wallet-public').innerHTML = pkh;
    document.getElementById('wallet-private-encrypt').innerHTML = keyPair.esk;

    document.getElementById('wallet').style.display = 'block';
  });
  btnSave.addEventListener('click', () => {
    if (pkh && keyPair) {
      let result = save(pkh, keyPair);
      console.log(result);
      if (result) {
        document.getElementById('finish-msg').innerText = 'Save success!';
        document.getElementById('finish').style.display = 'block';
      } else {
        document.getElementById('finish-msg').innerText = 'Save error!';
        document.getElementById('finish').style.display = 'block';
      }
    }
    pkh = null;
    keyPair = null
  });
  btnBack.addEventListener('click', () => {
    document.getElementById('form-private').style.display = 'block';
    document.getElementById('form-mnemonic').style.display = 'block';
    document.getElementById('encrypt-pass').style.display = 'block';
    document.getElementById('dropdown-id').style.display = 'block';
    document.getElementById('save').style.display = 'none';
  });

  encryptPass.addEventListener('input', function () {
    let passwordStrength = document.getElementById('password-strength');

    switch (zxcvbn(encryptPass.value).score) {
      case 0:
        passwordStrength.className = "very-weak";
        passwordStrength.innerText = "Very Weak";
        break;
      case 1:
        passwordStrength.className = "weak";
        passwordStrength.innerText = "Weak";
        break;
      case 2:
        passwordStrength.className = "good";
        passwordStrength.innerText = "Good";
        break;
      case 3:
        passwordStrength.className = "strong";
        passwordStrength.innerText = "Strong";
        break;
      case 4:
        passwordStrength.className = "very-strong";
        passwordStrength.innerText = "Very Strong";
        break;
      default:
        passwordStrength.className = "empty";
        passwordStrength.innerText = "Enter password";
        break
    }
  });
});

window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    let dropdown = document.getElementsByClassName("dropdown-content");
    let i;
    for (i = 0; i < dropdown.length; i++) {
      let openDropdown = dropdown[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

function getKeysByPhrase(mnem, pass) {
  return eztz.crypto.generateKeys(mnem, pass)
}

function getKeysByKey(pKey) {
  return eztz.crypto.extractKeys(pKey)
}

function save(pkh, keysPair) {
  let keys;
  try {
    chrome.storage.local.get('keys', (result) => {
      if (result.keys == null) {
        keys = new Map();
        keys.set(pkh, keysPair);
        let mapStr = JSON.stringify([...keys]);
        chrome.storage.local.set({'keys': mapStr});
      } else {
        keys = result.keys;
        keys = new Map(JSON.parse(keys));
        keys.set(pkh, keysPair);
        let mapStr = JSON.stringify([...keys]);
        chrome.storage.local.set({'keys': mapStr});
      }
    });
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
}
