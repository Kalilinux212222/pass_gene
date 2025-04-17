import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file for styling

const App = () => {
    const [originPassword, setOriginPassword] = useState('');
    const [encryptedPassword, setEncryptedPassword] = useState('');
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [generatedEncryptedPassword, setGeneratedEncryptedPassword] = useState('');
    const [verificationMessage, setVerificationMessage] = useState('');
    const [passwordLength, setPasswordLength] = useState(10); // Default password length
    const [includeLetters, setIncludeLetters] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSpecialChars, setIncludeSpecialChars] = useState(true);

    useEffect(() => {
        // Load stored passwords from local storage on component mount
        const storedPassword = localStorage.getItem('generatedPassword');
        const storedEncryptedPassword = localStorage.getItem('generatedEncryptedPassword');
        if (storedPassword) setGeneratedPassword(storedPassword);
        if (storedEncryptedPassword) setGeneratedEncryptedPassword(storedEncryptedPassword);
    }, []);

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
        const encrypted = generateEncryptedPassword(password);
        setGeneratedEncryptedPassword(encrypted);
        localStorage.setItem('generatedPassword', password);
        localStorage.setItem('generatedEncryptedPassword', encrypted);
        setVerificationMessage(''); // Clear previous messages
    };

    const generateEncryptedPassword = (password) => {
        return password.split('').reverse().join('');
    };

    const decryptPassword = (encryptedPassword) => {
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

        if (decryptedPassword === originPassword) {
            message += 'Decrypted password matches the original password!<br />';
        } else {
            message += 'Decrypted password does not match the original password.<br />';
        }

        setVerificationMessage(message);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0 ];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                const passwords = content.split('\n').map(line => line.trim()).filter(line => line);
                passwords.forEach(password => {
                    const encrypted = generateEncryptedPassword(password);
                    localStorage.setItem(password, encrypted);
                });
                alert('Passwords uploaded and stored successfully!');
            };
            reader.readAsText(file);
        }
    };

    const downloadPasswords = () => {
        const passwords = `Generated Password: ${generatedPassword}\nGenerated Encrypted Password: ${generatedEncryptedPassword}`;
        const blob = new Blob([passwords], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'passwords.txt'; // Name of the file to be downloaded
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL object
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
            <button className="btn" onClick={downloadPasswords}>Download Passwords</button>

            <div className="input-group">
                <label>Original Password:</label>
                <input
                    type="password"
                    placeholder="Enter your original Password..."
                    className="input"
                    
                    onChange={(e) => setOriginPassword(e.target.value)}
                />
                <button className="btn" onClick={verifyPasswords}>Verify Original</button>
            </div>

            <div className="input-group">
                <label>Encrypted Password:</label>
                <input
                    type="password"
                    placeholder="Enter your encrypted Password..."
                    className="input"
                    
                    onChange={(e) => setEncryptedPassword(e.target.value)}
                />
                <button className="btn" onClick={verifyPasswords}>Verify Encrypted</button>
            </div>

            <div className="verification-results">
                <p dangerouslySetInnerHTML={{ __html: verificationMessage }}></p>
            </div>
        </div>
    );
};

export default App;