# SDLC Tools - Simple Code Analysis MVP

A simple web application that helps you analyze code using AI. Paste your code, and get explanations, unit tests, or security reviews instantly!

## 🎯 What This Project Does

This is a **Minimum Viable Product (MVP)** that provides three main features:

1. **Code Explanation** - Understand what your code does
2. **Unit Test Generation** - Automatically create tests for your code
3. **Security Review** - Find security vulnerabilities in your code

## 📋 Prerequisites (What You Need Before Starting)

Before you can run this project, you need:

1. **Node.js** installed on your computer
   - Download from: https://nodejs.org/
   - Choose the LTS (Long Term Support) version
   - After installing, verify by opening a terminal and typing: `node --version`
   - You should see something like: `v18.17.0` or similar

2. **OpenAI API Key**
   - Go to: https://platform.openai.com/
   - Sign up or log in
   - Go to API Keys section
   - Create a new API key
   - **Important**: Save this key somewhere safe! You'll need it in the next steps.

## 🚀 How to Run the Project

### Step 1: Install Dependencies

Open a terminal (command prompt) and navigate to the project folder:

```bash
cd /home/vishnu/sldc/sldc-tools
```

Then install the required packages:

```bash
npm install
```

**What this does**: Downloads and installs all the code libraries this project needs (like Express and OpenAI).

**Expected output**: You'll see a lot of text scrolling by, and at the end you should see something like:
```
added 50 packages in 5s
```

### Step 2: Set Up Your OpenAI API Key

You need to create a `.env` file to store your OpenAI API key securely.

1. **Create a `.env` file** in the project folder (`sldc-tools/`)

2. **Add your API key** to the file:
   ```
   OPENAI_API_KEY=your-actual-api-key-here
   ```
   
   **Important**: Replace `your-actual-api-key-here` with your real OpenAI API key (no quotes needed)

3. **Example `.env` file content**:
   ```
   OPENAI_API_KEY=sk-1234567890abcdefghijklmnopqrstuvwxyz
   ```

**Why use a `.env` file?**
- Keeps your API key secret (the `.env` file is not committed to git)
- Easy to manage - all configuration in one place
- Standard practice in Node.js projects

**Note**: The `.env` file is already in `.gitignore`, so it won't be accidentally committed to version control.

### Step 3: Start the Server

Run this command:

```bash
npm start
```

**What this does**: Starts the web server on your computer.

**Expected output**: You should see:
```
Server is running on http://localhost:3000
Open this URL in your browser to see the app!
```

**Important**: Keep this terminal window open! The server needs to keep running.

### Step 4: Open in Your Browser

Open your web browser and go to:

```
http://localhost:3000
```

**Note**: The frontend (HTML page) hasn't been created yet, so you'll see an error or blank page. That's okay! The backend is working.

## 🔌 API Endpoints (How to Use the Backend)

Since the frontend isn't built yet, you can test the backend using tools like:
- **Postman** (download from https://www.postman.com/)
- **curl** (command line tool)
- **Browser extensions** for API testing

### Endpoint 1: Code Explanation

**URL**: `http://localhost:3000/api/analyze`  
**Method**: POST  
**What it does**: Explains what your code does in simple terms

**How to test with curl**:
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"code": "function add(a, b) { return a + b; }"}'
```

**Expected Output**:
```json
{
  "result": "This code defines a function called 'add' that takes two parameters, 'a' and 'b', and returns their sum. It's a simple addition function that can be called with two numbers to get their total."
}
```

### Endpoint 2: Generate Unit Tests

**URL**: `http://localhost:3000/api/generate-tests`  
**Method**: POST  
**What it does**: Creates unit tests for your code

**How to test with curl**:
```bash
curl -X POST http://localhost:3000/api/generate-tests \
  -H "Content-Type: application/json" \
  -d '{"code": "function add(a, b) { return a + b; }"}'
```

**Expected Output**:
```json
{
  "tests": "describe('add function', () => {\n  test('should add two positive numbers', () => {\n    expect(add(2, 3)).toBe(5);\n  });\n  \n  test('should add negative numbers', () => {\n    expect(add(-1, -2)).toBe(-3);\n  });\n  \n  test('should add zero', () => {\n    expect(add(5, 0)).toBe(5);\n  });\n});"
}
```

The `tests` field will contain complete Jest test code that you can copy and use.

### Endpoint 3: Security Review

