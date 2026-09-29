import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Exams from "./pages/Exams/Exams";
import Notes from "./pages/Notes/Notes";
import Quiz from "./pages/Quiz/Quiz";
import Dashboard from "./pages/Dashboard/Dashboard";

import ExamDetail from "./pages/ExamDetail/ExamDetail";
import ExamNotes from "./pages/ExamNotes/ExamNotes";
import ExamQuiz from "./pages/ExamQuiz/ExamQuiz";
import WrongAnswerQuiz from "./pages/WrongAnswerQuiz/WrongAnswerQuiz";

import Ranking from "./pages/Ranking/Ranking";
import Badges from "./pages/Badges/Badges";
import Settings from "./pages/Settings/Settings";

/* 신규 기능 페이지 */

import Streak from "./pages/Streak/Streak";
import Favorites from "./pages/Favorites/Favorites.tsx";
import WeaknessMode from "./pages/Weakness/Weakness";
import RandomExam from "./pages/RandomExam/RandomExam";
import Calendar from "./pages/Calendar/Calendar";
import XPShop from "./pages/XPShop/XPShop";

function App() {
  return (
    <HashRouter>
      <Routes>

        {/* 기본 */}

        <Route path="/" element={<Home />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 기존 */}

        <Route path="/ranking" element={<Ranking />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/settings" element={<Settings />} />

        {/* 시험 */}

        <Route path="/exam/:id" element={<ExamDetail />} />
        <Route path="/exam/:id/notes" element={<ExamNotes />} />
        <Route path="/exam/:id/quiz" element={<ExamQuiz />} />

        <Route
          path="/wrong-answer-quiz/:examId"
          element={<WrongAnswerQuiz />}
        />

        {/* 신규 기능 */}

        <Route
          path="/streak"
          element={<Streak />}
        />

        <Route
          path="/favorites"
          element={<Favorites />}
        />

        <Route
          path="/weakness"
          element={<WeaknessMode />}
        />

        <Route
          path="/random-exam"
          element={<RandomExam />}
        />

        <Route
          path="/calendar"
          element={<Calendar />}
        />

        <Route
          path="/xp-shop"
          element={<XPShop />}
        />

      </Routes>
    </HashRouter>
  );
}

export default App;