
import React from 'react';
import { Search, ScanLine, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { IoSearch } from "react-icons/io5";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { LuListChecks } from "react-icons/lu";
import { TbUrgent } from "react-icons/tb";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaTag, FaMapMarkerAlt, FaCalendarAlt, FaGift } from 'react-icons/fa';
// import { lostItems } from '../SampleData/data';
// import { nonUrgentItems } from '../SampleData/data';
import CardSwap, { Card } from './CardSwap'
import { IoSearchSharp } from "react-icons/io5";
import { LuScanSearch } from "react-icons/lu";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import ShuffleImageGrid from './ShuffleImageGrid';

import './Home.css';

import image1 from '../assets/HomeImages/image1.avif';
import image2 from '../assets/HomeImages/image2.avif';
import image3 from '../assets/HomeImages/image3.avif';
import image4 from '../assets/HomeImages/image4.avif';
import image5 from '../assets/HomeImages/image5.avif';

import cloths from '../assets/category-icons/cloths.png';
import docs from '../assets/category-icons/docs.png';
import gadgets from '../assets/category-icons/gadgets.png';
import stationary from '../assets/category-icons/stationary.png';
import personal from '../assets/category-icons/personal.png';
import academic from '../assets/category-icons/academic.png';
import jewelry from '../assets/category-icons/jewelry.png';
import others from '../assets/category-icons/others.png';

