import { useState } from "react";
import { Play, Clock, HelpCircle, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
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

  const { data: quizData } = useQuery({
    queryKey: ['/api/quiz-data'],
    queryFn: async () => {
      const { default: data } = await import("@/data/quiz-data.json");
      return data;
    }
  });

  const handleStartQuiz = (quizId: string) => {
    toast({
      title: "Quiz Starting!",
      description: `Starting ${quizData?.quizzes.find((q: QuizCard) => q.id === quizId)?.title} quiz...`,
    });
    // TODO: Implement quiz logic
  };

  const handleLearnMore = (topic: string) => {
    toast({
      title: "Learning Module",
      description: `Opening educational content about ${topic}...`,
    });
    // TODO: Implement learning module
  };

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
                  onClick={() => handleStartQuiz(quiz.id)}
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
                  onClick={() => handleLearnMore(card.topic)}
                  variant="outline"
                  className="w-full border" 
                  style={{ backgroundColor: 'hsl(207, 90%, 54%, 0.2)', borderColor: 'hsl(207, 90%, 54%, 0.5)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(207, 90%, 54%, 0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(207, 90%, 54%, 0.2)'}
                >
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
