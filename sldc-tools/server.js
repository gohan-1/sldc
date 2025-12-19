// This file is our backend server - think of it as the "kitchen" that processes requests

// STEP 0: Load environment variables from .env file
// This MUST be at the very top, before any other code
// "dotenv" reads the .env file and loads the variables into process.env
require('dotenv').config();

// STEP 1: Import the tools we need
// "require" is how we load other code files or packages in Node.js
const express = require('express');        // Express helps us create a web server easily
const OpenAI = require('openai');         // OpenAI package lets us talk to AI (ChatGPT)
const path = require('path');              // "path" helps us work with file/folder locations

// STEP 2: Create our server application
// "express()" creates a new web server for us
const app = express();

// STEP 3: Set up OpenAI connection
// We need an API key to use OpenAI's services (like ChatGPT)
// The API key is loaded from the .env file (see STEP 0 above)
// process.env.OPENAI_API_KEY reads the value from the .env file
const apiKey = process.env.OPENAI_API_KEY;

// Check if API key exists
if (!apiKey) {
  console.error('ERROR: OPENAI_API_KEY is not set in .env file!');
  console.error('Please create a .env file with: OPENAI_API_KEY=your-actual-key-here');
  process.exit(1); // Stop the server if no API key is found
}

const openai = new OpenAI({
  apiKey: apiKey
});

// STEP 4: Tell Express to understand JSON data
// When the frontend sends us data, it comes as JSON (a text format)
// This line tells Express: "Hey, automatically convert JSON text into JavaScript objects"
app.use(express.json());

// STEP 5: Serve our frontend files
// This tells Express: "When someone asks for files, look in the 'public' folder"
// For example, if someone visits http://localhost:3000/index.html, serve public/index.html
app.use(express.static('public'));

// STEP 6: Create the simplest possible endpoint
// This endpoint accepts code as text and sends it to AI

// What is an endpoint? It's like a specific address on our server.
// When someone visits this address with a POST request, this function runs.
app.post('/api/analyze', async (req, res) => {
  // "app.post" = handle POST requests (when data is sent TO us)
  // "/api/analyze" = the URL path (like a door number)
  // "async" = this function can wait for slow things (like AI responses)
  // "req" = request (data coming IN)
  // "res" = response (data going OUT)
  
  try {
    // STEP 1: Get the code from the request
    // The frontend sends us: { code: "function hello() { ... }" }
    const { code } = req.body;
    
    // STEP 2: Check if code was provided
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }
    
    // STEP 3: Send code to AI and WAIT for response
    // "await" means: "Stop here and wait until AI responds (might take 2-5 seconds)"
    // Without "await", we'd try to use the result before AI finished thinking!
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',        // Which AI to use
      messages: [
        {
          role: 'user',               // We're asking a question
          content: `Explain this code:\n\n${code}`  // The question + code
        }
      ],
      max_tokens: 1000                // Max response length
    });
    
    // STEP 4: Get the AI's answer
    // The AI's response is buried inside the completion object
    const result = completion.choices[0].message.content;
    
    // STEP 5: Send the result back to frontend
    res.json({ result: result });
    
  } catch (error) {
    // If something breaks (AI is down, wrong API key, etc.)
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to analyze code' });
  }
});

