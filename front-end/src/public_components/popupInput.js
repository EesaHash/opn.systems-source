// Creates an email input field with a label.
// @param {string} label - The label for the input field.
// @param {string} input - The current value of the input field.
// @param {function} setInput - A function to update the input state.
// @param {function} handleKeypress - A function to handle keypress events.
export const emailInputItem = (label, input, setInput, handleKeypress) => {
    return inputItem(label, input, setInput, handleKeypress, "email");
};

// Creates a text input field with a label.
// @param {string} label - The label for the input field.
// @param {string} input - The current value of the input field.
// @param {function} setInput - A function to update the input state.
// @param {function} handleKeypress - A function to handle keypress events.
export const textInputItem = (label, input, setInput, handleKeypress) => {
    return inputItem(label, input, setInput, handleKeypress, "text");
};

// Creates a password input field with a label.
// @param {string} label - The label for the input field.
// @param {string} input - The current value of the input field.
// @param {function} setInput - A function to update the input state.
// @param {function} handleKeypress - A function to handle keypress events.
export const passwordInputItem = (label, input, setInput, handleKeypress) => {
    return inputItem(label, input, setInput, handleKeypress, "password");
};

// Creates a read-only input field with a label.
// @param {string} label - The label for the input field.
// @param {string} input - The current value of the input field.
// @param {string} type - The type of input field (e.g., "text", "password", etc.).
export const readOnlyInput = (label, input, type) => {
    return (
        <div className="pop-up-input">
            <label>{label}</label>
            <input
                style={{ color: "#8496AE" }}
                type={type}
                value={input}
                readOnly
            />
        </div>
    );
};

// Creates a general input field with a label.
// @param {string} label - The label for the input field.
// @param {string} input - The current value of the input field.
// @param {function} setInput - A function to update the input state.
// @param {function} handleKeypress - A function to handle keypress events.
// @param {string} type - The type of input field (e.g., "text", "password", etc.).
const inputItem = (label, input, setInput, handleKeypress, type) => {
    return (
        <div className="pop-up-input">
            <label>{label}</label>
            <input
                type={type}
                value={input}
                onKeyPress={handleKeypress}
                onChange={(event) => setInput(event.target.value)}
            />
        </div>
    );
};

// Creates an input field of type textarea with a label.
// @param {string} label - The label for the input field.
// @param {string} input - The current value of the input field.
// @param {function} setInput - A function to update the input state.
// @param {function} handleKeypress - A function to handle keypress events.
export const areaItem = (label, input, setInput, handleKeypress) => {
    return (
        <div className="pop-up-input">
            <label>{label}</label>
            <textarea
                type="text"
                value={input}
                onKeyPress={handleKeypress}
                onChange={(event) => setInput(event.target.value)}
            />
        </div>
    );
};
