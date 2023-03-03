import {RecoilRoot} from 'recoil';
import { Link, Navigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Avatarpage from './components/avatarpage/avatarpage'
import GoogleAd from './components/GoogleAd/GoogleAd'

function App() {
    return (
        <div className="BodyWrapper">
            <RecoilRoot>
                <BrowserRouter>
                    <div className="NavBar">
                        <Link className={"HomeLogo"} to={'/'}>
                            LAvatar
                        </Link>
                    </div>
                    <div className="MainContents">
                        <Routes>        
                            <Route path="/" element={<Avatarpage/>}></Route>
                            <Route path="/packageDict/" element={<Avatarpage/>}> </Route>
                            <Route path="*" element={'Not Found'}></Route>
                        </Routes>
                    </div>
                    
                </BrowserRouter>
                {/* <GoogleAd data-ad-slot='3631939853'/> */}
                <div className="footer">
                    <a href='https://open.kakao.com/o/glkOZj6e' className='Contact'>Contact Me</a>
                </div>
            </RecoilRoot>
        </div>
    )
}

export default App;

