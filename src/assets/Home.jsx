import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/home.css";
import logo from "../../images/nobglogo.png";
import kai from "../../images/kaicenat.png";
import henry from "../../images/henry.png";
import helen from "../../images/helen.png"

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    if (!name || !photo) {
      alert("Please upload a photo and enter your name.");
      return;
    }

    // Clear all relevant localStorage items before starting a new quiz
    localStorage.removeItem("traitsnap-name");
    localStorage.removeItem("traitsnap-photo");
    localStorage.removeItem("traitsnap-scores");
    // Add any other quiz-related keys here if needed

    // Save new name and photo
    localStorage.setItem("traitsnap-name", name);
    localStorage.setItem("traitsnap-photo", photo);

    navigate("/trait test");
  };

  return (
    <div className="homePage">
      <div className="home-icon-area">
        <img src={logo} alt="logo" />
        <h3>TraitSnap</h3>
      </div>

      <h1 className="homepage-into-text">Wrap your personality in one card</h1>

      <div className="image-view-section">
        <img  className="helen" src={helen} alt="" />
          <img className="kai" src={kai} alt="" />
            <img className="henry" src={henry} alt="" />
      </div>

      <div className="startButton">
        <button onClick={() => setShowModal(true)}>Get Trait Card</button>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Let's Begin!</h2>

            <div className="photo-upload-wrapper">
              <div className="photo-preview">
                {photo ? (
                  <img src={photo} alt="preview" className="preview-img" />
                ) : (
                  <div className="placeholder" />
                )}
                <label className="edit-icon">
                  <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth={1.5} stroke="currentColor" className="pencil-icon">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 
                         1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 
                         0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 
                         0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 
                         7.125M18 14v4.75A2.25 2.25 0 0 1 
                         15.75 21H5.25A2.25 2.25 0 0 1 
                         3 18.75V8.25A2.25 2.25 0 0 1 
                         5.25 6H10" />
                  </svg>
                </label>
              </div>
            </div>

            <input
              type="text"
              placeholder="name or nickname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="name-input"
            />
            <button onClick={handleNext} className="next-btn">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
