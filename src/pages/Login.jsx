import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFirebase } from "../context/Firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { signinUserWithEmailAndPassword, signinWithGoogle, isLoggedIn, loading } = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate("/");
    }
  }, [loading, isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Logging in user");

    try {
      const result = await signinUserWithEmailAndPassword(email, password);
      console.log("Successful login:", result);
      navigate("/"); // Redirect after successful login
    } catch (error) {
      console.error("Error logging in:", error.message);
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signinWithGoogle();
      console.log("Successful Google sign-in:", result);
      navigate("/"); // Redirect after successful Google sign-in
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.error("Google sign-in popup was closed before completing the sign-in.");
        setError("Google sign-in was canceled. Please try again.");
      } else {
        console.error("Error signing in with Google:", error.message);
        setError(error.message);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button className="button" variant="primary" type="submit">
          Login
        </Button>

        {error && <p className="text-danger mt-2">{error}</p>}
      </Form>
      <br/>
      <h3>Or</h3>
      <br/>
      <Button onClick={handleGoogleSignIn} className="button" variant="primary">
        Sign-in with Google
      </Button>
    </div>
  );
};

export default Login;
