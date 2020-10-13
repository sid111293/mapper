const getKeys = object => {
    try {
        return Object.keys(object).filter(key => object[key]);
    } catch (error) {
        return [];
    }
};

const preparePayload = (Source, targetMap) => {
    const tagetKeys = getKeys(targetMap);
    return tagetKeys.reduce((Target, KeySet) => {
        const mergeArrayMap = (l1, l2) => {
            let mergedArray = [];
            const length = ((l1 - l2) > 0) ? l1.length : l2.length;
            try {
                for(let i = 0; i < length; i++){
                    for (const property in l1[i]) {
                        if(Array.isArray(l1[i][property]) && Array.isArray(l2[i][property])){
                            l2[i][property] = mergeArrayMap(l1[i][property], l2[i][property]);
                        }
                    }
                    mergedArray.push(Object.assign({}, l1[i]||{}, l2[i]||{}));
                }
            } catch (error) {
                return [];
            }
            return mergedArray;
        };
        const getNewMapForArray = rawMap => {
            const { key, value } = rawMap;
            const keyLength = key.length;
            const valueLength = value.length;
            const keyIndexStart = key.indexOf('[') + 1;
            const keyIndexEnd = keyLength - 1;
            const valueIndexStart = value.indexOf('[') + 1;
            const valueIndexEnd = valueLength - 1;
            return {
                [key.slice(keyIndexStart, keyIndexEnd)]: value.slice(valueIndexStart, valueIndexEnd)
            }
        }
        const checkAndTransformIfArray = (__data, mapObject) => {
            if(!Array.isArray(__data)) return __data;
            return __data.map(source => preparePayload(source, mapObject));
        }
        const checkAndGetValue = (keySet, source) => {
            let data;
            if(keySet){
                const keyList = !(keySet.split(".")[0].includes('[')) ? keySet.split(".") : [keySet.split("[")[0]];
                const keyName = keyList[0];
                data = source[keyName];
                keyList.splice(0,1);
                const newKeyList = keyList.join(".");
                if(!newKeyList) return data;
                return checkAndGetValue(newKeyList, data);
            }
        }
        const checkAndCreateKey = (target, keySet) => {
            if(keySet){
                const keyList = !(keySet.split(".")[0].includes('[')) ? keySet.split(".") : [keySet.split("[")[0]];
                const keyName = keyList[0];
                target[keyName] = !target[keyName] ? {} : target[keyName];
                keyList.splice(0,1);
                const newKeyList = keyList.join(".");
                if(!newKeyList){
                    const value = checkAndTransformIfArray(checkAndGetValue(targetMap[KeySet], Source), getNewMapForArray({
                        key: KeySet,
                        value: targetMap[KeySet]
                    }));
                    target[keyName] = (Array.isArray(value) && Array.isArray(target[keyName])) ? mergeArrayMap(target[keyName], value) : value;
                    return;
                }
                return checkAndCreateKey(target[keyName], newKeyList);
            }
        }
        try {
            checkAndCreateKey(Target, KeySet);
        } catch (error) {
            console.log(`ERROR:WHILE:PARSING:KEY ${KeySet}`);
        }
        return Target;
    }, {});
}

module.exports = preparePayload;