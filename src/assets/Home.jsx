import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/home.css";
import logo from "../../images/nobglogo.png";
import kai from "../../images/kaicenat.png";
import henry from "../../images/henry.png";
import helen from "../../images/helen.png";
import AdBanner from "./Adbanner";
import mascot from "../../images/traitsnap_mascot.png";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  // Fade-in on scroll logic
  useEffect(() => {
    const handleScroll = () => {
      document.querySelectorAll('.fade-section').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
          el.classList.add('visible');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    localStorage.removeItem("traitsnap-name");
    localStorage.removeItem("traitsnap-photo");
    localStorage.removeItem("traitsnap-scores");
    localStorage.setItem("traitsnap-name", name);
    localStorage.setItem("traitsnap-photo", photo);
    navigate("/trait-test");
  };

  return (
    <div className="homePage">
      <div className="home-icon-area">
        <img src={logo} alt="logo" />
        <h3>TraitSnap</h3>
      </div>

      <h1 className="homepage-into-text">Wrap your personality in one card</h1>

      <div className="image-view-section fade-section">
        <img className="helen" src={helen} alt="" />
        <img className="kai" src={kai} alt="" />
        <img className="henry" src={henry} alt="" />
      </div>

      <div className="startButton fade-section">
        <button onClick={() => setShowModal(true)}>Get Trait Card</button>
      </div>

      <AdBanner />

    

      {/* How It Works */}
      <div className="context-layout fade-section">
          {/* About Section */}
      <section className="about-section fade-section">
        <h2>What is TraitSnap?</h2>
        <p>
          TraitSnap is a fun and interactive way to discover and showcase your unique personality traits! 
          Upload your photo, answer a few engaging questions, and receive a beautifully designed card that highlights your strengths and social style. 
          Share your card with friends and see how you compare!
        </p>
      </section>

      {/* Features Section */}
      <section className="features-section fade-section">
        <h2>Why You'll Love TraitSnap</h2>
        <div className="features-list">
          <div>
            {/* Sparkle SVG */}
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path fill="#5C27FE" d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.77 7.82 20 9 12.91l-5-3.64 5.91-.01z"/></svg>
            <h4>Instant Personality Card</h4>
            <p>Get a personalized card in seconds, ready to share or download.</p>
          </div>
          <div>
            {/* Share SVG */}
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path stroke="#339cff" strokeWidth="2" d="M15 8l5 4-5 4M20 12H9a5 5 0 1 1 0-10h1"/></svg>
            <h4>One-Tap Sharing</h4>
            <p>Show off your card on socials or DM it to friends—just tap and go!</p>
          </div>
          <div>
            {/* Lock SVG */}
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="8" rx="2" fill="#21004D"/><path stroke="#339cff" strokeWidth="2" d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <h4>Privacy First</h4>
            <p>Your data never leaves your device. No servers, no snooping, just you.</p>
          </div>
          <div>
            {/* Party SVG */}
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path fill="#FF2E93" d="M2 22l16-16 4 4-16 16z"/><circle cx="17" cy="7" r="2" fill="#FFD700"/></svg>
            <h4>Fun & Insightful</h4>
            <p>Answer quirky questions, get real compliments, and discover your spark!</p>
          </div>
        </div>
      </section>
        <h1>How It Works</h1>
        <div className="method">
          <div>
            <lord-icon
              className="icon-lord"
              src="https://cdn.lordicon.com/ijsqrapz.json"
              trigger="loop"
              stroke="bold"
              colors="primary:#339cff,secondary:#339cff"
            ></lord-icon>
            <h3>Upload a picture</h3>
          </div>
          <div>
            <lord-icon
              className="icon-lord"
              src="https://cdn.lordicon.com/sobzmbzh.json"
              trigger="loop"
              delay="2000"
              stroke="bold"
              colors="primary:#339cff,secondary:#339cff"
            ></lord-icon>
            <h3>Answer fun questions</h3>
          </div>
          <div>
            <lord-icon
              className="icon-lord"
              src="https://cdn.lordicon.com/ssartdnc.json"
              trigger="loop"
              delay="1500"
              state="in-reveal"
              colors="primary:#339cff,secondary:#339cff"
            ></lord-icon>
            <h3>Get your trait card</h3>
          </div>
        </div>
        <div className="mascot-are">
          <img src={mascot} alt="" />
        </div>

           {/* Testimonials Section */}
      <section className="testimonials-section fade-section">
        <h2>What Users Say</h2>
        <div className="testimonials-list">
          <div>
            <p>"TraitSnap made my day! The card looks amazing and the compliments are spot on."</p>
            <span>- Alex</span>
          </div>
          <div>
            <p>"Super fun and easy to use. I loved sharing my card with friends!"</p>
            <span>- Jamie</span>
          </div>
          <div>
            <p>"The design is beautiful and the questions are actually interesting."</p>
            <span>- Priya</span>
          </div>
        </div>
      </section>

      {/* Meet Traity Section */}
      <section className="mascot-section fade-section">
        <div className="mascot-flex">
          {/* Fun SVG mascot */}
          <svg className="mascot-img" width="110" height="110" viewBox="0 0 110 110" fill="none">
            <circle cx="55" cy="55" r="50" fill="#339cff" />
            <ellipse cx="55" cy="70" rx="28" ry="18" fill="#fff"/>
            <ellipse cx="40" cy="50" rx="7" ry="10" fill="#fff"/>
            <ellipse cx="70" cy="50" rx="7" ry="10" fill="#fff"/>
            <ellipse cx="40" cy="52" rx="3" ry="4" fill="#21004D"/>
            <ellipse cx="70" cy="52" rx="3" ry="4" fill="#21004D"/>
            <ellipse cx="55" cy="80" rx="8" ry="4" fill="#21004D"/>
            <ellipse cx="55" cy="80" rx="5" ry="2" fill="#fff"/>
            <ellipse cx="35" cy="35" rx="3" ry="2" fill="#FFD700"/>
            <ellipse cx="75" cy="35" rx="3" ry="2" fill="#FFD700"/>
          </svg>
          <div>
            <h2>Meet Our Mascot: <span style={{color:'#5C27FE'}}>Traity</span>!</h2>
            <p>
              Traity is your friendly guide on the TraitSnap journey. Always cheerful and a little quirky, Traity loves helping you discover what makes you, <b>you</b>. Spot Traity for tips, encouragement, and a sprinkle of magic as you explore your personality!
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section fade-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          <div>
            <h4>Is TraitSnap free?</h4>
            <p>Yes! TraitSnap is completely free to use.</p>
          </div>
          <div>
            <h4>Do you store my data?</h4>
            <p>No, your data is only stored locally in your browser and never sent to our servers.</p>
          </div>
          <div>
            <h4>Can I retake the quiz?</h4>
            <p>Absolutely! Just refresh the page or click "Get Trait Card" to start over.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section fade-section">
        <div className="footer-content">
          <img src={logo} alt="TraitSnap Logo" className="footer-logo" />
          <div>
            <p>
              &copy; {new Date().getFullYear()} TraitSnap. All rights reserved.
            </p>
            <p>
              Made with <span style={{color:'#FF2E93'}}>♥</span> for self-discovery.
            </p>
          </div>
        </div>
      </footer>

      </div>

    
      {/* Modal */}
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
