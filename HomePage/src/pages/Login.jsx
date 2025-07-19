import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaIdBadge } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { HashLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupRoll, setSignupRoll] = useState("");
  const [signupError, setSignupError] = useState("");

  const [loginRoll, setLoginRoll] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();

  const [showForgotForm, setShowForgotForm] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");


  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signin", {
        rollNumber: loginRoll,
        password: loginPassword,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", res.data.userId);
      toast.success("Login successful!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!adminId || !adminPassword) {
      toast.error("Please enter both Admin ID and Password");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        adminId,
        password: adminPassword,
      });

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("isAdminLoggedIn", "true");

      toast.success("Valid User");
      console.log("Loggin is Sucess")
      setTimeout(() => navigate("/admin-dashboard"), 1500);
      // navigate("/admin-dashboard")
      console.log("Navigated Success");
    } catch (err) {
      toast.error(err.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(aec\.edu\.in|acet\.ac\.in|adityauniversity\.in|acoe\.edu\.in)$/;
    const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.*\d).{8,}$/;

    if (!emailRegex.test(signupEmail)) {
      setSignupError("Email must end with aec.edu.in, acet.ac.in, or adityauniversity.in or acoe.edu.in");
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(signupPassword)) {
      setSignupError("Password must be 8 characters long with at least 1 uppercase, 1 lowercase, and 1 number");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name: signupName,
        rollNumber: signupRoll,
        email: signupEmail,
        password: signupPassword,
      });

      toast.success("Registered successfully!");
      setIsSignUp(false);
      setSignupEmail("");
      setSignupPassword("");
      setSignupName("");
      setSignupRoll("");
      setSignupError("");
    } catch (err) {
      setSignupError(err.response?.data?.message || "Registration failed");
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", {
        email: forgotEmail,
      });
      toast.success("OTP sent to registered email");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: forgotEmail,
        otp,
      });
      toast.success("OTP Verified");
      setIsOtpVerified(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error("Password must include 1 uppercase, 1 lowercase, 1 number, 1 special character and 6+ chars");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email: forgotEmail,
        otp,
        newPassword,
        confirmPassword,
      });
      toast.success("Password changed successfully!");
      setShowForgotForm(false);
      setOtpSent(false);
      setIsOtpVerified(false);
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="auth-page">
      <ToastContainer position="top-right" autoClose={2000} />
      {loading && (
        <div className="loader-overlay">
          <HashLoader color="#36d7b7" loading={true} size={60} />
        </div>
      )}

      <div className={`flip-container ${isAdminMode ? "flip" : ""}`}>
        <div className="flipper">
          <div className="back">
            <div className="admin-login-wrapper">
              <form className="admin-form-container" onSubmit={handleAdminLogin} autoComplete="off">
                <h2 className="auth-title">Admin Login</h2>
                <div className="auth-input-field">
                  <FaIdBadge />
                  <input
                    type="text"
                    placeholder="Admin ID"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                    // autoComplete="off"
                  />
                </div>
                <div className="auth-input-field">
                  <FaLock />
                  <input
                    type="password"
                    placeholder="Password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    // autoComplete="new-password"
                  />
                </div>
                <div className="admin-btn-container">
                  <button type="submit" className="auth-btn"  >Login</button>
                  <button type="button" className="auth-btn ghost" style={{ marginTop: "15px" }} onClick={() => setIsAdminMode(false)}>User</button>
                </div>
              </form>
            </div>
          </div>

          {/* User Login, Sign Up & Forgot Password */}
          <div className="front">
            <div className={`auth-container ${isSignUp ? "auth-signup-mode" : ""}`}>

              {/* Sign Up */}
              <div className="form-container sign-up">
                <form onSubmit={handleRegister}>
                  <h2 className="auth-title">Sign Up</h2>
                  <div className="auth-input-field"><FaUser />
                    <input type="text" placeholder="Name" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
                  </div>
                  <div className="auth-input-field"><FaIdBadge />
                    <input type="text" placeholder="Roll Number" value={signupRoll} onChange={(e) => setSignupRoll(e.target.value)} required />
                  </div>
                  <div className="auth-input-field"><FaEnvelope />
                    <input type="email" placeholder="College Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
                  </div>
                  <div className="auth-input-field"><FaLock />
                    <input type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
                  </div>
                  {signupError && <p className="auth-error">{signupError}</p>}
                  <button type="submit" className="auth-btn">Sign Up</button>
                </form>
              </div>

              {/* Sign In / Forgot Password */}
              <div className="form-container sign-in">
                {!showForgotForm ? (
                  <form onSubmit={handleLogin}>
                    <h2 className="auth-title">Sign In</h2>
                    <div className="auth-input-field"><FaUser />
                      <input type="text" placeholder="Roll Number" value={loginRoll} onChange={(e) => setLoginRoll(e.target.value)} required />
                    </div>
                    <div className="auth-input-field"><FaLock />
                      <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                    </div>
                    <p className="auth-forgot" onClick={() => setShowForgotForm(true)}>Forgot Password?</p>
                    <button type="submit" className="auth-btn">Sign In</button>
                    <button type="button" className="auth-btn ghost" onClick={() => setIsAdminMode(true)}>Admin</button>
                  </form>
                ) : !otpSent ? (
                  <form onSubmit={handleSendOtp}>
                    <h2 className="auth-title">Forgot Password</h2>
                    <div className="auth-input-field">
                      <FaEnvelope />
                      <input
                        type="email"
                        placeholder="Enter Registered Email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="auth-btn">Send OTP</button>
                    <p className="auth-forgot" onClick={() => setShowForgotForm(false)}>Back to Login</p>
                  </form>
                ) : !isOtpVerified ? (
                  <form onSubmit={handleVerifyOtp}>
                    <h2 className="auth-title">Verify OTP</h2>
                    <p>Enter the 6-digit OTP sent to your email</p>
                    <div className="otp-input-container">
                      {Array(6).fill("").map((_, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength={1}
                          className="otp-box"
                          value={otp[index] || ""}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            if (!val) return;
                            const newOtp = otp.split("");
                            newOtp[index] = val;
                            setOtp(newOtp.join(""));
                            const next = e.target.nextSibling;
                            if (next) next.focus();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace") {
                              const newOtp = otp.split("");
                              newOtp[index] = "";
                              setOtp(newOtp.join(""));
                              const prev = e.target.previousSibling;
                              if (prev) prev.focus();
                            }
                          }}
                          required
                        />
                      ))}
                    </div>
                    <button type="submit" className="auth-btn">Verify OTP</button>
                    <p className="auth-forgot" onClick={() => {
                      setShowForgotForm(false);
                      setOtpSent(false);
                      setOtp("");
                    }}>Back to Login</p>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword}>
                    <h2 className="auth-title">Reset Password</h2>

                    <div className="auth-input-field"> <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required

                    />
                    </div>
                    <div className="auth-input-field"><input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    /></div>

                    <button type="submit" className="auth-btn">Change Password</button>
                    <p className="auth-forgot" onClick={() => {
                      setShowForgotForm(false);
                      setOtpSent(false);
                      setIsOtpVerified(false);
                      setOtp("");
                      setForgotEmail("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}>Back to Login</p>
                  </form>
                )}
              </div>

              <div className="toggle-container">
                <div className="toggle">
                  <div className="toggle-panel toggle-left">
                    <h2>Welcome Back!</h2>
                    <p>Already have an account?</p>
                    <button className="auth-btn ghost" onClick={() => { setIsSignUp(false); setShowForgotForm(false); }}>Sign In</button>
                  </div>
                  <div className="toggle-panel toggle-right">
                    <h2>Hello, Friend!</h2>
                    <p>Register now to access all features</p>
                    <button className="auth-btn ghost" onClick={() => { setIsSignUp(true); setShowForgotForm(false); }}>Sign Up</button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );

};

export default Login;


