export interface StrategyPhase {
  phase: string;
  minutes: number;
  description: string;
}

export interface StressTechnique {
  name: string;
  steps: string[];
}

export interface ExamStrategy {
  distribution: StrategyPhase[];
  tips: string[];
  stressTechnique: StressTechnique;
}

export interface UserExamConfig {
  examType: string;
  duration: number;
  questionCount: number;
  difficulty: 'fácil' | 'medio' | 'difícil';
}
