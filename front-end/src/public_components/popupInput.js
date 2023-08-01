export const emailInputItem = (label, input, setInput, handleKeypress) => {
    return inputItem(label, input, setInput, handleKeypress, "email");
};
export const textInputItem = (label, input, setInput, handleKeypress) => {
    return inputItem(label, input, setInput, handleKeypress, "text");
};
export const readOnlyInput = (label, input, type) => {
    return(
        <div className="pop-up-input">
            <label>{label}</label>
            <input 
                style={{color: "#8496AE"}}
                type={type}
                value={input}
                readOnly
            />
        </div>  
    );
};
const inputItem = (label, input, setInput, handleKeypress, type) => {
    return(
        <div className="pop-up-input">
            <label>{label}</label>
            <input 
                type={type}
                value={input}
                onKeyPress={handleKeypress} 
                onChange={event => setInput(event.target.value)}
            />
        </div>  
    );
};
export const areaItem = (label, input, setInput, handleKeypress) => {
    return(
        <div className="pop-up-input">
            <label>{label}</label>
            <textarea 
                type="text" 
                value={input}
                onKeyPress={handleKeypress} 
                onChange={event => setInput(event.target.value)}
            />
        </div>  
    );
};