# Drag & Drop Math

A step-by-step math problem solver with drag-and-drop functionality for interactive learning.

## Features

### 1. Interactive Math Solution Builder

- Drag and drop solution steps into a canvas
- Connect steps in the correct logical order
- Verify your solution and receive immediate feedback
- Input the final answer in the last step
- Visual indication of correct and incorrect connections

### 2. Multiple Problem Modes

- **Single Problem Mode**: Enter any math problem and get an AI-generated step-by-step solution
- **PDF Upload Mode**: Upload a PDF containing multiple math problems and practice them all

### 3. Problem Navigation

- Navigate between multiple problems extracted from PDFs
- Track your progress through the problem set
- See which problems you've completed
- Celebration animations when you solve problems correctly

### 4. Gamification System

- Earn points for solving problems correctly
- Level up as you earn more points
- Unlock achievements for milestones like:
    - First Solution
    - Math Expert (perfect score)
    - Streak Master (solve multiple problems in a row)
    - Quick Solver (solve in under 60 seconds)
    - Persistent Learner (solve after getting it wrong)
- Maintain and increase your streak of correct answers

### 5. Advanced Features

- Auto-connect nodes for quick arrangement
- Arrange nodes in optimal layout
- Delete unwanted connections
- Zoom and pan controls for large solutions
- Reset canvas to start over

## How to Use

### Single Problem Mode

1. Enter a math problem in the input field
2. Click "Generate Solution"
3. Drag steps from the sidebar to the canvas
4. Connect the steps in the correct order
5. Enter the final answer in the last step
6. Click "Verify Solution"
7. See your score and feedback

### PDF Upload Mode

1. Upload a PDF containing math problems
2. The system will extract multiple problems with step-by-step solutions
3. Solve each problem by dragging, connecting, and verifying
4. Navigate between problems using the navigation bar
5. Track your progress through the problem set

## Implementation Details

The application uses:

- Next.js for the framework
- ReactFlow for the node-based canvas
- Zustand for state management
- OpenAI's GPT-4o for generating solutions and extracting problems from PDFs
- Framer Motion for animations
- Tailwind CSS for styling
- Canvas Confetti for celebrations
- Vercel KV for temporary storage of extracted problems

## PDF Processing

The PDF processing feature:

1. Uploads a PDF document
2. Extracts text using LangChain's PDFLoader
3. Uses GPT-4o to identify math problems and create step-by-step solutions
4. Formats the results as structured data
5. Stores problems in browser local storage via Zustand
6. Allows navigation between all extracted problems
