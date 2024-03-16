import {Navigate, Route, Routes} from "react-router-dom";
import {useAppSelector} from "./app/hooks";
import SignUp from "./containers/signUp/SignUp";
import SignIn from "./containers/signIn/SignIn";
import Bonuses from "./containers/bonuses/Bonuses";
import './App.css';

const App = () => {
  const userToken = useAppSelector((state) => state.userState.user);

  return (
    <div className="App">
      <Routes>
        <Route path='*' element={userToken ?
          <Navigate to="/sign-in" replace/> : <Navigate to="/sign-in" replace/>}/>
        <Route path='sign-up' element={<SignUp/>}/>
        <Route path='sign-in' element={<SignIn/>}/>
        <Route path='bonuses' element={<Bonuses/>}/>
        {/*<Route path='show-data' element={<ShowData/>}/>*/}
      </Routes>
    </div>
  );
}

export default App;
