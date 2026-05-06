import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { Home } from "./pages/Home";
import { Feed } from "./pages/Feed";
import { ChatBubble } from "./components/chat/ChatBubble";
import { Favourites } from "./pages/Favourites";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { ResetPassword } from "./pages/ResetPassword";

export const App = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feed" element={<Feed />} />
      <Route
        path="/favourites"
        element={
          <ProtectedRoute>
            <Favourites />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
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
