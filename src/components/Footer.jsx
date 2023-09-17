// Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer({ className }) {
    return (
        <footer className="body" >
            <div className="footer" >

        <p>Contact: kamil.jacek2525@gmail.com</p>
        <nav className="footer-nav">
                <Link to="/" className="footer-link" >Home</Link>
                <Link to="/login" className="footer-link" >Login</Link>
                <Link to="/register" className="footer-link">Register</Link>
                <Link to="/account" className="footer-link">Account</Link>
                <Link to="/additem" className="footer-link">Add Item</Link>
                <Link to="/category" className="footer-link">Category</Link>
                <Link to="/chatpage" className="footer-link">Chat</Link>
                
            </nav>
            </div>

        </footer>
    );
}

export default Footer;
