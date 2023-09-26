import { RecoilRoot } from 'recoil';
import { Link, Navigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Avatarpage from './pages/avatarpage/avatarpage';
import Aboutpage from './pages/aboutpage/aboutpage';
import PriceHistory from './pages/priceHistory/priceHistory';
function App() {
    return (
        <div className="BodyWrapper">
            <RecoilRoot>
                <BrowserRouter>
                    <div className="NavBar">
                        <Link className={'HomeLogo'} to={'/'}>
                            LAvatar
                        </Link>
                    </div>
                    <div className="MainContents">
                        <Routes>
                            <Route path="/about" element={<Aboutpage />} />
                            <Route path="/" element={<Avatarpage />} />
                            <Route
                                path="/packageDict/"
                                element={<Avatarpage />}
                            />
                            <Route
                                path="/priceHistory"
                                element={<PriceHistory />}
                            />
                            <Route path="*" element={'Not Found'} />
                        </Routes>
                    </div>
                </BrowserRouter>
                <div className="footer">
                    <a href="about"> About </a>
                    <a
                        href="https://open.kakao.com/o/glkOZj6e"
                        className="Contact"
                    >
                        Contact Me
                    </a>
                </div>
            </RecoilRoot>
        </div>
    );
}

export default App;
