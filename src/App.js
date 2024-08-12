import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SignUp from "./containers/signUp/SignUp";
import SignIn from "./containers/signIn/SignIn";
import Bonuses from "./containers/bonuses/Bonuses";
import { useEffect } from "react";
import NonActive from "./containers/nonActive/NonActive";
import NonActivesList from "./containers/nonActivesList/nonActivesList";
import NeactivkaBySquares
  from "./containers/neactivkaBySquares/NeactivkaBySquares";
import ActivesList from "./containers/activesList/activesList";
import './App.css';
import { useAppSelector } from "./app/hooks";

const App = () => {
  const location = useLocation();
  const userToken = useAppSelector((state) => state.userState.user);
  
  useEffect(() => {
    document.body.style.backgroundColor =
      location.pathname === '/sign-in' || location.pathname === '/sign-up' ? '#29384A' : '#E8E8E8';

    if (document.querySelector('.toolbar')) {
      document.documentElement.style.width = '1440px';
    }
  }, [location.pathname]);
  
  return (
    <div className="App">
      <Routes>
        <Route path='*' element={userToken ? <Navigate to="/bonuses" replace/> : <Navigate to="/sign-in" replace/>}/>
        <Route path='sign-up' element={<SignUp/>}/>
        <Route path='sign-in' element={<SignIn/>}/>
        <Route path='bonuses' element={<Bonuses/>}/>
        <Route path='bonuses-by-all-squares' element={<NeactivkaBySquares/>}/>
        <Route path='bonuses/non-active' element={<NonActive/>}/>
        <Route path='bonuses/non-actives-list' element={<NonActivesList/>}/>
        <Route path='bonuses/actives-list' element={<ActivesList/>}/>
      </Routes>
    </div>
  );
}

export default App;
