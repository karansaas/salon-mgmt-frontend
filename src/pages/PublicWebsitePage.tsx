import { useState } from 'react';
import { Link } from 'react-router-dom';
import salonChairs from '../assets/lush-salon-chairs.jpg';
import salonWash from '../assets/lush-salon-wash.jpg';
import salonStudio from '../assets/lush-salon-studio.jpg';
import '../styles/public-site.css';

const phoneLink = 'tel:+919041078072';
const whatsappLink = 'https://wa.me/919041078072?text=Hello%20Lush%20Unisex%20Salon%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services.';
const instagramUrl = 'https://www.instagram.com/lush_unisexsalon?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==';
const mapUrl = 'https://maps.app.goo.gl/2QVhkvpudnVyPDp7A';
const reels = ['C-POuX1OCgL', 'C81MIUCu9vz', 'C0Si1jBvXPa', 'CzEVaHHrS9W', 'Cx3rYiIydKc', 'C_2BseXxMUF'];

const serviceCategories = [
  { number: '01', title: 'Haircut & Grooming', text: 'Precision haircuts, beard trims, shaving, styling and thoughtful grooming for every look.' },
  { number: '02', title: 'Hair Care & Treatments', text: 'Hair spa, smoothening, keratin, botox, curls and restorative treatments for healthy hair.' },
  { number: '03', title: 'Colour & Transformation', text: 'Hair colour, root touch-ups and beard colour guided by salon professionals.' },
  { number: '04', title: 'Skin & Self-Care', text: 'Threading, face wax, D-Tan, scrubs, manicures, pedicures and relaxing head massage.' },
  { number: '05', title: "Women's Hair Studio", text: "Women's haircuts, trims, washes, ironing, spa and styling tailored to your hair." },
];

