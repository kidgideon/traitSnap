 import "./styles/home.css"
 import logo from "../../images/nobglogo.png"

 const Home = () => {
    return(<div className="homePage"> 
    <div className="home-icon-area">
        <img src={logo} alt="" /> <h3>TraitSnap</h3>
    </div>
   <h1 className="homepage-into-text">Wrap your personality in one card</h1>
 
<div className="startButton">
    <button>Get Trait Card</button>
</div>
    </div>)
}  

export default Home