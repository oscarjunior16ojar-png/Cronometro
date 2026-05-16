import { UserExamConfig, ExamStrategy } from '../types';

export const generateStrategy = async (config: UserExamConfig): Promise<ExamStrategy> => {
  const response = await fetch('/api/generate-strategy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    throw new Error('No se pudo generar la estrategia');
  }

  return response.json();
};
