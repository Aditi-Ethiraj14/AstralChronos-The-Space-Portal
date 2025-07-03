import { useState } from "react";
import { Play, Clock, HelpCircle, BookOpen, CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface QuizCard {
  id: string;
  title: string;
  emoji: string;
  description: string;
  duration: string;
  questions: number;
  image: string;
  questionsData?: QuizQuestion[];
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface LearningCard {
  id: string;
  title: string;
  emoji: string;
  description: string;
  readTime: string;
  topic: string;
}

export default function SpaceQuiz() {
  const { toast } = useToast();
  const [activeQuiz, setActiveQuiz] = useState<QuizCard | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timer, setTimer] = useState(30);

  const { data: quizData } = useQuery({
    queryKey: ['/api/quiz-data'],
    queryFn: async () => {
      const { default: data } = await import("@/data/quiz-data.json");
      return data;
    }
  });

  const handleStartQuiz = (quiz: QuizCard) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
    setTimer(30);
    toast({
      title: "Quiz Started!",
      description: `Good luck with the ${quiz.title} quiz!`,
    });
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === activeQuiz?.questionsData?.[currentQuestion]?.correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!activeQuiz?.questionsData) return;
    
    if (currentQuestion < activeQuiz.questionsData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimer(30);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
    setTimer(30);
  };

  const handleLearnMore = (topic: string) => {
    toast({
      title: "Learning Module",
      description: `Opening educational content about ${topic}...`,
    });
  };

  // Quiz Interface
  if (activeQuiz) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full glass-morphism rounded-xl p-8">
          {!quizCompleted ? (
            <>
              {/* Quiz Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'Orbitron, monospace', color: 'hsl(35, 91%, 48%)' }}>
                  {activeQuiz.title}
                </h2>
                <Button
                  onClick={() => setActiveQuiz(null)}
                  variant="outline"
                  size="sm"
                >
                  Exit Quiz
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Question {currentQuestion + 1} of {activeQuiz.questionsData?.length}</span>
                  <span>Score: {score}/{activeQuiz.questionsData?.length}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / (activeQuiz.questionsData?.length || 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              {activeQuiz.questionsData && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl mb-6">{activeQuiz.questionsData[currentQuestion].question}</h3>
                    
                    <div className="space-y-3 mb-6">
                      {activeQuiz.questionsData[currentQuestion].options.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          className={`w-full p-4 rounded-lg border transition-all ${
                            selectedAnswer === null
                              ? 'border-gray-600 hover:border-blue-400 hover:bg-blue-400/10'
                              : selectedAnswer === index
                              ? index === activeQuiz.questionsData![currentQuestion].correct
                                ? 'border-green-400 bg-green-400/20'
                                : 'border-red-400 bg-red-400/20'
                              : index === activeQuiz.questionsData![currentQuestion].correct
                              ? 'border-green-400 bg-green-400/20'
                              : 'border-gray-600'
                          } text-left`}
                          disabled={selectedAnswer !== null}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {selectedAnswer !== null && (
                              <>
                                {index === activeQuiz.questionsData![currentQuestion].correct && (
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                )}
                                {selectedAnswer === index && index !== activeQuiz.questionsData![currentQuestion].correct && (
                                  <XCircle className="w-5 h-5 text-red-400" />
                                )}
                              </>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Explanation */}
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-blue-400/10 border border-blue-400/30 rounded-lg"
                      >
                        <p className="text-blue-200">{activeQuiz.questionsData[currentQuestion].explanation}</p>
                      </motion.div>
                    )}

                    {/* Next Button */}
                    {showExplanation && (
                      <Button
                        onClick={handleNextQuestion}
                        className="w-full"
                        size="lg"
                      >
                        {currentQuestion < (activeQuiz.questionsData?.length || 0) - 1 ? (
                          <>Next Question <ArrowRight className="w-4 h-4 ml-2" /></>
                        ) : (
                          'Complete Quiz'
                        )}
                      </Button>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </>
          ) : (
            /* Quiz Results */
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Orbitron, monospace', color: 'hsl(35, 91%, 48%)' }}>
                Quiz Complete!
              </h2>
              <div className="text-6xl mb-4">
                {score === activeQuiz.questionsData?.length ? '🏆' : score >= (activeQuiz.questionsData?.length || 0) * 0.7 ? '⭐' : '📚'}
              </div>
              <p className="text-2xl mb-4">
                You scored {score} out of {activeQuiz.questionsData?.length}
              </p>
              <p className="text-lg mb-8 text-gray-300">
                {score === activeQuiz.questionsData?.length
                  ? 'Perfect! You are a space expert!'
                  : score >= (activeQuiz.questionsData?.length || 0) * 0.7
                  ? 'Great job! You know your space facts!'
                  : 'Keep learning! The universe has so much to offer!'}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={handleRetakeQuiz} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
                <Button onClick={() => setActiveQuiz(null)}>
                  Back to Quizzes
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <section id="quiz" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.h2 
          className="text-4xl md:text-6xl text-center mb-16"
          style={{ fontFamily: 'Orbitron, monospace' }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Space Knowledge Quiz
          </span>
        </motion.h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quiz Cards */}
            {quizData?.quizzes?.map((quiz: QuizCard, index: number) => (
              <motion.div
                key={quiz.id}
                className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg" style={{ fontFamily: 'Orbitron, monospace', color: 'hsl(35, 91%, 48%)' }}>
                    {quiz.title}
                  </h3>
                  <div className="text-2xl">{quiz.emoji}</div>
                </div>
                <img 
                  src={quiz.image} 
                  alt={quiz.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-300 text-sm mb-4">{quiz.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-1" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'hsl(207, 90%, 54%)' }}>
                    <Clock className="w-4 h-4" />
                    {quiz.duration}
                  </span>
                  <span className="text-stellar-orange flex items-center gap-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    <HelpCircle className="w-4 h-4" />
                    {quiz.questions} questions
                  </span>
                </div>
                <Button
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full glow-button bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-400/80 hover:to-purple-400/80"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Quiz
                </Button>
              </motion.div>
            ))}

            {/* Learning Cards */}
            {quizData?.learningCards?.map((card: LearningCard, index: number) => (
              <motion.div
                key={card.id}
                className="glass-morphism rounded-xl p-6 border-2 border-electric-blue/30 hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 3) * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg" style={{ fontFamily: 'Orbitron, monospace', color: 'hsl(207, 90%, 54%)' }}>
                    {card.title}
                  </h3>
                  <div className="text-2xl">{card.emoji}</div>
                </div>
                <p className="text-gray-300 text-sm mb-4">{card.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-stellar-orange flex items-center gap-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    <BookOpen className="w-4 h-4" />
                    {card.readTime}
                  </span>
                  <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'hsl(250, 85%, 60%, 0.3)' }}>Educational</span>
                </div>
                <Button
                  onClick={() => {
                    if (index === 0) { // Assuming this condition targets the first card for black holes
                      window.open('https://science.nasa.gov/universe/black-holes/', '_blank');
                    } else if (index === 1) { // Second card for Exoplanets
                      window.open('https://exoplanets.nasa.gov/', '_blank');
                    } else if (index === 2) { // Third card for Space Weather
                    window.open('https://science.nasa.gov/heliophysics/focus-areas/space-weather/', '_blank');
                    }
                  }}
                  className="w-full glow-button bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-400/80 hover:to-purple-400/80"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
