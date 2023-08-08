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
import { userState } from "./recoil/token";
import { useRecoilValue } from "recoil";

function NavBarWrapper() {
  const location = useLocation();
  const hideNavBar =
    location.pathname.startsWith("/debateRoom") ||
    location.pathname.startsWith("/login");
  return <>{!hideNavBar && <NavBar />}</>;
}

function App() {
  const user = useRecoilValue(userState);
  const isLoggedIn = user.token !== undefined;
  console.log(user, isLoggedIn);

  return (
    <BrowserRouter>
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
            element={isLoggedIn ? <MyProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/ranking"
            element={isLoggedIn ? <RankingPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/item"
            element={isLoggedIn ? <ItemPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
