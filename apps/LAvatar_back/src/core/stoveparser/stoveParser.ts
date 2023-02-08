import axios from 'axios'
import { replace } from 'lodash'

export const memberNoParser = (url: string) => {
    let r = url.trim();
    r = r.replace("https://timeline.onstove.com/", "")
    r = r.replace("/", "")
    
    return r  
}

const memberNoVailationCheck = (member_no: string) => {
    if (isNaN(member_no as any)){
        return false
    }
    return true
}
const getStoveIntroduceFromURL = async (url: string) => {
    let apiURL = "https://api.onstove.com/tm/v1/preferences/{member_no}"
    
    const member_no = memberNoParser(url)
    if (!memberNoVailationCheck(member_no)){
        throw new Error("invalid member number!")
    }
    apiURL = apiURL.replace("{member_no}", member_no)
    axios(  
        {
            url: apiURL,
            method: "GET"
        }
    )
    .then((res) => {
        console.log(`Introduce of member ${member_no}: ${res.data["data"]["introduce"]}`)
        return res.data["data"]["introduce"]
    })
    .catch((error) => {
        return console.log("Failed to get Member Introduce!")
    })

    return
}

export const getEncryptedMemberNo = async (member_no): Promise<string> => {
    const url = "https://lostark.game.onstove.com/board/IsCharacterList"
    const res = await axios.post(
        url,
        {
            memberNo: member_no
        }
    )
    console.log(`Encrypted Member Number of Member ${member_no}: ${res.data["encryptMemberNo"]}`)
    return res.data["encryptMemberNo"] || "" as string
}

export default getStoveIntroduceFromURL
// const url = "https://timeline.onstove.com/160768383"
// getStoveIntroduceFromURL(url)
// const member_no = "160768383"
// getEncryptedMemberNo(member_no)