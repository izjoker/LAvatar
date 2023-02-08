import './App.css';
import Avatarpage from './components/avatarpage/avatarpage'
import {
    RecoilRoot
} from 'recoil';

function App() {
    return (
        <RecoilRoot>
            <div className="NavBar">
                LAvatar
            </div>
            <div className="App">
                <Avatarpage/>
            </div>
        </RecoilRoot>
    )
}

export default App;
