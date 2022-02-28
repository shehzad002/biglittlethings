import './App.css';
import React, { useEffect, useState } from 'react';
import Nft from './constants';
import {web3, handleConnect} from './web3';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/navbar/index'
import Jumbo from './components/jumbo/index'
import avatar from './assets/loader.gif'
import Footer from './components/footer/index'
import github from './components/footer/github.png'
import telegram from './components/footer/telegram.png'


const App: React.FC = () => {
  const [Maxitem, setMaxitem] = useState('');
  const [Price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [userVerification, setuserVerification] = useState('');
  const [value, setValue] = useState('');
  const [balanceOf , setBalanceOf] = useState(0);

  const [refresh, setRefresh] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [accounts, setAccounts] = useState<string[]>([]);
 
  useEffect(()=>{
    const interval = setInterval(()=>{setRefresh(!refresh)}, 1000);
    return ()=>{
      clearInterval(interval)
    }
  }, [])

  useEffect(()=>{
    const fetchAccounts = async ()=>{
      try{

        const _addresses = await web3.eth.getAccounts();
        setAccounts(_addresses)
      }catch(e){
        setAccounts([])
      }
    }

    fetchAccounts();
  },[refresh])

 
  useEffect(()=>{
    if(accounts.length > 0){
      setIsConnected(true);
    }else{
      setIsConnected(false)
    }
  }, [accounts])


  useEffect(() => {
    const init = async () => {
      const Maxitem = await Nft.methods.MAX_ITEMS().call();
      const Price = await Nft.methods.basePrice().call();

      // const CurrentPrice = web3.utils.fromWei(Price, 'ether');

      if(accounts.length > 0){
        const userVerification = await Nft.methods.verifyUser(accounts[0]).call();
        const balanceOf = await Nft.methods.balanceOf(accounts[0]).call();
        setuserVerification(userVerification);
        setBalanceOf(balanceOf);
      }

      setMaxitem(Maxitem);
      setPrice(Price);
    };
    init();
  }, [accounts]);

const submitWhitelist = async (e:any) => {
e.preventDefault();
  setMessage("Wait User is Whitelisting");
  await Nft.methods.addUser(value).send({
    from: accounts[0],
  });
  

  setMessage('You have been entered!');
}

const submitMint = async (e:any) => {
e.preventDefault();
 console.log("Mint Functions", Price);

 setMessage("Depositing, Please Wait");
 await Nft.methods.mint(accounts[0], value).send({
  from: accounts[0],
  value: +Price*(+value)
});

setMessage("Minting is Started");



}




  return (
    <div>
<Navbar />
<Jumbo />
<div className="card" style={{padding: "5px",background: "#1b4a82"}}>
    <div className="row">
        <div className="col-sm-6">
        <h1 style={{color:"#fff"}}>{Maxitem} Left</h1>
        </div>
        <div className="col-sm-6"  style={{textAlign: "right"}}>
       
       {!isConnected ?
        <button onClick={e=>{e.preventDefault(); handleConnect()}} className="btn btn-primary btn-lg" style={{background:"#4084a6"}} >Connect</button>
        :
        <>
      
        <button onClick={e=>{e.preventDefault()}} className="btn btn-primary btn-lg" style={{background:"#4084a6"}}>Connected</button>
      </>
      }
</div>
    </div>
</div>

{/* section  started */}

<br /><br />
        <div className="container">
           <div className="jumbotron" >
               <div className="card" style={{background: "#4084a6"}}>
                   <div className="row" style={{padding: "5px"}}>
                       <div className="col-sm-4">
                            <img src={avatar} alt="avatar" className="img-fluid" />

                       </div>
                       <div className="col-sm-4">
                       <h1 style={{color:"#fff"}}>$BLTZ NFT</h1>
                       <p style={{color:"#fff"}}> User Status: {userVerification ? 'User is Whitelisted and Allow to Mint' : 'User is not Whitelisted. Please Whitelist after this you are able to mint'} </p>
                       <h2 style={{color:"#fff"}}>Price {web3.utils.fromWei(Price, 'ether')} MATIC</h2>
                      <br />  <form onSubmit={submitMint}>
        
        <div>
          
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
           className="form-control" />
          <button style={{ display: 'block', marginTop: '1vh', background: '#1b4a82', color: '#fff'}} className="btn btn-primary btn-lg">Mint Now</button>
        </div>
      </form>
      {accounts[0] == "0x16AD0dbe526fb172C4F2019aa808bd761c333ceC" ? 
       <form onSubmit={submitWhitelist}>
       <br />
 
<h4 style={{color:"#fff"}}>Whitelist User</h4>
<div>
<input
            value={value}
            onChange={(e) => setValue(e.target.value)}
           className="form-control" />
<button style={{ display: 'block', marginTop: '1vh', background: '#1b4a82', color: '#fff'}} className="btn btn-primary btn-lg">Whitelist Now</button>
</div>
{message}
</form>
    
    :
    <>
    <p style={{color: "#fff"}}>Apply for Whitelist Application. If you are not whitelisted yet</p>
    </>
    
    
    }
                  
                </div>
                       <div className="col-sm-4">
                           <h1 style={{color:"#fff"}}>Third Party Wallets <span className="badge bg-secondary" style={{borderRadius: "20px"}}>?</span></h1>
                           <h3 className="badge bg-secondary" style={{color:"#fff"}}>Connected Wallet</h3>
                           <p style={{color:"#fff"}}>{accounts[0] ? accounts[0] : 'Wallet is not connected Yet' }</p>
                           <br />
                           <h1 style={{color: "#fff"}}>User Token Balance</h1>
                           <p style={{color:"#fff"}}>{balanceOf} $BLTZ</p>
                           <a href=""><img src={github} alt="github" width="30" className="img-fluid" /></a> <a href="#"><img src={telegram} alt="github" width="60" className="img-fluid" /></a>
        
                       </div>
                   </div>
               </div>
           </div>

        </div>
        <br /> <br />

{/* section  ended */}
    <Footer />
      
    
    </div>
  );
};
export default App;
