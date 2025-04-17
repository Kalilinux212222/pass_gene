import React, { useState } from 'react';
import './App.css'; // Import the CSS file for styling

const App = () => {
    const [originPassword, setOriginPassword] = useState('');
    const [encryptedPassword, setEncryptedPassword] = useState('');
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [generatedEncryptedPassword, setGeneratedEncryptedPassword] = useState('');
    const [verificationMessage, setVerificationMessage] = useState('');
    const [passwordLength, setPasswordLength] = useState(12); // Default password length
    const [includeLetters, setIncludeLetters] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSpecialChars, setIncludeSpecialChars] = useState(true);

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyz";
        const nums = '1234567890';
        const specs = '!@#$%^&*()_+[]{}|;:,.<>?';
        let options = '';

        if (includeLetters) options += chars;
        if (includeNumbers) options += nums;
        if (includeSpecialChars) options += specs;

        if (options.length === 0) {
            setVerificationMessage('Please select at least one character type.');
            return;
        }

        let password = '';
        for (let i = 0; i < passwordLength; i++) {
            const randomChar = options[Math.floor(Math.random() * options.length)];
            password += randomChar;
        }

        setGeneratedPassword(password);
        setGeneratedEncryptedPassword(generateEncryptedPassword(password));
        setVerificationMessage(''); // Clear previous messages
    };

    const generateEncryptedPassword = (password) => {
        // For simplicity, we will just reverse the password as a mock "encryption"
        return password.split('').reverse().join('');
    };

    const decryptPassword = (encryptedPassword) => {
        // Reverse the encrypted password to get the original password
        return encryptedPassword.split('').reverse().join('');
    };

    const verifyPasswords = () => {
        const decryptedPassword = decryptPassword(generatedEncryptedPassword);
        let message = '';

        if (originPassword === generatedPassword) {
            message += 'Original password is correct!<br />';
        } else {
            message += 'Original password is incorrect.<br />';
        }

        if (encryptedPassword === generatedEncryptedPassword) {
            message += 'Encrypted password is correct!<br />';
        } else {
            message += 'Encrypted password is incorrect.<br />';
        }

        // Check if the decrypted password matches the original password
        if (decryptedPassword === originPassword) {
            message += 'Decrypted password matches the original password!<br />';
        } else {
            message += 'Decrypted password does not match the original password.<br />';
        }

        setVerificationMessage(message);
    };

    return (
        <div className="container">
            <h1>Password Generator</h1>
            <div className="output">Generated Password: {generatedPassword}</div>
            <div className="output">Generated Encrypted Password: {generatedEncryptedPassword}</div>

            <div className="input-group">
                <label>Password Length:</label>
                <input
                className='n'
                    type="number"
                    min="1"
                    value={passwordLength}
                    onChange={(e) => setPasswordLength(Number(e.target.value))}
                />
            </div>

            <div className="input-group">
                <label>
                    <input
                        type="checkbox"
                        checked={includeLetters}
                        onChange={(e) => setIncludeLetters(e.target.checked)}
                    />
                    Include Letters
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={includeNumbers}
                        onChange={(e) => setIncludeNumbers(e.target.checked)}
                    />
                    Include Numbers
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={includeSpecialChars}
                        onChange={(e) => setIncludeSpecialChars(e.target.checked)}
                    />
                    Include Special Characters
                </label>
            </div>

            <button className="btn" onClick={generatePassword}>Generate Password</button>

            <div className="input-group">
                <label>Original Password:</label>
                <input
                    type="text"
                    placeholder="Enter your original Password..."
                    className="input"
                    value={originPassword}
                    onChange={(e) => setOriginPassword(e.target.value)}
                />
                <button className="btn" onClick={verifyPasswords}>Verify Original</button>
            </div>

            <div className="input-group">
                <label>Encrypted Password:</label>
                <input
                    type="text"
                    placeholder="Enter your encrypted Password..."
                    className="input"
                    value={encryptedPassword}
                    onChange={(e) => setEncryptedPassword(e.target.value)}
                />
                <button className="btn" onClick={verifyPasswords}>Verify Encrypted</button>
            </div>

            {/* Display verification messages */}
            <div className="verification-results">
                <p dangerouslySetInnerHTML={{ __html: verificationMessage }}></p>
            </div>
        </div>
    );
};

export default App;