# 🚀 Message Deleter - Termux & Desktop

A highly advanced, multi-lingual, and completely safe Node.js script for bulk deleting Discord messages. Designed to work flawlessly on both **Termux (Android)** and **Desktop (Windows/Linux/macOS)**.

## ✨ Key Features

*   **🌍 15+ Languages Supported:** Fully localized in English, Turkish, Russian, German, Arabic, French, Spanish, Japanese, Korean, and more.
*   **📊 Live Webhook Progress (Spam-Free):** Uses Discord's `PATCH` API. Instead of spamming your server with a new message for every deleted item, it updates a single message in real-time with a live progress bar.
*   **🛡️ Termux Wake-Lock:** Automatically keeps your Android device awake. The script will run seamlessly in the background even if you turn off your screen.
*   **🚥 Visual Progress Bar:** Beautiful terminal UI with color-coded progress bars (Red -> Yellow -> Green).
*   **📝 Crash Recovery & Logging:** If an unexpected API error occurs, the script saves the exact error and timestamp to a `crash_log.txt` file and sends an emergency webhook alert before shutting down.
*   **⏳ Anti-Spam & Rate Limit Bypass:** Includes randomized human-like delays (250ms - 700ms) and automatically respects Discord's HTTP 429 (Too Many Requests) limits.

---

## 🛠️ Installation & Usage

### 📱 Method 1: For Termux (Android)

1. Open Termux and install the required packages:
    pkg update && pkg upgrade -y
    pkg install nodejs nano -y

2. Download or create the script file:
    nano message-deleter.js

(Paste the code from this repository, then press CTRL + O, Enter, and CTRL + X to save and exit).

3. Run the script:
    node message-deleter.js

### 💻 Method 2: For Desktop (Windows / Linux / macOS)

1. Download and install Node.js from nodejs.org
2. Download the `message-deleter.js` file from this repository to your computer.
3. Open a terminal (Command Prompt, PowerShell, or bash) in the folder where the file is located.
4. Run the script:
    node message-deleter.js

(Note: The termux-wake-lock warning on Desktop is perfectly normal and can be safely ignored).

---

## ⚙️ How it Works

1. **Select Language:** Choose your preferred language (1-15).
2. **Enter Discord Token:** Paste your user token. *(Your token is completely safe and is only kept in the active memory/RAM during the session).*
3. **Enter Webhook URL (Optional):** If you want live tracking on your server, paste a Discord webhook URL. Press Enter to skip.
4. **Enter Channel/DM ID:** The ID of the chat you want to clear.
5. **Enter Username (Optional):** Type a specific username to delete only their messages, or leave it blank to target all messages.

The script will first scan the entire channel to calculate the exact number of messages, send a webhook notification, and then begin the deletion process while updating the visual progress bar.

---

## 📞 Contact & Issues

If you encounter any bugs, have a feature request, or need help, feel free to reach out!
**Discord:** `keyrua`

---

## ⚠️ Disclaimer

Automating user accounts (Self-botting) is against Discord's Terms of Service. This script is provided for educational purposes and account management only. Use it responsibly and at your own risk. The developer is not responsible for any account bans or data loss.
