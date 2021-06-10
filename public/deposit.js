const { ethereum } = window;
const web3 = new Web3(ethereum);

//Buttons
const connect = document.getElementById('connect');
const select = document.getElementById('select');
const approve = document.getElementById('approve');
const deposit = document.getElementById('deposit');
//Elements
const account = document.getElementById('account');
const balance = document.getElementById('balance');
const input = document.getElementById('input');
var slider = document.getElementById("slider");
var output = document.getElementById("output");

const FACTORY_ADDRESS = "0x68ede3a5A15A21587Ba91Ec1D4c0be5adA94364c"

const FACTORY_CONTRACT = new web3.eth.Contract(getERCFactoryABI(), FACTORY_ADDRESS)

var SELECTED_ACCOUNT = ""

var SELECTED_ID = ""

var SELECTED_ADDRESS = ""

var SELECTED_CONTRACT;

var contractBalance = 0;

var contractAllowance = 0;


// Update the current slider value (each time you drag the slider handle)
output.innerHTML = slider.value;
slider.oninput = function () {
  output.innerHTML = this.value;
}

const onClickConnect = async () => {
  try {
    ethereum.enable();
    SELECTED_ACCOUNT = await getCurrentAccount();
    account.textContent = SELECTED_ACCOUNT;
    select.disabled = false;
    input.disabled = false;
  } catch (error) {
    console.error(error);
  }
};

const onClickSelect = async () => {
  FACTORY_CONTRACT.methods.getContract(input.value).call(function (err, res) {
    if (err) {
      console.log("Error:", err)
      return
    }
    SELECTED_ID = input.value;
    SELECTED_ADDRESS = res;
    SELECTED_CONTRACT = new web3.eth.Contract(getERC20ABI(), SELECTED_ADDRESS);
    updateValues();
  })
};
const onClickApprove = async () => {
    SELECTED_CONTRACT.methods.approve(FACTORY_ADDRESS,"100000000000000000000000").send({ from: SELECTED_ACCOUNT}).on('confirmation', function(confNumber, receipt, latestBlockHash){ 
    setApproval(false);
  })
};
const onClickDeposit = async () => {
  FACTORY_CONTRACT.methods.deposit(SELECTED_ID,slider.value).send({ from: SELECTED_ACCOUNT}).on('confirmation', function(confNumber, receipt, latestBlockHash){ 
    output.textContent = "Confirmed"
    updateValues();
  })
};

select.addEventListener('click', function (e) {
  onClickSelect();
});
connect.addEventListener('click', function (e) {
  onClickConnect();
});
approve.addEventListener('click', function (e) {
  onClickApprove();
});
deposit.addEventListener('click', function (e) {
  onClickDeposit();
});

async function getCurrentAccount() {
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
}

function setApproval(on){
  if(on === true){
    console.log("Set approval true")
    deposit.disabled = true;
    slider.disabled = true;
    approve.disabled = false;
  }else{
    console.log("Set approval false")
    deposit.disabled = false;
    slider.disabled = false;
    approve.disabled = true;
  }
}


async function updateValues(){
  SELECTED_CONTRACT.methods.balanceOf(SELECTED_ACCOUNT).call(function (err, res) {
    if (err) {
      console.log("Error:", err)
      return
    }
    contractBalance = res;
    balance.textContent = contractBalance;
    slider.max = contractBalance;
  }).then(function(){
    SELECTED_CONTRACT.methods.allowance(SELECTED_ACCOUNT, FACTORY_ADDRESS).call(function (err, res) {
      if (err) {
        console.log("Error:", err)
        return
      }
      contractAllowance = res;
      var bigAllowance = BigInt(contractAllowance)
      var bigBalance = BigInt(contractBalance)
      
      if (bigAllowance > bigBalance) {
        setApproval(false);
      } else {
        setApproval(true);
      }
    })
  });
}