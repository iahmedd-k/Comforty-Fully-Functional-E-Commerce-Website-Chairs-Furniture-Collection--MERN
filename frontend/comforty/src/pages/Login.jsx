import React, { useState } from "react";
import Footer from "../components/Fotter";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

import  {login, register, forgotPassword}  from "../api/auth.js";

// -------------------- Input Component --------------------
const InputField = ({ type, placeholder, id, name, value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    className="w-full h-12 px-4 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg
               focus:ring-2 focus:ring-teal-500 focus:outline-none"
  />
);

// -------------------- Sign In Form --------------------
const SignInForm = ({ signInData, setSignInData, onSubmit, onForgotPassword }) => (
  <>
    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Sign In</h2>

    <form className="space-y-4" onSubmit={onSubmit}>
      <InputField
        type="email"
        placeholder="Email"
        id="email"
        name="email"
        value={signInData.email}
        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
      />

      {/* Password with Eye Icon */}
      <div className="relative">
        <InputField
          type="password"
          placeholder="Password"
          id="password"
          name="password"
          value={signInData.password}
          onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
        />

        <span className="absolute right-4 top-3 text-gray-500 cursor-pointer">
          👁
        </span>
      </div>

      {/* Remember Me + Forget Password */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" className="form-checkbox text-teal-500" />
          <span className="text-gray-600">Remember Me</span>
        </label>

        <button
          type="button"
          onClick={onForgotPassword}
          className="text-teal-600 hover:underline"
        >
          Forget Password
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-teal-600 text-white font-medium rounded-lg
                   hover:bg-teal-700 transition"
      >
        Sign In →
      </button>
    </form>
  </>
);

// -------------------- Sign Up Form --------------------
const SignUpForm = ({ signUpData, setSignUpData, onSubmit }) => (
  <>
    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Sign Up</h2>

    <form className="space-y-4" onSubmit={onSubmit}>
      <InputField
        type="text"
        placeholder="Full Name"
        id="name"
        name="name"
        value={signUpData.name}
        onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
      />

      <InputField
        type="email"
        placeholder="Email"
        id="email-up"
        name="email-up"
        value={signUpData.email}
        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
      />

      <InputField
        type="password"
        placeholder="Create Password"
        id="password-up"
        name="password-up"
        value={signUpData.password}
        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
      />

      <InputField
        type="password"
        placeholder="Confirm Password"
        id="confirm-password"
        name="confirm-password"
        value={signUpData.confirm}
        onChange={(e) => setSignUpData({ ...signUpData, confirm: e.target.value })}
      />

      <button
        type="submit"
        className="w-full py-3 bg-teal-600 text-white font-medium rounded-lg
                   hover:bg-teal-700"
      >
        Create Account →
      </button>
    </form>
  </>
);

// -------------------- Forgot Password Form --------------------
const ForgotPasswordForm = ({ onBack, email, setEmail, onSubmit }) => (
  <>
    <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Forgot Password</h2>
    <p className="text-sm text-gray-600 mb-6 text-center">
      Enter your email address and we'll send you a link to reset your password.
    </p>

    <form className="space-y-4" onSubmit={onSubmit}>
      <InputField
        type="email"
        placeholder="Email"
        id="forgot-email"
        name="forgot-email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        type="submit"
        className="w-full py-3 bg-teal-600 text-white font-medium rounded-lg
                   hover:bg-teal-700 transition"
      >
        Send Reset Link →
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full py-2 text-teal-600 hover:text-teal-700 font-medium text-sm"
      >
        ← Back to Sign In
      </button>
    </form>
  </>
);

// -------------------- Main Component --------------------
const AuthCard = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
const navigate = useNavigate();


  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await login(signInData);

    // Save token
    localStorage.setItem("token", res.data.token);

    alert("Login successful!");
        navigate("/");

  } catch (error) {
    alert(error.response?.data?.message || "Login failed");
  }
};

const handleRegister = async (e) => {
  e.preventDefault();

  if (signUpData.password !== signUpData.confirm) {
    return alert("Passwords do not match");
  }

  try {
    await register({
      name: signUpData.name,
      email: signUpData.email,
      password: signUpData.password
    });

    alert("Account created successfully!");
    setIsSignIn(true); // redirect to login form
  } catch (error) {
    alert(error.response?.data?.message || "Registration failed");
  }
};

const handleForgotPassword = async (e) => {
  e.preventDefault();

  try {
    await forgotPassword(forgotPasswordEmail);
    alert("Password reset link sent!");
    setShowForgotPassword(false);
  } catch (error) {
    alert(error.response?.data?.message || "Error sending reset email");
  }
};

  return (
    <>
<Navbar />
    <div className="min-h-screen bg-[#f5f6f7] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-gray-200">
        {showForgotPassword ? (
          <ForgotPasswordForm
            onBack={() => setShowForgotPassword(false)}
            email={forgotPasswordEmail}
            setEmail={setForgotPasswordEmail}
            onSubmit={handleForgotPassword}
          />
        ) : isSignIn ? (
          <SignInForm
            signInData={signInData}
            setSignInData={setSignInData}
            onSubmit={handleLogin}
            onForgotPassword={() => setShowForgotPassword(true)}
          />
        ) : (
          <SignUpForm
            signUpData={signUpData}
            setSignUpData={setSignUpData}
            onSubmit={handleRegister}
          />
        )}

        {/* Switch Links - Only show when not in forgot password mode */}
        {!showForgotPassword && (
          <div className="mt-6 text-center text-sm text-gray-700">
            {isSignIn ? (
              <>
                Don't have an account? {" "}
                <button
                  type="button"
                  onClick={() => setIsSignIn(false)}
                  className="text-teal-600 hover:underline font-medium"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account? {" "}
                <button
                  type="button"
                  onClick={() => setIsSignIn(true)}
                  className="text-teal-600 hover:underline font-medium"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        )}
      </div>

    </div>
    <Footer />
    </>
  );
};

export default AuthCard;