const Home = () => {
  const categories = [
    { category: "Personal Belongings", icon: personal, color: "#f9c74f" },
    { category: "Documents", icon: docs, color: "#90be6d" },
    { category: "Stationery Items", icon: stationary, color: "#f8961e" },
    { category: "Electronics & Gadgets", icon: gadgets, color: "#577590" },
    { category: "Academic Items", icon: academic, color: "#43aa8b" },
    { category: "Clothing & Accessories", icon: cloths, color: "#ff6b6b" },
    { category: "Jewelry", icon: jewelry, color: "#c77dff" },
    { category: "Others", icon: others, color: "#adb5bd" }
  ];

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 2500,
    cssEase: "ease-in-out",
    centerMode: true,
    centerPadding: "0px"
  };

  const navigate = useNavigate();

  const faqs = [
    {
      question: "Who can use the Lost & Found Portal?",
      answer: "The portal is designed for all students, faculty, and staff members within the campus community."
    },
    {
      question: "How do I report a lost item?",
      answer: "Simply click on 'Report Lost Item', fill out the form with details, and submit it. Your post will be visible to others immediately."
    },
    {
      question: "How do I report a found item?",
      answer: "Click 'Post Found Item', provide accurate item and location details, and submit the form so others can find it."
    },
    {
      question: "What does the 'urgent' tag mean?",
      answer: "Items marked as 'urgent' are time-sensitive or highly important, such as ID cards or personal documents."
    },
    {
      question: "How is claim verification handled?",
      answer: "Claims are verified through a brief Q&A between the finder and claimant. Admins may intervene for sensitive items."
    },
    {
      question: "Can I get notified if someone finds my lost item?",
      answer: "Yes, you will automatically receive a notification if an item matching your lost post is found."
    },
    {
      question: "How can I edit or remove my post?",
      answer: "You can manage your posts from your dashboard—edit details or delete them anytime."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(prev => prev === index ? null : index);
  };

  const [query, setQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const handleInputChange = (e) => {
    const input = e.target.value;
    setQuery(input);

    if (input.trim() === '') {
      setFilteredSuggestions([]);
      return
    }

    const matches = nonUrgentItems.filter(item =>
      item.title.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredSuggestions(matches);
  };

  const handleSearch = () => {
    const match = nonUrgentItems.find(item =>
      item.title.toLowerCase() === query.toLowerCase()
    );
    if (match) {
      navigate(`/item/${match.id}`);
    } else {
      alert("Item Not Found");
    }
  };

  // const handleSuggestionClick = (item) => {
  //   navigate(`/item/${item.id}`);
  // };
   const handleSuggestionClick = (item) => {
    if (!item || !item._id) {
      console.error("Invalid item clicked:", item);
      return;
    }
    navigate(`/item/${item._id}`);
    setQuery('');
    setFilteredSuggestions([]);
  };

  const [lostItems, setLostItems] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/reports')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLostItems(data);
        } else {
          console.error('Unexpected response format:', data);
        }
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  // const handleViewDetails = (id) => {
  //   navigate(`/item-details/${id}`);
  // };
  const handleViewDetails = (id) => {
    navigate(`/item/${id}`);
  };
  const urgentItems = lostItems.filter(item => item.isEmergency).slice(0, 3);
  const nonUrgentItems = lostItems.filter(item => !item.isEmergency).slice(0, 6);


  const handleCategoryClick = (cat) => {
    const params = new URLSearchParams();
    params.set('category', cat);
    params.set('status', 'All');
    navigate(`/browseitems?${params.toString()}`);
  };

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: "Report or Search",
      description: "Easily post details about a lost or found item. Or, search our database using keywords, categories, and location filters.",
      icon: Search,
      color: "#0077b6",
      bgColor: "#bde0fe"
    },
    {
      id: 2,
      title: "Get Matched",
      description: "Our system can help match lost items with found reports. Receive notifications for potential matches.",
      icon: ScanLine,
      color: "#ffb703",
      bgColor: "#fff9e9"
    },
    {
      id: 3,
      title: "Verify & Reclaim",
      description: "Securely verify ownership and arrange for the return of items. Optional rewards can be offered.",
      icon: ShieldCheck,
      color: "#0077b6",
      bgColor: "#bde0fe"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [steps.length]);
 

  return (
    <div className='parent-container'>
      <div className='home-container'>
         <div id='home-search'>
      <div id='home-tagline'>
        Because Every Item <br />
        <span style={{ color: "#0077b6" }}>Deserves a Way Home...</span>
      </div>

      <div className='home-search-compo' style={{ position: "relative" }}>
        <input
          type="text"
          id="search-input"
          placeholder='Quick search for an item...'
          value={query}
          onChange={handleInputChange}
        />
        <button id='search-btn' onClick={handleSearch}>
          <IoSearch size='20px' /> Search
        </button>

        {filteredSuggestions.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '80%',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
              zIndex: 10,
              listStyle: 'none',
              margin: 0,
              padding: 0,
              borderRadius: '0 0 10px 10px',
              maxHeight: '220px',
              overflowY: 'auto',
              border: '1px solid #219ebc',
              borderTop: 'none',
            }}
          >
            {filteredSuggestions.map((item) => (
              <li
                key={item._id}
                onClick={() => handleSuggestionClick(item)}
                style={{
                  padding: '12px 15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  borderBottom: '1px solid #eee',
                  color: '#005f87',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e0f4f9';
                  e.currentTarget.style.color = '#0077b6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#005f87';
                }}
              >
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

        <div id='home-hero'>
          <div className='home-hero-buttons'>
            <div className='home-hero-title'>
              <span style={{ fontSize: "42px", fontWeight: "bold", fontFamily: "Arial, Helvetica, sans-serif", color: "#003049" }}>
                Welcome to Lost N Found
              </span><br />
              <span style={{ fontSize: "16px", fontWeight: "bold", fontFamily: "Arial, Helvetica, sans-serif", color: "#0077b6" }}>
                Your central hub for finding lost items and reporting found ones on campus. Let's help each other out!
              </span>
            </div>
            <div className='home-hero-inner-btn'>
              <button className='home-btn' onClick={() => navigate('/report-item')}><MdOutlineBookmarkAdd size='18px' />Report Lost Item</button>
              <button className='home-btn' onClick={() => navigate('/report-item')}><LuListChecks size='18px' />Post Found Item</button>
            </div>
          </div>
          <div className='home-hero-banner'>
            <div className='slick' style={{ height: '300px', position: 'relative'  }}>
              {/* <CardSwap
                cardDistance={60}
                verticalDistance={70}
                delay={5000}
                pauseOnHover={false}
              >
                <Card>
                  <img src={image1} alt="" width='450px' height='250px' />
                </Card>
                <Card>
                  <img src={image2} alt="" width='450px' height='250px' />
                </Card>
                <Card>
                  <img src={image3} alt="" width='450px' height='250px' />
                </Card>
                <Card>
                  <img src={image4} alt="" width='450px' height='250px' />
                </Card>
                <Card>
                  <img src={image5} alt="" width='450px' height='250px' />
                </Card>
              </CardSwap> */}
              <ShuffleImageGrid/>
            </div>
          </div>
        </div>
      </div>
       <div className="category-container">
      <h2 style={{ paddingLeft: "20px",marginBottom:"20px", color: "#003049" }}>Explore Categories</h2>
      <div className="category-inner-container">
        {categories.map((item, idx) => (
          <div
            key={idx}
            className="category-item"
            style={{ '--hoverColor': item.color }}
            onClick={() => handleCategoryClick(item.category)}
          >
            <img
              src={item.icon}
              alt={item.category}
              className="category-icon"
              width="90px"
              height="90px"
            />
            <div className="category-title">{item.category}</div>
          </div>
        ))}
      </div>
    </div>
      <div className='urgent-container'>
        <div className='urgent-itmes-title'>
          <div className='urgent-itmes-title-inner'>
            <TbUrgent />Urgent: Sensitive Items
          </div>
        </div>

        <div className='urgent-items-container'>
          {urgentItems.map(item => {
            const catData = categories.find(cat => cat.category === item.category);
            return (
              <div className='lost-card' key={item._id}>
                <div className='card-image'>
                  <img src={`http://localhost:5000/uploads/${item.images?.[0]}`} alt={item.title} />
                  <div className='card-labels'>
                    <span className='badge urgent'> URGENT</span>
                    <span className={`badge status ${item.status.toLowerCase()}`}>
                      {item.status === 'Lost' ? ' Lost' : 'Found'}
                    </span> 
                  </div>
                </div>
                <div className='card-content'>
                  <h3 className='lost-title'>{item.title}</h3>
                  <p className='desc'>{item.description}</p>
                  <div className='card-info'>
                    <p>
                      <img src={catData?.icon} alt='category' className='cat-icon' />
                      {item.category}
                    </p>
                    <p><FaMapMarkerAlt /> {item.location}</p>
                    <p><FaCalendarAlt /> Lost on: {new Date(item.lostDate).toLocaleDateString()}</p>
                    {item.reward && (
                      <p className='reward'><FaGift /> <strong>Reward:</strong> <span>{item.reward}</span></p>
                    )}
                  </div>
                  <button className='details-btn' onClick={() => handleViewDetails(item._id)}>View Details</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className='urgent-items-view-all'>
          <button onClick={() => navigate('/browseitems')}>View All Urgent Items</button>
        </div>
      </div>
      <div className='all-itmes-container'>
        <div className='all-itmes-title'>
          <h2>Recently Reported Items</h2>
        </div>
        <div className='all-itmes-container-cards'>
          {nonUrgentItems.map(item => {
            const catData = categories.find(cat => cat.category === item.category);
            return (
              <div className='lost-card' key={item._id}>
                <div className='card-image'>
                  <img src={`http://localhost:5000/uploads/${item.images?.[0]}`} alt={item.title} />
                  <div className='card-labels'>
                    <span className={`badge status ${item.status.toLowerCase()}`}>
                      {item.status === 'Lost' ? 'Lost' : ' Found'}
                    </span>
                  </div>
                </div>
                <div className='card-content'>
                  <h3 className='lost-title'>{item.title}</h3>
                  <p className='desc'>{item.description}</p>
                  <div className='card-info'>
                    <p>
                      <img src={catData?.icon} alt='category' className='cat-icon' />
                      {item.category}
                    </p>
                    <p><FaMapMarkerAlt /> {item.location}</p>
                    <p><FaCalendarAlt /> {item.status === 'Lost' ? 'Lost on:' : 'Found on:'} {new Date(item.lostDate).toLocaleDateString()}</p>
                    {item.reward && (
                      <p className='reward'><FaGift /> <strong>Reward:</strong> <span>{item.reward}</span></p>
                    )}
                  </div>
                  <button className='details-btn' onClick={() => handleViewDetails(item._id)}>View Details</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className='all-items-view'>
          <button onClick={() => navigate('/browseitems')}>View All Items</button>
        </div>
      </div>
      {/* <div className='how-itworks-container'>
        <div className='how-itworks-title'>
          How Lost N Found Works
        </div>
        <div className='how-itworks-items'>
          <div className='how-itworks-itms-divs'>
            <div className='how-itworks-icon'>
              <IoSearchSharp fontWeight='bold' />
            </div>
            <div className='how-itworks-step'>
              1. Report or Search
            </div>
            <div className='how-itworks-text'>
              Easily post details about a lost or found item. Or, search our database using keywords, categories, and location filters.
            </div>
          </div>
          <div className='how-itworks-itms-divs'>
            <div className='how-itworks-icon' style={{ backgroundColor: "#fff9e9" }}>
              <LuScanSearch fontWeight='bold' color='#ffb703' />
            </div>
            <div className='how-itworks-step'>
              2. Get Matched
            </div>
            <div className='how-itworks-text'>
              Our system can help match lost items with found reports. Receive notifications for potential matches.
            </div>
          </div>
          <div className='how-itworks-itms-divs'>
            <div className='how-itworks-icon' >
              <MdOutlineVerifiedUser fontWeight='bold' />
            </div>
            <div className='how-itworks-step'>
              3. Verify & Reclaim
            </div>
            <div className='how-itworks-text'>
              Securely verify ownership and arrange for the return of items. Optional rewards can be offered.
            </div>
          </div>
        </div>
      </div> */}

      <div className="app-container">
      <div className="how-itworks-container">
        <div className="how-itworks-title">
          <h2>How Lost N Found Works</h2>
        </div>

        {/* Animated Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar-wrapper">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Step Circle */}
                <div className="step-circle-container">
                  <div className={`step-circle ${index <= currentStep ? 'step-circle-active' : ''}`}>
                    <div className={`step-number ${index <= currentStep ? 'step-number-active' : ''}`}>
                      <span>{step.id}</span>
                    </div>
                  </div>
                 
                  {/* Step Label */}
                  <div className="step-label-container">
                    <span className={`step-label ${index <= currentStep ? 'step-label-active' : ''}`}>
                      Step {step.id}
                    </span>
                  </div>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="connecting-line-container">
                    <div className="connecting-line-bg">
                      <div className={`connecting-line-fill ${index < currentStep ? 'connecting-line-fill-active' : ''}`} />
                    </div>
                   
                    {/* Animated Dot */}
                    {index === currentStep - 1 && currentStep > 0 && (
                      <div className="animated-dot" />
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="how-itworks-items">
          <div className="steps-grid">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.id}
                  className={`how-itworks-itms-divs ${index === currentStep ? 'step-content-active' : ''}`}
                >
                  <div
                    className={`how-itworks-icon ${index === currentStep ? 'icon-active' : ''}`}
                    style={{
                      backgroundColor: step.bgColor,
                      color: step.color
                    }}
                  >
                    <IconComponent size={32} strokeWidth={2.5} />
                  </div>
                 
                  <div className={`how-itworks-step ${index === currentStep ? 'step-title-active' : ''}`}>
                    {step.title}
                  </div>
                 
                  <div className={`how-itworks-text ${index === currentStep ? 'step-text-active' : ''}`}>
                    {step.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="progress-indicators">
          <div className="indicators-container">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`indicator-dot ${index === currentStep ? 'indicator-dot-active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>

      <div className='faq-container'>
        <div className='faq-faq'>FAQ</div>
        <div className='faq-title'>Answers to our frequently asked questions</div>
        <div className='faq-questions-list'>
          {faqs.map((item, index) => (
            <div className="faq-item" key={index}>
              <div className="faq-question" onClick={() => toggle(index)}>
                <span>{item.question}</span>
                <span className={`arrow ${activeIndex === index ? 'open' : ''}`}>&#10148;</span>
              </div>
              <div className={`faq-answer ${activeIndex === index ? 'show' : ''}`}>
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;