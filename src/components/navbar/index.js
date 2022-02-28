import logo from './../../assets/logo.png';
function Navbar() {
    return (

        <nav className="navbar navbar-expand-sm" style={{background: "#1b4a82"}}>
        <div className="container-fluid">
          <ul className="navbar-nav">
            <li className="nav-item">
             <img src={logo} alt="logo" style={{width: "200px"}}/>
            </li>
           
          </ul>
        </div>
      </nav>
         
    );

}

export default Navbar;