export const PublicWebsitePage = () => {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return <main className="public-site">
    <header className="public-nav">
      <a href="#home" onClick={closeMenu} className="public-brand"><span>LUSH</span><small>UNISEX SALON</small></a>
      <button type="button" className="public-menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle navigation">{open ? '×' : '☰'}</button>
      <nav className={open ? 'public-nav-links public-nav-links-open' : 'public-nav-links'} aria-label="Main navigation">
        {['Home', 'About Us', 'Services', 'Testimonials', 'Contact Us'].map((label) => <a key={label} href={`#${label.toLowerCase().replace(/ /g, '-')}`} onClick={closeMenu}>{label}</a>)}
      </nav>
    </header>

    <section id="home" className="public-hero">
      <img src={salonChairs} alt="Styling chairs at Lush Unisex Salon" />
      <div className="public-hero-overlay" />
      <div className="public-hero-content">
        <p className="public-eyebrow">Jagraon's modern salon destination</p>
        <h1>Look good.<br /><em>Feel luminous.</em></h1>
        <p className="public-hero-copy">Modern hair, grooming and self-care services for women, men and little ones.</p>
        <a className="public-outline-button" href="#services">Explore our services <span>→</span></a>
      </div>
      <p className="public-scroll-note">SCROLL TO DISCOVER</p>
    </section>

    <section id="about-us" className="public-about public-section">
      <div className="public-section-intro"><p className="public-eyebrow">THE LUSH EXPERIENCE</p><h2>A little pause.<br />A lot of <em>confidence.</em></h2></div>
      <div className="public-about-copy"><p>At Lush Unisex Salon, every appointment is made to feel personal. From a quick fresh cut to a complete transformation, our team combines current techniques, quality professional products and a warm salon experience.</p><p>Come in for the service you need and leave feeling refreshed, cared for and ready for your day.</p><a href="#contact-us" className="public-text-link">Visit our salon <span>→</span></a></div>
    </section>

    <section className="public-showcase" aria-label="Lush salon interiors">
      <figure><img src={salonStudio} alt="Gold-framed styling stations at Lush Unisex Salon" /><figcaption>Designed for comfort</figcaption></figure>
      <figure className="public-showcase-feature"><img src={salonWash} alt="L'Oréal professional wash stations at Lush Unisex Salon" /><figcaption>Professional care</figcaption></figure>
      <figure><img src={salonChairs} alt="Salon styling chairs" /><figcaption>Modern grooming</figcaption></figure>
    </section>

    <section id="services" className="public-services public-section">
      <div className="public-section-intro"><p className="public-eyebrow">WHAT WE DO</p><h2>Beauty that feels<br /><em>like you.</em></h2></div>
      <div className="public-service-list">{serviceCategories.map((service) => <article key={service.number} className="public-service-card"><span>{service.number}</span><div><h3>{service.title}</h3><p>{service.text}</p></div><b>↗</b></article>)}</div>
    </section>

    <section className="public-feature-banner">
      <img src={salonStudio} alt="Lush Unisex Salon interior" />
      <div><p className="public-eyebrow">YOUR NEXT SALON DAY</p><h2>Time set aside<br />just for <em>you.</em></h2><a href={phoneLink}>Call 90410-78072 <span>→</span></a></div>
    </section>

    <section id="testimonials" className="public-testimonials public-section">
      <div className="public-section-intro"><p className="public-eyebrow">CLIENT LOVE</p><h2>Made to leave<br />you <em>smiling.</em></h2></div>
      <div className="public-quote-grid">
        <blockquote>“Such a clean, comfortable salon and a very welcoming experience. The finish was exactly what I wanted.”<cite>— A Lush client</cite></blockquote>
        <blockquote>“Great attention to detail, professional service and a lovely space. I will definitely be coming back.”<cite>— A Lush client</cite></blockquote>
        <blockquote>“From consultation to styling, everything felt easy and well looked after.”<cite>— A Lush client</cite></blockquote>
      </div>
    </section>

    <section className="public-instagram public-section">
      <div className="public-instagram-heading"><div><p className="public-eyebrow">FOLLOW THE TRANSFORMATIONS</p><h2>Fresh looks on<br /><em>Instagram.</em></h2></div><a className="public-dark-button" href={instagramUrl} target="_blank" rel="noreferrer">Follow @lush_unisexsalon <span>↗</span></a></div>
      <div className="public-reel-grid">{reels.map((reel) => <a key={reel} className="public-reel" href={`https://www.instagram.com/reel/${reel}/`} target="_blank" rel="noreferrer" aria-label="Watch Lush Unisex Salon reel on Instagram"><iframe title={`Lush salon Instagram reel ${reel}`} src={`https://www.instagram.com/reel/${reel}/embed/captioned/`} loading="lazy" /></a>)}</div>
      <p className="public-instagram-note">Tap a reel to watch the latest work from Lush Unisex Salon.</p>
    </section>

    <section id="contact-us" className="public-contact">
      <div className="public-contact-copy"><p className="public-eyebrow">FIND US</p><h2>Your next<br /><em>good hair day</em><br />starts here.</h2><p>GREWAL DOWN TOWN, opp. S S P OFFICE,<br />Tehsil Road, Jagraon, Punjab 142026</p><div className="public-contact-numbers"><a href="tel:+911624511957">01624-511957</a><a href={phoneLink}>90410-78072</a></div><a className="public-text-link" href={mapUrl} target="_blank" rel="noreferrer">Get directions <span>↗</span></a></div>
      <div className="public-map"><iframe title="Lush Unisex Salon location" src="https://www.google.com/maps?q=GREWAL%20DOWN%20TOWN%2C%20opp.%20S%20S%20P%20OFFICE%2C%20Tehsil%20Road%2C%20Jagraon%2C%20Punjab%20142026&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
    </section>

    <footer className="public-footer"><div className="public-brand"><span>LUSH</span><small>UNISEX SALON</small></div><p>Hair · Grooming · Beauty · Self-care</p><div><a href={instagramUrl} target="_blank" rel="noreferrer">Instagram</a><Link to="/admin">Admin</Link></div><small>© {new Date().getFullYear()} Lush Unisex Salon. All rights reserved.</small></footer>

    <a className="public-whatsapp" href={whatsappLink} target="_blank" rel="noreferrer" aria-label="Message Lush Unisex Salon on WhatsApp">◔ <span>WhatsApp us</span></a>
    <a className="public-call-bar" href={phoneLink}>☎ <span>Call Lush Unisex Salon</span><strong>90410-78072</strong></a>
  </main>;
};
