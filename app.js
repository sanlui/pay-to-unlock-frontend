// Configurazione
const contractAddress = "0x67ab50fb82b65eeac63c99e822f31b3aa3875954"; // Il tuo indirizzo contratto
const contractABI = [ [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_initialPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_threshold",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "IPFS_CID",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getGatewayURL",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "payToUnlock",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalPaid",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unlockPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unlockThreshold",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] ];

let web3;
let contract;

// Inizializza Web3
async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            document.getElementById('wallet-status').textContent = "✅ Wallet connesso";
            loadContract();
        } catch (error) {
            console.error("Accesso al wallet negato", error);
        }
    } else {
        alert("Installa MetaMask!");
    }
}

// Carica il contratto
async function loadContract() {
    contract = new web3.eth.Contract(contractABI, contractAddress);
    updateUI();
}

// Aggiorna l'interfaccia
async function updateUI() {
    const price = await contract.methods.unlockPrice().call();
    const paid = await contract.methods.totalPaid().call();
    
    document.getElementById('current-price').textContent = web3.utils.fromWei(price, 'ether');
    document.getElementById('payments-count').textContent = paid;

    // Se sbloccato, mostra il meme
    if (price == 0) {
        const url = await contract.methods.getGatewayURL().call();
        document.getElementById('meme-image').src = url;
        document.getElementById('meme-container').classList.remove('hidden');
    }
}

// Sblocca il meme
document.getElementById('unlock-button').addEventListener('click', async () => {
    const price = await contract.methods.unlockPrice().call();
    await contract.methods.payToUnlock().send({ 
        value: price,
        from: (await web3.eth.getAccounts())[0]
    });
    updateUI();
});

// Avvia l'app
init();
