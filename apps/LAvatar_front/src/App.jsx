import './App.css';
import Avatarpage from './components/avatarpage/avatarpage'
import {
    RecoilRoot
} from 'recoil';
import { Router, Link, Navigate, BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <RecoilRoot>
            <BrowserRouter>
                <Link to={'/'}>
                    <div className="NavBar">
                        LAvatar
                    </div>
                </Link>
				<Routes>        
                    <Route path="/" element={<Navigate to={'/packageDict'}/>}></Route>
                    <Route path="/packageDict/" element={<Avatarpage/>}> </Route>
                    <Route path="*" element={'Not Found'}></Route>
                </Routes>
            </BrowserRouter>
            <div className="footer">
                Contact Me
            </div>
        </RecoilRoot>
    )
}

export default App;

