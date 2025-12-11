import React, { useState } from "react";

export default function AuthForm({ onAuth, mode = "login", onModeChange }) {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const isSignup = mode === "signup";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password || (isSignup && !form.confirm)) {
      setError("모든 필드를 입력하세요.");
      return;
    }
    if (isSignup && form.password !== form.confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    onAuth(form.email, form.password, isSignup);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-12 px-4">
      <div className="max-w-md w-full bg-white/80 rounded-3xl shadow-2xl p-10 backdrop-blur-xl border border-white/60 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-8 drop-shadow-lg">
          {isSignup ? "회원가입" : "로그인"}
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-bold mb-2">이메일</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:border-indigo-400 focus:outline-none bg-white/90 shadow-inner text-lg"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:border-indigo-400 focus:outline-none bg-white/90 shadow-inner text-lg"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          {isSignup && (
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                name="confirm"
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:border-indigo-400 focus:outline-none bg-white/90 shadow-inner text-lg"
                value={form.confirm}
                onChange={handleChange}
                required
              />
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center font-bold mt-2">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-indigo-400 via-pink-400 to-green-400 text-white font-extrabold text-lg shadow-lg hover:scale-105 transition-transform"
          >
            {isSignup ? "회원가입" : "로그인"}
          </button>
        </form>
        <div className="mt-6 text-center">
          {isSignup ? (
            <button
              type="button"
              className="text-indigo-500 font-bold hover:underline"
              onClick={() => onModeChange && onModeChange("login")}
            >
              이미 계정이 있으신가요? <span className="underline">로그인</span>
            </button>
          ) : (
            <button
              type="button"
              className="text-indigo-500 font-bold hover:underline"
              onClick={() => onModeChange && onModeChange("signup")}
            >
              계정이 없으신가요? <span className="underline">회원가입</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
