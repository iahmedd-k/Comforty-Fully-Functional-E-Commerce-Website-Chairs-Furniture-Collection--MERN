import React, { useState } from "react";
import Footer from "../components/fotter";
import Navbar from "../components/Navbar";

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
            onSubmit={(e) => {
              e.preventDefault();
              // Handle forgot password logic here
              alert(`Password reset link has been sent to ${forgotPasswordEmail}`);
              setShowForgotPassword(false);
            }}
          />
        ) : isSignIn ? (
          <SignInForm
            signInData={signInData}
            setSignInData={setSignInData}
            onSubmit={(e) => e.preventDefault()}
            onForgotPassword={() => setShowForgotPassword(true)}
          />
        ) : (
          <SignUpForm
            signUpData={signUpData}
            setSignUpData={setSignUpData}
            onSubmit={(e) => e.preventDefault()}
          />
        )}

        {/* Switch Links - Only show when not in forgot password mode */}
        {!showForgotPassword && (
          <div className="mt-6 text-center text-sm text-gray-700">
            {isSignIn ? (
              <>
                Don't have an account?{" "}
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
                Already have an account?{" "}
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
