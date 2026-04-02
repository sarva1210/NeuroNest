import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const url = isLogin ? "/auth/login" : "/auth/register";

      const res = await API.post(url, { email, password });

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
      }

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-950 text-white px-4">

      <div className="w-full max-w-5xl bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-2">

        {/* LEFT SIDE (GRADIENT) */}
        <div className="hidden md:flex flex-col justify-between p-8 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500">

          <div className="text-3xl font-bold">✦</div>

          <div>
            <p className="text-sm opacity-80 mb-2">You can easily</p>
            <h2 className="text-2xl font-semibold leading-snug">
              Get access your personal hub for clarity and productivity
            </h2>
          </div>
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="p-8 flex flex-col justify-center">

          <h2 className="text-2xl font-semibold mb-2">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>

          <p className="text-sm text-zinc-400 mb-6">
            {isLogin
              ? "Login to access your brain"
              : "Start building your second brain"}
          </p>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3 w-full p-3 rounded-lg bg-zinc-800 outline-none"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-5 w-full p-3 rounded-lg bg-zinc-800 outline-none"
          />

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-medium transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          {/* TOGGLE */}
          <p
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-center text-zinc-400 mt-4 cursor-pointer"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </p>

        </div>
      </div>
    </div>
  );
}