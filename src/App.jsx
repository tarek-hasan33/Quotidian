import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { Home } from "./pages/Home";
import { Search } from "./pages/Search";
import { ChatBubble } from "./components/chat/ChatBubble";
import { Favourites } from "./pages/Favourites";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";

export const App = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route
        path="/favourites"
        element={
          <ProtectedRoute>
            <Favourites />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
    <ChatBubble />
  </BrowserRouter>
);
