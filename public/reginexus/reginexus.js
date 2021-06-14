console.log('Client-side code running');

const { ethereum } = window;


//Buttons
const connect = document.getElementById('connect');
const sign = document.getElementById('sign');
//Information display
const account = document.getElementById('account');
const command = document.getElementById('command');

const uuid = document.getElementById('uuid').textContent;

const onClickConnect = async () => {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    account.textContent = accounts[0];
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
        console.log('Response json: ' + JSON.stringify(response))
      }
    );
  };

sign.addEventListener('click', function (e) {
    onClickSign();
    
});
connect.addEventListener('click', function(e) {
    onClickConnect();
});



