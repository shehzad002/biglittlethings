import Web3 from 'web3';

const web3 = new Web3(window.web3.currentProvider);

const handleConnect = () => {
    window.ethereum.enable();
}
export {web3, handleConnect};
