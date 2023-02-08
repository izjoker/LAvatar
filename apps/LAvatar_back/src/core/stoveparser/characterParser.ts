import cheerio from 'cheerio'
import fs from 'fs'
import { replace } from 'lodash';

const characterNameParser = (elem) => {
    let v = cheerio.load(elem)('button').attr('onclick');
    return v.replace('location.href=\'/Profile/Character/', '').slice(0, -1).trim();
}

const characterLvParser = (elem) => {
    const $ = cheerio.load(elem)
    const re = RegExp('(?<=\>Lv\.)(.*?)(?=\<span)')
    const r = re.exec($.html())[0]
    
    return parseInt(r)
}

const characterClassParser = (elem) => {
    const $ = cheerio.load(elem)
    return $('img').attr('alt').trim()
}

const createCharacterLst_accout = (html) => {
    let r = []
    let $ = cheerio.load(html);
    let p = $('div[id=expand-character-list]');

    let serverElems = p.find('strong[class=profile-character-list__server]')
    let characterLstElems = p.find('ul[class=profile-character-list__char]')

    if (serverElems.length !== characterLstElems.length){
        throw new Error("An Error Occured!")
    }
    for (let i=0; i < serverElems.length; i++){
        let serverName = $(serverElems[i]).text().slice(1)
         
        let characterLst = createCharacterLst_server(characterLstElems[i], serverName);
        
        r = r.concat(characterLst)
    }
    return r
    
    
}
const createCharacterLst_server = (elem: any, serverName: string) => {
    let $ = cheerio.load(elem);
    let r = [];
    $(elem).find('li').each(function (idx, elem) {
        const character = {
            name: "",
            level: 0,
            class: "",
            serverName: serverName
        }
        character.name = characterNameParser(elem)
        character.level = characterLvParser(elem)
        character.class = characterClassParser(elem)
        if (character.name === "" || character.level === 0 || character.class === "" ){
            return null
        }
        r.push(character);
    })
    return r;
}
export default createCharacterLst_accout;