**URL**: `http://localhost:3000/api/security-review`  
**Method**: POST  
**What it does**: Reviews your code for security vulnerabilities

**How to test with curl**:
```bash
curl -X POST http://localhost:3000/api/security-review \
  -H "Content-Type: application/json" \
  -d '{"code": "const query = \"SELECT * FROM users WHERE id = \" + userId;"}'
```

**Expected Output**:
```json
{
  "review": "Security Issues Found:\n\n1. **SQL Injection Vulnerability**\n   - Severity: High\n   - OWASP Category: Injection (A03)\n   - Explanation: The code directly concatenates user input into SQL queries...\n   - Location: Line 1\n   - Suggested Fix: Use parameterized queries..."
}
```

The `review` field will contain a detailed security analysis with issues, explanations, and fixes.

## 📊 What Are the Outputs?

### 1. Code Explanation Output
- **Format**: Plain text explanation
- **Content**: Simple, beginner-friendly explanation of what the code does
- **Use Case**: When you want to understand unfamiliar code

### 2. Unit Tests Output
- **Format**: JavaScript code (Jest framework)
- **Content**: Complete, ready-to-use test code
- **Use Case**: When you need to test your code but don't want to write tests manually

### 3. Security Review Output
- **Format**: Structured list with:
  - Issue names
  - Severity levels (High/Medium/Low)
  - OWASP categories
  - Simple explanations
  - Code locations
  - Suggested fixes with code examples
- **Use Case**: When you want to find and fix security problems before deploying

## 🎯 What Is the End Result?

The end result is a **working backend server** that:

1. ✅ **Accepts code** from users (via API requests)
2. ✅ **Processes code** using AI (OpenAI's GPT-3.5-turbo)
3. ✅ **Returns useful results**:
   - Code explanations
   - Generated unit tests
   - Security vulnerability reports

### Current Status:
- ✅ Backend is complete and working
- ⏳ Frontend (HTML page) is not yet built
- ⏳ Users currently need to use API testing tools (like Postman) to interact with it

### Next Steps (Future):
- Build a simple HTML frontend with:
  - A text box to paste code
  - Three buttons (Explain, Generate Tests, Security Review)
  - An area to display results
- This will make it user-friendly for non-technical users

## 🛠️ Project Structure

```
sldc-tools/
├── server.js          # Backend server (handles API requests)
├── package.json       # Project configuration and dependencies
├── public/            # Frontend files (to be created)
│   ├── index.html     # Main web page (to be created)
│   └── style.css      # Styling (optional, to be created)
└── README.md          # This file!
```

## ❓ Troubleshooting

### Problem: "npm: command not found"
**Solution**: Node.js is not installed. Download and install it from https://nodejs.org/

### Problem: "Error: Cannot find module 'express'"
**Solution**: Run `npm install` in the project folder

### Problem: "Failed to analyze code" or API errors
**Solution**: 
- Check that your OpenAI API key is set correctly
- Make sure you have credits in your OpenAI account
- Verify the API key is valid at https://platform.openai.com/

### Problem: "Port 3000 is already in use"
**Solution**: 
- Another program is using port 3000
- Either stop that program, or change the PORT number in `server.js` (line 151)

### Problem: Server starts but I can't access it
**Solution**: 
- Make sure you're going to `http://localhost:3000` (not `https://`)
- Check that the server is still running in your terminal
- Try `http://127.0.0.1:3000` instead

## 📝 Notes

- This is a **simple MVP** - it's designed to be minimal and easy to understand
- No database is used - everything is processed in real-time
- No authentication - anyone who can access the server can use it
- The AI responses depend on OpenAI's service - make sure you have internet connection

## 🎓 Learning Resources

If you're new to programming, here are some concepts used in this project:

- **Node.js**: JavaScript runtime that lets you run JavaScript on your computer (not just in browsers)
- **Express**: A framework that makes it easy to create web servers
- **API Endpoint**: A specific URL that performs a task when you send data to it
- **JSON**: A text format for sending data between frontend and backend
- **async/await**: JavaScript features that let code wait for slow operations (like AI responses)

## 📞 Need Help?

If you encounter any issues:
1. Check the error message in your terminal
2. Verify all prerequisites are installed
3. Make sure your OpenAI API key is correct
4. Check that the server is running (you should see the "Server is running" message)

---

**Happy Coding! 🚀**

