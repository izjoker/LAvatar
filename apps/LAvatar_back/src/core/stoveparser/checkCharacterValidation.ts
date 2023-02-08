import characterParser from './characterParser'
import axios from 'axios'
import cheerio from 'cheerio'
import characterLstParser from './characterParser'


const isInclude = (characterLst, characterName) => {
    const r = false
    for (let i=0; i < characterLst.length; i++){
        if (characterLst[i].name.normalize() === characterName.normalize()){
            return true
        }
    }
    return false
}


const checkCharacterValidation = async (encryptedMemberNo: string, characterName: string) => {
    let r = []
    const url = `https://lostark.game.onstove.com/profile/Member?id=${encodeURIComponent(encryptedMemberNo)}`
    axios({
        url: url,
        method: "GET"
    })
    .then((res) => {
        const characterLst = characterParser(res.data)
        if (characterLst === null){
            throw new Error('Failed to load Character List')
        }
        console.log('Validate Character Name')
        console.log('Target List:', characterLst)
        console.log('Character Name:', characterName)
        const r = isInclude(characterLst, characterName)
        if (r){
            console.log(`This account includes [${characterName}]`)
            return r
        }else{
            console.log(`Vaildation failed`)
            return r
        }
    })
    .catch((error) => {
        return console.log("Character Vaildation Failed")
    })
}
export default checkCharacterValidation