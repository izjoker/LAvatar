import Box from '@mui/material/Box';
function Aboutpage(props) {
    return (
        <div id="about">
            <Box
                sx={{
                    padding: 5,
                    backgroundColor: 'AntiqueWhite',
                    margin: 5,
                    border: 1,
                }}
            >
                <h1> LAvatar </h1>
                <p>
                    LAvatar(라바타)는 LostArk유저들이 보다 편리하게 아이템을
                    거래 할 수 있도록 지원하기 위해 제작되었습니다.
                </p>
                <h2>아바타 가격 정보</h2>
                <p>
                    LostArk에서 출시된 모든 패키지 아이템을 한 눈에 확인할 수
                    있도록 망라하였으며, 가격 정보를 확인할 수 있습니다. 가격
                    정보는 1시간 주기로 업데이트 됩니다.
                </p>
            </Box>
        </div>
    );
}
export default Aboutpage;
