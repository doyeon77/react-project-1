import React, { useState } from "react";
import { UserContext } from "./UserContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";

import NavBar from "./components/NavBar";
import Header from "./components/Header";
import AuthForm from "./components/AuthForm";
import ErrorBoundary from "./components/ErrorBoundary";

import Home from "./pages/Home";
import Today from "./pages/Today";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";

// 예시 데이터: 과거 복용 약 테스트용 (실제 서비스에서는 제거)
const exampleMeds = [
  {
    id: "1",
    name: "타이레놀",
    type: "진통제",
    startDate: "2025-11-01",
    endDate: "2025-11-10",
    days: ["월", "화", "수", "목", "금", "토", "일"],
    times: [
      { category: "아침", time: "08:00" },
      { category: "저녁", time: "20:00" },
    ],
    takenRecords: {},
  },
  {
    id: "2",
    name: "판콜에이",
    type: "감기약",
    startDate: "2025-10-15",
    endDate: "2025-10-25",
    days: ["월", "화", "수", "목", "금", "토", "일"],
    times: [{ category: "점심", time: "12:00" }],
    takenRecords: {},
  },
  {
    id: "3",
    name: "센트룸",
    type: "비타민",
    startDate: "2025-09-01",
    endDate: "2025-09-15",
    days: ["월", "화", "수", "목", "금", "토", "일"],
    times: [{ category: "아침", time: "08:30" }],
    takenRecords: {},
  },
  {
    id: "4",
    name: "게보린",
    type: "진통제",
    startDate: "2025-09-01",
    endDate: "2025-09-10",
    days: ["월", "화", "수", "목", "금", "토", "일"],
    times: [{ category: "아침", time: "08:00" }],
    takenRecords: {},
  },
  {
    id: "5",
    name: "우루사",
    type: "간장약",
    startDate: "2025-09-15",
    endDate: "2025-09-25",
    days: ["월", "화", "수", "목", "금", "토", "일"],
    times: [{ category: "저녁", time: "20:00" }],
    takenRecords: {},
  },
  {
    id: "6",
    name: "케토톱",
    type: "소염진통제",
    startDate: "2025-10-01",
    endDate: "2025-10-10",
    days: ["월", "화", "수", "목", "금", "토", "일"],
    times: [{ category: "점심", time: "12:00" }],
    takenRecords: {},
  },
  {
    id: "8",
    name: "써스펜",
    type: "해열진통제",
    startDate: "2025-10-15",
    endDate: "2025-10-25",
    days: ["월", "화", "수", "목", "금", "토", "일"],
    times: [{ category: "아침", time: "08:30" }],
    takenRecords: {},
  },
  {
    id: "9",
    name: "아로나민골드",
    type: "비타민",
    startDate: "2025-11-01",
    endDate: "2025-11-10",
    days: ["월", "화", "수", "목", "금", "토", "일"],
    times: [{ category: "저녁", time: "19:00" }],
    takenRecords: {},
  },
  {
    id: "10",
    name: "액티피드",
    type: "감기약",
    startDate: "2025-11-15",
    endDate: "2025-11-25",
    days: ["월", "화", "수", "목", "금", "토", "일"],
    times: [{ category: "아침", time: "08:00" }],
    takenRecords: {},
  },
];

export default function App() {
  // 인증 상태 및 모드 관리
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("current_user");
    return saved ? JSON.parse(saved) : null;
  }); // { email: ... }
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'

  // 데모용 임시 사용자 DB (실제 서비스는 서버 연동 필요)
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("demo_users");
    return saved ? JSON.parse(saved) : [];
  });

  // 약 데이터 관리 (사용자별)
  const userKey = user?.email ? `medications_${user.email}` : "medications";
  const [medications, setMedications] = useLocalStorage(userKey, exampleMeds);
  // 기존 배열을 덮어쓰지 않고, 항상 함수형 업데이트를 지원
  const updateMedication = (updater) => {
    setMedications((prev) => {
      const newMedList =
        typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem(userKey, JSON.stringify(newMedList));
      return newMedList;
    });
  };

  const handleAuth = (email, password, isSignup) => {
    if (isSignup) {
      if (users.find((u) => u.email === email)) {
        alert("이미 가입된 이메일입니다.");
        return;
      }
      const newUsers = [...users, { email, password }];
      setUsers(newUsers);
      localStorage.setItem("demo_users", JSON.stringify(newUsers));
      alert("회원가입이 완료되었습니다. 로그인해 주세요.");
      setAuthMode("login");
    } else {
      const found = users.find(
        (u) => u.email === email && u.password === password
      );
      if (!found) {
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
      }
      setUser({ email });
      localStorage.setItem("current_user", JSON.stringify({ email }));
    }
  };

  if (!user) {
    return (
      <AuthForm
        mode={authMode}
        onAuth={handleAuth}
        onModeChange={setAuthMode}
      />
    );
  }

  return (
    <UserContext.Provider value={{ user, medications, updateMedication }}>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-green-100 flex flex-col">
          <Header />
          <NavBar />
          <main className="flex-1 flex justify-center items-start py-10 animate-fade-in">
            <section className="w-full max-w-4xl bg-white/90 backdrop-blur-2xl shadow-2xl rounded-3xl p-10 border border-white/40">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/today" element={<Today />} />
                  <Route path="/stats" element={<Dashboard />} />
                </Routes>
              </ErrorBoundary>
            </section>
          </main>
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
