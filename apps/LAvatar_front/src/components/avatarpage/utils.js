import classLst from '../../assets/classLst.json'
export const checkRootClass = (className) => {
    console.log(classLst)
    if (classLst['rootClasses'].includes(className)){
        return true
    }else{
        return false
    }
}
