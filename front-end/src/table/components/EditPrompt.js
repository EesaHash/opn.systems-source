import React from 'react';
import "../style/table.css";

/**
 * Component for Edit Prompt.
 * @param {Object} props - Component props
 * @param {number} props.index - Index of the prompt
 * @param {function} props.automaticallyRegenerate - Function to automatically regenerate
 * @param {function} props.regenerateByPrompt - Function to regenerate by prompt
 * @returns {JSX.Element} - JSX element for Edit Prompt
 */
export const EditPrompt = (props) => {
    const regenerate = () => {
        props.automaticallyRegenerate(null);
    };

    const sendPrompt = () => {
        const prompt = document.getElementById(`prompt${props.index}`).value;
        if (!prompt) {
            return alert("Prompt cannot be empty!");
        }
        props.regenerateByPrompt(prompt, null);
        document.getElementById(`prompt${props.index}`).value = "";
    };

    const handleKeypress = (e) => {
        if (e.key === "Enter") {
            sendPrompt();
        }
    };

    return (
        <div className='edit'>
            {/* AI Suggestion */}
            <div className='edit-suggestion'>
                <button onClick={regenerate}>Regenerate</button>
                <h3><img src="./images/loadingIcon.png" alt="icon" />AI powered</h3>
            </div>
            {/* Prompt Input */}
            <div className='edit-prompt'>
                <img src="./images/loadingIcon.png" alt="icon" />
                <input
                    type='text'
                    id={`prompt${props.index}`}
                    placeholder='Ask AI to write anything'
                    onKeyPress={handleKeypress}
                />
                <button onClick={sendPrompt}>Send</button>
            </div>
        </div>
    );
};
