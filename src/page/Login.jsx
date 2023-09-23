import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext.jsx";
import styles from '../styles/Login.module.css';
import axios from "axios";

export default function Login() {
  // State to store email, password, and redirect status
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);

  // Access the setUser function from the UserContext
  const { setUser } = useContext(UserContext);

  // Function to handle form submission when logging in
  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      // Send a POST request to the login endpoint with email and password
      const { data } = await axios.post('/login', { email, password });
      // Update the user context with the logged-in user
      setUser(data);
      // Show a success alert
      alert('Login successful');
      // Redirect to the home page
      setRedirect(true);
    } catch (e) {
      // Show an error alert if login fails
      alert('Login failed. Please try again later');
    }
  }

  // If the redirect state is true, navigate to the home page
  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <div>
      <div className={styles.container}>
        <form onSubmit={handleLoginSubmit} className={styles.form}>
          <h2 className={styles.title}>Login</h2>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.button}>
            Login
          </button>
          {/* Link to the registration page */}
          <Link to="/register" className={styles.registerButton}>
            Register
          </Link>
        </form>
      </div>
    </div>
  );
};
