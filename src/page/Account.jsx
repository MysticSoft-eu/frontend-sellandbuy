import { UserContext } from "../UserContext";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import AddItem from "./AddItem";
import UserItems from "./UserItems";
import "../styles/account.css";
import { FaEnvelope, FaShoppingCart, FaUserCircle } from "react-icons/fa";

export default function AccountPage() {

    // Getting user data and readiness info from User Context
    const { ready, user } = useContext(UserContext);
    
    // Getting subpage from route params
    let { subpage } = useParams();
    if (subpage === undefined) {
        subpage = 'profile'; // Default to 'profile' if subpage is undefined
    }

    // Function to log out the user
    async function logout() {
        try {
            // Performing GET request to the logout endpoint
            const response = await axios.get('/logout', {}, { withCredentials: true });
            console.log(response.data);

            // Redirecting to home page after successful logout
            window.location.href = '/';
        } catch (error) {
            console.error(error); // Log errors if any occur during logout
        }
    }

    // Redirect to login page if user is not logged in and ready
    if (ready && !user) {
        return <Navigate to={'/login'} />;
    }

    // Rendering different components based on whether user is logged in and on subpage value
    if (user) {
        return (
            <div>
                <nav className="nav">
                    <Link to={'/account'}>MY profile</Link>
                    <Link to={'/account/listing'}>MY listing</Link>
                </nav>

                {/* Rendering user profile information if subpage equals 'profile' */}
                {subpage === 'profile' && (
                    <div className="userInfo">
                        <FaUserCircle className="userInfoICON" />
                        Logged in as {user.name} {user.email} <br />
                        <button className="logoutButton" onClick={logout}>Logout</button>
                    </div>
                )}
                
                {/* Rendering user listings if subpage equals 'listing' */}
                {subpage === 'listing' && (
                    <div>
                        <UserItems />
                    </div>
                )}
            </div>
        );
    }
}
