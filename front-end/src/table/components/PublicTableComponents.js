// Regular expressions for different patterns used in the application
export const numberingPattern = /^\d+\.\s+/;
export const dashPattern = /^[-•]\s+/;
export const letterPattern = /^[a-z]\.\s*/;
export const stepPattern = /Step\s\d+:\s/;

// Function to add a new item to the list
export const addListItem = (list, heading, itemHeading) => {
    let result;
    if (list.length <= 0) {
        // If the list is empty, create a new list with default data
        result = [];
        result.push({
            pattern: "number",
            hyphen: "1",
            data: "",
            item: [{ pattern: "dash", hyphen: "-", data: "" }]
        });
    } else {
        // If the list is not empty, add a new item based on the heading and itemHeading patterns
        result = [...list];
        result.push({
            pattern: heading.pattern,
            hyphen: heading.hyphen,
            data: "",
            item: [{ pattern: itemHeading.pattern, hyphen: itemHeading.pattern === "letter" ? 'a' : itemHeading.hyphen, data: "" }]
        });
    }
    return result;
};

// Function to update the value of an item in the list
export const updateListItem = (temp, index, newValue) => {
    const result = [...temp];
    const newValueList = newValue.split('\n');
    let idxCounter = 0;
    newValueList.forEach((data) => {
        if (idxCounter === 0) {
            // Update the data of the main item
            result[index].data = data;
        } else {
            // Insert new items for sub-items if the new value contains multiple lines
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

// Function to update the value of a sub-item in the list
export const updateListSubItem = (temp, itemIdx, subItemIdx, newValue) => {
    const result = [...temp];
    const newValueList = newValue.split('\n');
    let idxCounter = 0;
    newValueList.forEach((data) => {
        if (idxCounter === 0) {
            // Update the data of the sub-item
            result[itemIdx].item[subItemIdx].data = data;
        } else {
            // Insert new sub-items if the new value contains multiple lines
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

// Function to increment a letter (used for generating item hyphen)
export const incrementLetter = (currentLetter) => {
    if (currentLetter === 'z') {
        return 'aa';
    } else {
        const nextCharCode = currentLetter.charCodeAt(0) + 1;
        return String.fromCharCode(nextCharCode);
    }
};

// Function to set the height of a textarea to fit its content
export const setTextAreaHeight = (id) => {
    const textareas = document.querySelectorAll(id);
    if (textareas.length <= 0)
        return;
    textareas.forEach(textarea => {
        textarea.addEventListener("keyup", e => {
            textarea.style.height = "100%";
            let scrollHeight = e.target.scrollHeight;
            textarea.style.height = `${scrollHeight}px`;
        });
        textarea.style.height = `${textarea.scrollHeight}px`;
    });
};
