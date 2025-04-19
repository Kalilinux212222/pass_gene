import React, { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import './App.css'; // Import the CSS file for styling

const App = () => {
    const [originPassword, setOriginPassword] = useState('');
    const [encryptedPassword, setEncryptedPassword] = useState('');
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [generatedEncryptedPassword, setGeneratedEncryptedPassword] = useState('');
    const [verificationMessage, setVerificationMessage] = useState('');
    const [passwordLength, setPasswordLength] = useState(0); // Default password length
    const [includeLetters, setIncludeLetters] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSpecialChars, setIncludeSpecialChars] = useState(true);
    const [lastGeneratedPassword, setLastGeneratedPassword] = useState('');
    const [allPasswords, setAllPasswords] = useState([]); // New state for all passwords

    useEffect(() => {
        // Load stored passwords from local storage on component mount
        const storedPassword = localStorage.getItem('generatedPassword');
        const storedEncryptedPassword = localStorage.getItem('generatedEncryptedPassword');
        const storedAllPasswords = JSON.parse(localStorage.getItem('allPasswords')) || []; // Load all passwords
        if (storedPassword) setGeneratedPassword(storedPassword);
        if (storedEncryptedPassword) setGeneratedEncryptedPassword(storedEncryptedPassword);
        setAllPasswords(storedAllPasswords); // Set all passwords
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

        // Check for duplicate password
        if (password === lastGeneratedPassword) {
            setVerificationMessage('Generated password is a duplicate of the last one!');
            return;
        }

        setLastGeneratedPassword(password);
        setGeneratedPassword(password);
        const encrypted = generateEncryptedPassword(password);
        setGeneratedEncryptedPassword(encrypted);
        
        // Update all passwords
        const updatedAllPasswords = [...allPasswords, password];
        setAllPasswords(updatedAllPasswords);
        localStorage.setItem('allPasswords', JSON.stringify(updatedAllPasswords)); // Store all passwords

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

    const verifyOriginalPassword = () => {
        let message = '';
        if (allPasswords.includes(originPassword)) {
            message += 'Original password is correct!<br />';
        } else {
            message += 'Original password is incorrect.<br />';
        }
        setVerificationMessage(message);
    };

    const verifyEncryptedPassword = () => {
        const decryptedPassword = decryptPassword(generatedEncryptedPassword);
        let message = '';

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

    const downloadPasswords = () => {
        const passwords = `Generated Password: ${ generatedPassword}\nGenerated Encrypted Password: ${generatedEncryptedPassword}\nRecent Generated Password: ${lastGeneratedPassword}\nAll Passwords: ${allPasswords.join(', ')}`;
        const blob = new Blob([passwords], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'GeneratedPw.txt'; // Name of the file to be downloaded
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL object
    };

    const resetAll = () => {
        setOriginPassword('');
        setEncryptedPassword('');
        setGeneratedPassword('');
        setGeneratedEncryptedPassword('');
        setVerificationMessage('');
        setPasswordLength(0);
        setIncludeLetters(true);
        setIncludeNumbers(true);
        setIncludeSpecialChars(true);
        setLastGeneratedPassword(''); // Reset last generated password
        setAllPasswords([]); // Reset all passwords
        localStorage.removeItem('generatedPassword');
        localStorage.removeItem('generatedEncryptedPassword');
        localStorage.removeItem('allPasswords'); // Clear all passwords from storage
    };

    return (
        
        <div className="max-w-7xl mx-auto justify-center">
          
          <header className="mb-12">
            <h1 className="text-white my-1 text-3xl font-serif">Password Generator</h1>
          </header>

          <main className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-20">
            {/* Left Top Section */}
            <section>
              <form className="space-y-6 max-w-full md:max-w-md" onSubmit={e => e.preventDefault()}>
                <div>
                  <label htmlFor="passwordLength" className="block mb-2 text-white text-sm">
                    How many letters are you looking for to do?
                  </label>
                  <input
                    id="passwordLength"
                    type="text"
                    min='1'
                    value={passwordLength}
                    onChange={(e) => setPasswordLength(Number(e.target.value))}
                    className="w-full rounded-lg border-2 border-purple-700 px-4 py-2 bg-black text-white focus:outline-none focus:ring-2 focus:ring-purple-700"
                  />
                </div>

                <div className="space-y-2 text-xs font-semibold">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={includeLetters}
                      onChange={(e) => setIncludeLetters(e.target.checked)}
                      className="w-4 h-4 text-purple-700"
                    />
                    <span className='text-white'>Characters</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      className="w-4 h-4 text-purple-700"
                    />
                    <span className='text-white'>Numbers</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={includeSpecialChars}
                      onChange={(e) => setIncludeSpecialChars(e.target.checked)}
                      className="w-4 h-4 text-purple-500"
                    />
                    <span className='text-white'>Special Characters</span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={generatePassword}
                  className="w-full text-xs font-semibold text-white border-2 border-purple-700 rounded-lg py-2 bg-gradient-to-r from-purple-700 via-purple-700 to-orange-500 hover:from-purple-800 hover:to-orange-700 transition-colors"
                >
                  GENERATE PASSWORD
                </button>
              </form>
            </section>

            {/* Right Top Section */}
            <section>
              <div
                className="border-4 border-purple-900 rounded-md p-6 min-h-[140px] max-w-full md:max-w-md text-white text-sm space-y-6"
              >
                <p>
                  <span className="font-normal">Generated Password : {generatedPassword}</span>
                </p>
                <p>
                  <span className="font-normal">Encrypted Password : {generatedEncryptedPassword}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={downloadPasswords}
                className="mt-6 w-full max-w-full md:max-w-md text-xs font-semibold text-white border-2 border-blue-900 rounded-lg py-2 bg-gradient-to-r from-blue-900 via-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 transition-colors"
              >
                DOWNLOAD PASSWORDS
              </button>
            </section>

            {/* Left Bottom Section */}
            <section>
              <h2 className="text-white text-lg font-mono tracking-widest mb-6">
                Verification Password 
              </h2>
              <form className="space-y-6 max-w-full md:max-w-md" onSubmit={e => e.preventDefault()}>
                <div>
                  <input
                    type="password"
                    placeholder="Enter your generated password"
                    className="w-full rounded-lg border-2 border-purple-700 px-4 py-2 bg-black text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-700"
                    value={originPassword}
                    onChange={(e) => setOriginPassword(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={verifyOriginalPassword}
                  className="w-full text-xs font-semibold text-white border-2 border-purple-700 rounded-lg py-2 bg-gradient-to-r from-purple-700 via-purple-700 to-orange-600 hover:from-purple-800 hover:to-orange-700 transition-colors"
                >
                  VERIFY ORIGINAL
                </button>

                <div>
                  <input
                    type="password"
                    placeholder="Enter your encrypted code"
                    className="w-full rounded-lg border-2 border-purple-700 px-4 py-2 bg-black text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-700"
                    value={encryptedPassword}
                    onChange={(e) => setEncryptedPassword(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={verifyEncryptedPassword}
                  className="w-full text-xs font-semibold text-white border-2 border-purple-700 rounded-lg py-2 bg-gradient-to-r from-purple-700 via-purple-700 to-orange-600 hover:from-purple-800 hover:to-orange-700 transition-colors"
                >
                  VERIFY ENCRYPTED
                </button>
              </form>
            </section>

            {/* Right Bottom Section */}
            <section>
              <div
                className="border-4 border-purple-900 rounded-md p-6 max-w-full md:max-w-md text-white text-sm font-mono tracking-wide space-y-4"
              >
                <p dangerouslySetInnerHTML={{ __html: verificationMessage }}></p>
              </div>
              
              <button
                type="button"
                onClick={resetAll}
                className="mt-6 w-full max-w-full md:max-w-md text-xs font-semibold text-white border-2 border-red-700 rounded-lg py-2 bg-gradient-to-r from-red-700 via-red-700 to-red-500 hover:from-red-800 hover:to-red-600 transition-colors"
              >
                RESET
              </button>
            </section>
          </main>
          <style>{`
            @media (max-width: 460px) {
              main {
                grid-template-columns: 1fr !important;
                gap: 1.5rem !important;
              }
              input[type="text"],
              input[type="password"],
              input[type="number"] {
                font-size: 12px !important;
                padding: 0.4rem 0.75rem !important;
              }
              button {
                font-size: 11px !important;
                padding: 0.4rem 0.75rem !important;
              }
              h1 {
                font-size: 1.5rem !important;
              }
              h2 {
                font-size: 1.125rem !important;
              }
              .border-4 {
                padding: 0.75rem !important;
              }
            }
          `}</style>
          <Analytics/>
          <SpeedInsights/>
        </div>
    );
};

export default App;