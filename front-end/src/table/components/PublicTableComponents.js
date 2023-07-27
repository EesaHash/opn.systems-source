export const numberingPattern = /^\d+\.\s+/;
export const dashPattern = /^[-•]\s+/;
export const letterPattern = /^[a-z]\.\s*/;
export const stepPattern = /Step\s\d+:\s/;
export const updateListItem = (temp, index, newValue) => {
    const result = [...temp];
    const newValueList = newValue.split('\n');
    let idxCounter = 0;
    newValueList.forEach((data) => {
        if(idxCounter === 0){
            result[index].data = data;
        }else{
            const idx = index + idxCounter;
            const newData = {
                pattern: result[idx - 1].pattern,
                hyphen: result[idx - 1].hyphen,
                data,
                item: []
            };
            result.splice(idx, 0, newData);
        }
        ++idxCounter;
    });
    return result;
};
export const updateListSubItem = (temp, itemIdx, subItemIdx, newValue) => {
    const result = [...temp];
    const newValueList = newValue.split('\n');
    let idxCounter = 0;
    newValueList.forEach((data) => {
        if(idxCounter === 0){
            result[itemIdx].item[subItemIdx].data = data;
        }else{
            const idx = subItemIdx + idxCounter;
            const newData = {
                pattern: result[itemIdx].item[subItemIdx].pattern,
                hyphen: result,
                data,
            };
            result[itemIdx].item.splice(idx, 0, newData);
        }
        ++idxCounter;
    });
    return result;
};