import React, { useState } from 'react';
import { CheckCircle, XCircle, Trophy, BookOpen, Sparkles } from 'lucide-react';

const AlgebraApp = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentSequence, setCurrentSequence] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
const [completedTasks, setCompletedTasks] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [sequenceComplete, setSequenceComplete] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [level2Tasks, setLevel2Tasks] = useState([]);
  const [level3Tasks, setLevel3Tasks] = useState([]);
  const [level4Tasks, setLevel4Tasks] = useState([]);

  // Helper function to generate random integer between min and max (inclusive)
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Helper function to generate a random sign (+ or -)
  // Generate Level 2 problems: (ax+b) + (cx+d) or ax+b + cx+d
  const generateLevel2Problems = () => {
    const problems = [];
    
    for (let i = 0; i < 10; i++) {
      const a = randomInt(1, 7);
      const b = randomInt(-8, 8);
      const c = randomInt(1, 5);
      const d = randomInt(-8, 8);
      
      // Randomly choose format: with parentheses, without, addition, or subtraction
      const format = randomInt(1, 5);
      let problem, answer;
      
      if (format === 1) {
        // (ax + b) + (cx + d)
        problem = `(${a}x ${b >= 0 ? '+' : ''} ${b}) + (${c}x ${d >= 0 ? '+' : ''} ${d})`;
        answer = `${a + c}x ${(b + d) >= 0 ? '+' : ''} ${b + d}`;
      } else if (format === 2) {
        // (ax + b) - (cx + d)
        problem = `(${a}x ${b >= 0 ? '+' : ''} ${b}) - (${c}x ${d >= 0 ? '+' : ''} ${d})`;
        answer = `${a - c}x ${(b - d) >= 0 ? '+' : ''} ${b - d}`;
      } else if (format === 3) {
        // ax + b + cx + d (no parentheses, addition)
        problem = `${a}x ${b >= 0 ? '+' : ''} ${b} + ${c}x ${d >= 0 ? '+' : ''} ${d}`;
        answer = `${a + c}x ${(b + d) >= 0 ? '+' : ''} ${b + d}`;
      } else if (format === 4) {
        // ax + b - cx - d (no parentheses, subtraction)
        problem = `${a}x ${b >= 0 ? '+' : ''} ${b} - ${c}x ${d >= 0 ? '-' : '+'} ${Math.abs(d)}`;
        answer = `${a - c}x ${(b - d) >= 0 ? '+' : ''} ${b - d}`;
      } else {
        // ax + b - (cx + d) (parentheses only on second term)
        problem = `${a}x ${b >= 0 ? '+' : ''} ${b} - (${c}x ${d >= 0 ? '+' : ''} ${d})`;
        answer = `${a - c}x ${(b - d) >= 0 ? '+' : ''} ${b - d}`;
      }
      
      problems.push({ problem, answer });
    }
    
    return problems;
  };

  // Generate Level 3 problems: n(ax+b) + m(cx+d)
  const generateLevel3Problems = () => {
    const problems = [];
    
    for (let i = 0; i < 10; i++) {
      const n = randomInt(2, 6);
      const a = randomInt(1, 4);
      const b = randomInt(-5, 5);
      const m = randomInt(2, 6);
      const c = randomInt(1, 4);
      const d = randomInt(-5, 5);
      
      // Randomly choose addition or subtraction
      const isAddition = Math.random() < 0.5;
      
      let problem, answer;
      
      if (isAddition) {
        problem = `${n}(${a}x ${b >= 0 ? '+' : ''} ${b}) + ${m}(${c}x ${d >= 0 ? '+' : ''} ${d})`;
        answer = `${n * a + m * c}x ${(n * b + m * d) >= 0 ? '+' : ''} ${n * b + m * d}`;
      } else {
        problem = `${n}(${a}x ${b >= 0 ? '+' : ''} ${b}) - ${m}(${c}x ${d >= 0 ? '+' : ''} ${d})`;
        answer = `${n * a - m * c}x ${(n * b - m * d) >= 0 ? '+' : ''} ${n * b - m * d}`;
      }
      
      problems.push({ problem, answer });
    }
    
    return problems;
  };

  // Generate Level 4 problems: Equations to solve for x
  // 70% positive integer solutions, 30% with complex expressions (Level 3 style)
  const generateLevel4Problems = () => {
    const problems = [];
    
    for (let i = 0; i < 10; i++) {
      const isComplex = i >= 7; // Last 3 problems (30%) are complex
      const isPositive = Math.random() < 0.7 || isComplex; // 70% positive
      
      let problem, answer;
      
      if (isComplex) {
        // Complex: n(ax + b) + m(cx + d) = result
        // Work backwards from a solution
        const x = isPositive ? randomInt(1, 10) : randomInt(-10, -1);
        const n = randomInt(2, 5);
        const a = randomInt(1, 3);
        const b = randomInt(-4, 4);
        const m = randomInt(2, 5);
        const c = randomInt(1, 3);
        const d = randomInt(-4, 4);
        
        // Calculate what the right side should be
        const leftCoeff = n * a + m * c;
        const leftConst = n * b + m * d;
        const result = leftCoeff * x + leftConst;
        
        problem = `${n}(${a}x ${b >= 0 ? '+' : ''} ${b}) + ${m}(${c}x ${d >= 0 ? '+' : ''} ${d}) = ${result}`;
        answer = `${x}`;
      } else {
        // Simple: ax + b = cx + d or ax + b = result
        const x = isPositive ? randomInt(1, 15) : randomInt(-15, -1);
        
        if (Math.random() < 0.6) {
          // Form: ax + b = cx + d
          const a = randomInt(2, 8);
          const b = randomInt(-10, 10);
          const c = randomInt(1, a - 1); // Ensure a > c so coefficient is positive
          const d = randomInt(-10, 10);
          
          // Calculate to ensure solution is x
          // ax + b = cx + d
          // ax - cx = d - b
          // x(a - c) = d - b
          // x = (d - b) / (a - c)
          // So: d - b = x * (a - c)
          const rightSide = x * (a - c) + b;
          
          problem = `${a}x ${b >= 0 ? '+' : ''} ${b} = ${c}x ${rightSide >= 0 ? '+' : ''} ${rightSide}`;
          answer = `${x}`;
        } else {
          // Form: ax + b = result
          const a = randomInt(2, 8);
          const b = randomInt(-10, 10);
          const result = a * x + b;
          
          problem = `${a}x ${b >= 0 ? '+' : ''} ${b} = ${result}`;
          answer = `${x}`;
        }
      }
      
      problems.push({ problem, answer });
    }
    
    return problems;
  };

  // Level 1: Sequenced Tasks
  const level1Sequences = [
    {
      title: "Understanding Subtraction of Positive Constants",
      hint: "When the constant being subtracted increases by 1, the result decreases by 1",
      tasks: [
        { problem: "(5x + 7) - (x + 3)", answer: "4x + 4" },
        { problem: "(5x + 7) - (x + 4)", answer: "4x + 3" },
        { problem: "(5x + 7) - (x + 2)", answer: "4x + 5" }
      ]
    },
    {
      title: "Starting with Negative Constants",
      hint: "Watch what happens when you start with a negative and subtract different amounts",
      tasks: [
        { problem: "(6x - 5) - (2x + 1)", answer: "4x - 6" },
        { problem: "(6x - 5) - (2x + 2)", answer: "4x - 7" },
        { problem: "(6x - 5) - (2x + 0)", answer: "4x - 5" }
      ]
    },
    {
      title: "Transitioning from Positive to Negative Constants",
      hint: "Notice the pattern as we cross zero - the pattern continues!",
      tasks: [
        { problem: "(4x + 6) - (2x + 2)", answer: "2x + 4" },
        { problem: "(4x + 6) - (2x + 1)", answer: "2x + 5" },
        { problem: "(4x + 6) - (2x + 0)", answer: "2x + 6" },
        { problem: "(4x + 6) - (2x - 1)", answer: "2x + 7" },
        { problem: "(4x + 6) - (2x - 2)", answer: "2x + 8" }
      ]
    },
    {
      title: "Subtracting from Negative Constants",
      hint: "When both expressions have negatives, be extra careful with the distribution!",
      tasks: [
        { problem: "(5x - 8) - (x - 3)", answer: "4x - 5" },
        { problem: "(5x - 8) - (x - 4)", answer: "4x - 4" },
        { problem: "(5x - 8) - (x - 5)", answer: "4x - 3" }
      ]
    },
    {
      title: "Isolating the Constant Distribution",
      hint: "Parentheses with just 2x is different from (2x - 3). The negative sign distributes!",
      tasks: [
        { problem: "(6x + 5) - 2x", answer: "4x + 5" },
        { problem: "(6x + 5) - (2x + 0)", answer: "4x + 5" },
        { problem: "(6x + 5) - (2x - 3)", answer: "4x + 8" }
      ]
    },
    {
      title: "Building with Negative Constants",
      hint: "Remember: 3(x - 2) becomes 3x - 6 before you subtract",
      tasks: [
        { problem: "3(x - 2) - (x + 1)", answer: "2x - 7" },
        { problem: "3(x - 2) - (x + 2)", answer: "2x - 8" },
        { problem: "3(x - 2) - (x + 0)", answer: "2x - 6" }
      ]
    },
    {
      title: "Both Terms with Coefficients and Negatives",
      hint: "Distribute both coefficients carefully, then combine like terms",
      tasks: [
        { problem: "4(x - 1) - 2(x + 3)", answer: "2x - 10" },
        { problem: "4(x - 1) - 2(x + 2)", answer: "2x - 8" },
        { problem: "4(x - 1) - 2(x + 4)", answer: "2x - 12" }
      ]
    }
  ];

  const normalizeAnswer = (answer) => {
    if (!answer) return '';
    // Remove all spaces
    let normalized = answer.toLowerCase().replace(/\s/g, '');
    
    // For Level 4, check if it's just a number (equation solutions)
    if (/^[+-]?\d+$/.test(normalized)) {
      return normalized.replace(/^\+/, ''); // Remove leading +
    }
    
    // Handle different formats
    // Convert "4x+3" and "3+4x" to a canonical form
    const match = normalized.match(/^([+-]?\d*)x?([+-]\d+)$|^([+-]\d+)([+-]?\d*)x?$/);
    
    if (match) {
      let coefficient = match[1] || match[4] || '';
      let constant = match[2] || match[3] || '';
      
      // Handle implicit 1 or -1 for x coefficient
      if (coefficient === '' || coefficient === '+') coefficient = '1';
      if (coefficient === '-') coefficient = '-1';
      
      // Remove leading + from constant
      constant = constant.replace(/^\+/, '');
      
      // Handle x + 0 or 0x cases
      if (constant === '+0' || constant === '0') constant = '';
      if (coefficient === '0') return constant || '0';
      
      return coefficient + 'x' + (constant !== '' ? constant : '');
    }
    
    return normalized;
  };

  const checkTask = (taskIndex) => {
    let currentProblem;
    if (currentLevel === 1) {
      currentProblem = level1Sequences[currentSequence].tasks[taskIndex];
    } else if (currentLevel === 2) {
      currentProblem = level2Tasks[taskIndex];
    } else if (currentLevel === 3) {
      currentProblem = level3Tasks[taskIndex];
    } else {
      currentProblem = level4Tasks[taskIndex];
    }
    
    const userAnswer = userAnswers[taskIndex] || '';
    const normalized = normalizeAnswer(userAnswer);
    const correctNormalized = normalizeAnswer(currentProblem.answer);
    
    if (normalized === correctNormalized) {
      setFeedback(prev => ({
        ...prev,
        [taskIndex]: { correct: true, message: "Correct! ✓" }
      }));
      if (!feedback[taskIndex]?.correct) {
        setCompletedTasks(completedTasks + 1);
      }
      return true;
    } else if (userAnswer.trim() !== '') {
      setFeedback(prev => ({
        ...prev,
        [taskIndex]: { correct: false, message: `Not quite. Answer: ${currentProblem.answer}` }
      }));
      return false;
    }
    return false;
  };

  const checkAllTasks = () => {
    let tasksInSequence;
    if (currentLevel === 1) {
      tasksInSequence = level1Sequences[currentSequence].tasks;
    } else if (currentLevel === 2) {
      tasksInSequence = level2Tasks;
    } else if (currentLevel === 3) {
      tasksInSequence = level3Tasks;
    } else {
      tasksInSequence = level4Tasks;
    }
    
    let allCorrect = true;
    for (let i = 0; i < tasksInSequence.length; i++) {
      const isCorrect = checkTask(i);
      if (!isCorrect) allCorrect = false;
    }
    
    if (allCorrect && currentLevel === 1) {
      setSequenceComplete(true);
    }
  };

  const nextSequence = () => {
    setUserAnswers({});
    setFeedback({});
    setShowHint(false);
    setSequenceComplete(false);

    if (currentLevel === 1) {
      if (currentSequence < level1Sequences.length - 1) {
        setCurrentSequence(currentSequence + 1);
      } else {
        alert("🎊 Congratulations! You've completed Level 1!");
      }
    }
  };

  const selectLevel = (level) => {
    setCurrentLevel(level);
    setCurrentSequence(0);
    setUserAnswers({});
    setFeedback({});
    setShowHint(false);
    setSequenceComplete(false);
    setShowLevelSelect(false);
    
    // Generate random problems for Level 2, 3, and 4
    if (level === 2) {
      setLevel2Tasks(generateLevel2Problems());
    } else if (level === 3) {
      setLevel3Tasks(generateLevel3Problems());
    } else if (level === 4) {
      setLevel4Tasks(generateLevel4Problems());
    }
  };

  const handleAnswerChange = (taskIndex, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [taskIndex]: value
    }));
    // Clear feedback when user starts typing again
    if (feedback[taskIndex]) {
      setFeedback(prev => {
        const newFeedback = { ...prev };
        delete newFeedback[taskIndex];
        return newFeedback;
      });
    }
  };

  const handleKeyPress = (e, taskIndex) => {
    if (e.key === 'Enter') {
      checkTask(taskIndex);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="text-indigo-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-800">Algebra Master</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-full">
                <Trophy className="text-indigo-600" size={20} />
                <span className="font-semibold text-indigo-800">{completedTasks} solved</span>
              </div>
              {!showLevelSelect && (
                <button
                  onClick={() => setShowLevelSelect(true)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Change Level
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Level Selection Screen */}
        {showLevelSelect && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Choose Your Level</h2>
            <div className="space-y-4">
              {/* Level 1 */}
              <button
                onClick={() => selectLevel(1)}
                className="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white rounded-lg p-6 text-left transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-black">Level 1: Sequenced Learning</h3>
                    <p className="text-lg text-gray-800 mb-2">Master the fundamentals through carefully designed sequences</p>
                    <p className="text-base text-gray-700 mt-2">• Understand distributing negatives</p>
                    <p className="text-base text-gray-700">• Build pattern recognition</p>
                    <p className="text-base text-gray-700">• 7 sequences with hints</p>
                  </div>
                  <div className="text-5xl">📚</div>
                </div>
              </button>

              {/* Level 2 */}
              <button
                onClick={() => selectLevel(2)}
                className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg p-6 text-left transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-black">Level 2: Basic Practice</h3>
                    <p className="text-lg text-gray-800 mb-2">Practice addition and subtraction with simple expressions</p>
                    <p className="text-base text-gray-700 mt-2">• Format: (ax + b) ± (cx + d)</p>
                    <p className="text-base text-gray-700">• Mix of with and without parentheses</p>
                    <p className="text-base text-gray-700">• 10 randomized problems</p>
                  </div>
                  <div className="text-5xl">✏️</div>
                </div>
              </button>

              {/* Level 3 */}
              <button
                onClick={() => selectLevel(3)}
                className="w-full bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg p-6 text-left transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-black">Level 3: Advanced Challenge</h3>
                    <p className="text-lg text-gray-800 mb-2">Master complex expressions with coefficients</p>
                    <p className="text-base text-gray-700 mt-2">• Format: n(ax + b) + m(cx + d)</p>
                    <p className="text-base text-gray-700">• Multiple distribution steps</p>
                    <p className="text-base text-gray-700">• 10 randomized problems</p>
                  </div>
                  <div className="text-5xl">🏆</div>
                </div>
              </button>

              {/* Level 4 */}
              <button
                onClick={() => selectLevel(4)}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-lg p-6 text-left transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-black">Level 4: Solve for x</h3>
                    <p className="text-lg text-gray-800 mb-2">Solve equations to find the value of x</p>
                    <p className="text-base text-gray-700 mt-2">• Solve linear equations</p>
                    <p className="text-base text-gray-700">• 70% positive solutions</p>
                    <p className="text-base text-gray-700">• 30% complex equations</p>
                  </div>
                  <div className="text-5xl">🎯</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Main Content - Only show when level is selected */}
        {!showLevelSelect && (
          <>
            {/* Level indicator */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="text-indigo-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">
                  Level {currentLevel}: {
                    currentLevel === 1 ? 'Sequenced Learning' : 
                    currentLevel === 2 ? 'Basic Practice' : 
                    currentLevel === 3 ? 'Advanced Challenge' :
                    'Solve for x'
                  }
                </h2>
              </div>
          
          {currentLevel === 1 && (
            <div>
              <p className="text-gray-600 font-medium mb-2">
                Sequence {currentSequence + 1} of {level1Sequences.length}: {level1Sequences[currentSequence].title}
              </p>
              <div className="flex gap-2">
                {level1Sequences.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded-full ${
                      idx < currentSequence ? 'bg-green-500' :
                      idx === currentSequence ? 'bg-indigo-500' :
                      'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {currentLevel === 2 && (
            <div>
              <p className="text-gray-600 mb-2">
                Complete all {level2Tasks.length} basic practice problems
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${(Object.values(feedback).filter(f => f.correct).length / level2Tasks.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}

          {currentLevel === 3 && (
            <div>
              <p className="text-gray-600 mb-2">
                Complete all {level3Tasks.length} advanced challenge problems
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${(Object.values(feedback).filter(f => f.correct).length / level3Tasks.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}

          {currentLevel === 4 && (
            <div>
              <p className="text-gray-600 mb-2">
                Solve all {level4Tasks.length} equations for x
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${(Object.values(feedback).filter(f => f.correct).length / level4Tasks.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Main problem area */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {/* Hint button and display */}
          {currentLevel === 1 && (
            <div className="mb-6">
              {!showHint ? (
                <button
                  onClick={() => setShowHint(true)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium underline"
                >
                  Show hint
                </button>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-sm text-yellow-800">
                    💡 <strong>Hint:</strong> {level1Sequences[currentSequence].hint}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Grid of tasks - Level 1 */}
          {currentLevel === 1 && (
            <div className="space-y-4">
              <p className="text-gray-600 font-medium mb-4">
                Simplify each expression. Notice the pattern as you work through them:
              </p>
              
              {level1Sequences[currentSequence].tasks.map((task, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-4 items-center border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                  {/* Left column - Problem */}
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Task {idx + 1}:</p>
                    <p className="text-2xl font-bold text-black">
                      {task.problem}
                    </p>
                  </div>
                  
                  {/* Right column - Answer input */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Your answer:</label>
                    <input
                      type="text"
                      value={userAnswers[idx] || ''}
                      onChange={(e) => handleAnswerChange(idx, e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, idx)}
                      onBlur={() => checkTask(idx)}
                      placeholder="e.g., 4x + 3"
                      className={`w-full px-4 py-3 text-xl border-2 rounded-lg focus:outline-none transition-colors ${
                        feedback[idx]?.correct 
                          ? 'border-green-500 bg-green-50' 
                          : feedback[idx]?.correct === false 
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-indigo-500'
                      }`}
                    />
                    {feedback[idx] && (
                      <div className={`mt-2 flex items-center gap-2 ${
                        feedback[idx].correct ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {feedback[idx].correct ? (
                          <CheckCircle size={18} />
                        ) : (
                          <XCircle size={18} />
                        )}
                        <p className="text-sm font-medium">{feedback[idx].message}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Level 2 - Basic Practice */}
          {currentLevel === 2 && (
            <div className="space-y-4">
              <p className="text-gray-600 font-medium mb-4">
                Practice basic addition and subtraction:
              </p>
              
              {level2Tasks.map((task, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-4 items-center border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  {/* Left column - Problem */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Problem {idx + 1}:</p>
                    <p className="text-2xl font-bold text-black">
                      {task.problem}
                    </p>
                  </div>
                  
                  {/* Right column - Answer input */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Your answer:</label>
                    <input
                      type="text"
                      value={userAnswers[idx] || ''}
                      onChange={(e) => handleAnswerChange(idx, e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, idx)}
                      onBlur={() => checkTask(idx)}
                      placeholder="e.g., 4x + 3"
                      className={`w-full px-4 py-3 text-xl border-2 rounded-lg focus:outline-none transition-colors ${
                        feedback[idx]?.correct 
                          ? 'border-green-500 bg-green-50' 
                          : feedback[idx]?.correct === false 
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                    {feedback[idx] && (
                      <div className={`mt-2 flex items-center gap-2 ${
                        feedback[idx].correct ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {feedback[idx].correct ? (
                          <CheckCircle size={18} />
                        ) : (
                          <XCircle size={18} />
                        )}
                        <p className="text-sm font-medium">{feedback[idx].message}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Level 3 - Advanced Challenge */}
          {currentLevel === 3 && (
            <div className="space-y-4">
              <p className="text-gray-600 font-medium mb-4">
                Master complex expressions with multiple coefficients:
              </p>
              
              {level3Tasks.map((task, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-4 items-center border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                  {/* Left column - Problem */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Problem {idx + 1}:</p>
                    <p className="text-2xl font-bold text-black">
                      {task.problem}
                    </p>
                  </div>
                  
                  {/* Right column - Answer input */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Your answer:</label>
                    <input
                      type="text"
                      value={userAnswers[idx] || ''}
                      onChange={(e) => handleAnswerChange(idx, e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, idx)}
                      onBlur={() => checkTask(idx)}
                      placeholder="e.g., 4x + 3"
                      className={`w-full px-4 py-3 text-xl border-2 rounded-lg focus:outline-none transition-colors ${
                        feedback[idx]?.correct 
                          ? 'border-green-500 bg-green-50' 
                          : feedback[idx]?.correct === false 
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-purple-500'
                      }`}
                    />
                    {feedback[idx] && (
                      <div className={`mt-2 flex items-center gap-2 ${
                        feedback[idx].correct ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {feedback[idx].correct ? (
                          <CheckCircle size={18} />
                        ) : (
                          <XCircle size={18} />
                        )}
                        <p className="text-sm font-medium">{feedback[idx].message}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Level 4 - Solve for x */}
          {currentLevel === 4 && (
            <div className="space-y-4">
              <p className="text-gray-600 font-medium mb-4">
                Solve each equation for x:
              </p>
              
              {level4Tasks.map((task, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-4 items-center border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                  {/* Left column - Problem */}
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Equation {idx + 1}:</p>
                    <p className="text-2xl font-bold text-black">
                      {task.problem}
                    </p>
                  </div>
                  
                  {/* Right column - Answer input */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">x = </label>
                    <input
                      type="text"
                      value={userAnswers[idx] || ''}
                      onChange={(e) => handleAnswerChange(idx, e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, idx)}
                      onBlur={() => checkTask(idx)}
                      placeholder="e.g., 5"
                      className={`w-full px-4 py-3 text-xl border-2 rounded-lg focus:outline-none transition-colors ${
                        feedback[idx]?.correct 
                          ? 'border-green-500 bg-green-50' 
                          : feedback[idx]?.correct === false 
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-orange-500'
                      }`}
                    />
                    {feedback[idx] && (
                      <div className={`mt-2 flex items-center gap-2 ${
                        feedback[idx].correct ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {feedback[idx].correct ? (
                          <CheckCircle size={18} />
                        ) : (
                          <XCircle size={18} />
                        )}
                        <p className="text-sm font-medium">{feedback[idx].message}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Buttons */}
          {currentLevel === 1 && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={checkAllTasks}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Check All Answers
              </button>
              <button
                onClick={nextSequence}
                className={`flex-1 font-bold py-3 px-6 rounded-lg transition-colors ${
                  sequenceComplete 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                }`}
              >
                Next Sequence →
              </button>
            </div>
          )}

          {(currentLevel === 2 || currentLevel === 3 || currentLevel === 4) && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={checkAllTasks}
                className={`flex-1 font-bold py-3 px-6 rounded-lg transition-colors ${
                  currentLevel === 2 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : currentLevel === 3
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                Check All Answers
              </button>
              <button
                onClick={() => {
                  if (currentLevel === 2) {
                    setLevel2Tasks(generateLevel2Problems());
                  } else if (currentLevel === 3) {
                    setLevel3Tasks(generateLevel3Problems());
                  } else {
                    setLevel4Tasks(generateLevel4Problems());
                  }
                  setUserAnswers({});
                  setFeedback({});
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Generate New Problems
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-2">Instructions:</h3>
          <ul className="text-gray-600 space-y-1 text-sm">
            <li>• Distribute coefficients through parentheses</li>
            <li>• Pay special attention to negative signs!</li>
            <li>• Combine like terms</li>
            <li>• Write your answer in the form: ax + b (e.g., 4x + 3)</li>
            <li>• Press Enter or click outside the box to check individual answers</li>
            {currentLevel === 1 && <li>• Look for patterns across the sequence!</li>}
          </ul>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default AlgebraApp;
