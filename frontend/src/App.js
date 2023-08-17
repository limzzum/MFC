import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import NavBar from "./components/navBar/navBar";
import LoginPage from "./pages/login/loginPage";
import PasswordChangePage from "./pages/passwordchange/passwordChangePage";
import DebatePage from "./pages/debateRoom/DebatePage";
import SignupPage from "./pages/signup/signupPage";
import MainPage from "./pages/main/mainPage";
import MyProfilePage from "./pages/myprofile/myProfile";
import RankingPage from "./pages/ranking/ranking";
import ItemPage from "./pages/item/itemPage";
import Test from "./pages/debateRoom/Test";
import { SocketProvider } from "./SocketContext";

function NavBarWrapper() {
  const location = useLocation();
  const hideNavBar =
    location.pathname.startsWith("/debateRoom") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup");
  return <>{!hideNavBar && <NavBar />}</>;
}

function App() {
  const isLoggedIn = localStorage.getItem("mfctoken") ? true : false;
  
  return (
    <BrowserRouter>
      <SocketProvider>
        <div className="App">
          <NavBarWrapper />
          <Routes>
            <Route
              path="/login"
              element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!isLoggedIn ? <SignupPage /> : <Navigate to="/" />}
            />
            <Route
              path="/pwchange"
              element={
                isLoggedIn ? <PasswordChangePage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/"
              element={isLoggedIn ? <MainPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/debateRoom"
              element={isLoggedIn ? <DebatePage /> : <Navigate to="/login" />}
            >
              <Route path=":roomId" element={<DebatePage />} />
            </Route>
            <Route
              path="/profile"
              element={
                isLoggedIn ? <MyProfilePage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/ranking"
              element={isLoggedIn ? <RankingPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/item"
              element={isLoggedIn ? <ItemPage /> : <Navigate to="/login" />}
            />
            <Route path="/test" element={<Test />} />
          </Routes>
        </div>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