// STEP 7: Create endpoint for generating unit tests
// This endpoint takes source code and asks AI to generate unit tests for it
app.post('/api/generate-tests', async (req, res) => {
  // "app.post" = handle POST requests
  // "/api/generate-tests" = the URL path for this endpoint
  // "async" = can wait for AI responses
  // "req" = incoming request
  // "res" = outgoing response
  
  try {
    // STEP 1: Get the code from the request
    const { code } = req.body;
    
    // STEP 2: Check if code was provided
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }
    
    // STEP 3: Create a very clear prompt for the AI
    // We want the AI to generate readable, well-structured unit tests
    const prompt = `You are a software testing expert. Generate comprehensive unit tests for the following JavaScript code.

Requirements:
1. Use Jest testing framework syntax
2. Write clear, descriptive test names
3. Test normal cases, edge cases, and error cases
4. Include comments explaining what each test does
5. Format the output with proper indentation
6. Make the code readable and easy to understand

Here is the code to test:

\`\`\`javascript
${code}
\`\`\`

Generate the unit tests now:`;

    // STEP 4: Send code to AI and WAIT for response
    // "await" pauses here until AI responds (might take 3-10 seconds)
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',        // Which AI to use
      messages: [
        {
          role: 'system',             // System message sets the AI's role
          content: 'You are an expert software tester who writes clear, comprehensive unit tests.'
        },
        {
          role: 'user',               // User message is our request
          content: prompt             // The detailed prompt we created
        }
      ],
      max_tokens: 2000,               // More tokens for longer test code
      temperature: 0.3                // Lower temperature = more focused, consistent output
    });
    
    // STEP 5: Get the AI's generated tests
    const tests = completion.choices[0].message.content;
    
    // STEP 6: Send the tests back to frontend
    res.json({ tests: tests });
    
  } catch (error) {
    // If something breaks (AI is down, wrong API key, etc.)
    console.error('Error generating tests:', error);
    res.status(500).json({ error: 'Failed to generate unit tests' });
  }
});

// STEP 8: Create endpoint for security review
// This endpoint reviews code for common security issues based on OWASP Top 10
app.post('/api/security-review', async (req, res) => {
  // "app.post" = handle POST requests
  // "/api/security-review" = the URL path for this endpoint
  // "async" = can wait for AI responses
  // "req" = incoming request
  // "res" = outgoing response
  
  try {
    // STEP 1: Get the code from the request
    const { code } = req.body;
    
    // STEP 2: Check if code was provided
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }
    
    // STEP 3: Create a very clear prompt for security review
    // We want the AI to check for OWASP Top 10 issues and provide actionable feedback
    const prompt = `You are a cybersecurity expert specializing in web application security. Review the following JavaScript code for security vulnerabilities based on OWASP Top 10.

Analyze the code and identify any security issues. For each issue found, provide:

1. **Issue Name**: A clear, descriptive name (e.g., "SQL Injection Vulnerability")
2. **Severity**: High, Medium, or Low
3. **OWASP Category**: Which OWASP Top 10 category it falls under
4. **Explanation**: A simple, beginner-friendly explanation of why this is a problem
5. **Location**: Where in the code the issue exists (line numbers or function names)
6. **Suggested Fix**: Specific code example showing how to fix it

Format your response as a clear list. If no issues are found, say "No security issues detected."

Here is the code to review:

\`\`\`javascript
${code}
\`\`\`

Review the code now:`;

    // STEP 4: Send code to AI and WAIT for response
    // "await" pauses here until AI responds (might take 3-10 seconds)
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',        // Which AI to use
      messages: [
        {
          role: 'system',             // System message sets the AI's role
          content: 'You are a cybersecurity expert who reviews code for security vulnerabilities. You explain issues clearly and provide actionable fixes.'
        },
        {
          role: 'user',               // User message is our request
          content: prompt             // The detailed prompt we created
        }
      ],
      max_tokens: 2000,               // More tokens for detailed security analysis
      temperature: 0.2                // Very low temperature = focused, precise security analysis
    });
    
    // STEP 5: Get the AI's security review
    const review = completion.choices[0].message.content;
    
    // STEP 6: Send the review back to frontend
    res.json({ review: review });
    
  } catch (error) {
    // If something breaks (AI is down, wrong API key, etc.)
    console.error('Error in security review:', error);
    res.status(500).json({ error: 'Failed to review code for security issues' });
  }
});

// STEP 9: Start the server
// This tells our server to start listening for requests
const PORT = 3000;                        // Port 3000 is like a door number - where our server lives
app.listen(PORT, () => {
  // This message appears when the server starts successfully
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Open this URL in your browser to see the app!');
});

