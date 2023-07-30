export const numberingPattern = /^\d+\.\s+/;
export const dashPattern = /^[-•]\s+/;
export const letterPattern = /^[a-z]\.\s*/;
export const stepPattern = /Step\s\d+:\s/;
export const addListItem = (list) => {
    let result;
    if(list.length <= 0){
        result = [];
        result.push({
            pattern: "number",
            hyphen: "1",
            data: "",
            item: [{pattern: "dash", hyphen: "-", data: ""}]
        });
    }else{
        result = [...list];
        result.push({
            pattern: list[list.length - 1].pattern,
            hyphen: list[list.length - 1].hyphen,
            data: "",
            item: [{pattern: "dash", hyphen: "-", data: ""}]
        });
    }
    return result;
};
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
                item: [{
                    pattern: result[index].item.length > 0 ? result[index].item[0].pattern : "dash", 
                    hyphen: result[index].item.length > 0 ? result[index].item[0].hyphen : "-", 
                    data: ""
                }]
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
                hyphen: result[itemIdx].item[subItemIdx].hyphen,
                data,
            };
            result[itemIdx].item.splice(idx, 0, newData);
        }
        ++idxCounter;
    });
    return result;
};
export const incrementLetter = (currentLetter) => {
    if(currentLetter === 'z'){
        return 'aa';
    }else{
        const nextCharCode = currentLetter.charCodeAt(0) + 1;
        return String.fromCharCode(nextCharCode);
    }
};
export const setTextAreaHeight = (id) => {
    const textareas = document.querySelectorAll(id);
    if(textareas.length <= 0)
        return;
    textareas.forEach(textarea => {
        textarea.addEventListener("keyup", e => {
            textarea.style.height = "100%";
            let scrollHeight = e.target.scrollHeight;
            textarea.style.height = `${scrollHeight}px`;
        });
        textarea.style.height = `${textarea.scrollHeight}px`;
        console.log(textarea.scrollHeight);
    });
};