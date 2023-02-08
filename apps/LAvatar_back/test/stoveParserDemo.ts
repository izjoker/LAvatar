import getStoveIntroduceFromURL, {getEncryptedMemberNo, memberNoParser} from "../src/core/stoveparser/stoveParser";
import checkCharacterValidation from "../src/core/stoveparser/checkCharacterValidation";

async function retrieve(){
    let url = "https://timeline.onstove.com/160768383"
    // let url = "https://timeline.onstove.com/71204756"
    let charName = "izjokerA"
    let stoveIntro = await getStoveIntroduceFromURL(url)
    let memberNo = memberNoParser(url)  
    let encryptedMemberNo = await getEncryptedMemberNo(memberNo)
    let isValid = await checkCharacterValidation(encryptedMemberNo, charName)

};

retrieve();
