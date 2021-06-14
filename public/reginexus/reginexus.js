console.log('Client-side code running');

const { ethereum } = window;


//Buttons
const connect = document.getElementById('connect');
const sign = document.getElementById('sign');
const copy = document.getElementById('copy');
//Information display
const account = document.getElementById('account');
const command = document.getElementById('command');
const copiedmsg = document.getElementById('copiedmsg');
const uuid = document.getElementById('uuid').textContent;

const onClickConnect = async () => {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    account.textContent = accounts[0];
    sign.disabled =false;
  };

const onClickSign = async () => {

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    var from = accounts[0];
    const hash = generateDataHash(uuid, from);
    console.log("Hash:"+ hash);

    var params = [hash, from];
    

    var method = 'personal_sign';

    ethereum.sendAsync({method, params, from},
      function (err, response) {
        command.textContent = "/verify " + accounts[0]+" "+response.result;
        command.value = "/verify " + accounts[0]+" "+response.result;
        copy.disabled = false;
        console.log('Response json: ' + JSON.stringify(response))
      }
    );
  };
  const onClickCopy = async () => {
    command.select();
    command.setSelectionRange(0, 99999);
    document.execCommand("copy");
    copiedmsg.textContent = "Copied to clipboard!"
  };

sign.addEventListener('click', function (e) {
    onClickSign();
    
});
connect.addEventListener('click', function(e) {
    onClickConnect();
});
copy.addEventListener('click', function(e) {
  onClickCopy();
});


