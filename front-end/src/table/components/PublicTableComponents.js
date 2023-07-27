export const numberingPattern = /^\d+\.\s+/;
export const dashPattern = /^[-•]\s+/;
export const letterPattern = /^[a-z]\.\s*/;
export const stepPattern = /Step\s\d+:\s/;
export const updateListItem = (temp, index, newValue) => {
    const temp2 = [...temp];
    const newValueList = newValue.split('\n');
    let idxCounter = 0;
    newValueList.forEach((data) => {
        if(idxCounter === 0){
            temp2[index].data = data;
        }else{
            const idx = index + idxCounter;
            const newData = {
                hyphen: temp2[idx - 1].hyphen,
                data: data,
                item: []
            };
            temp2.splice(idx, 0, newData);
        }
        ++idxCounter;
    });
    return temp2;
};