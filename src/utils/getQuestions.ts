/* export interface Question {
    id: string;
    question: string;
    options: string[];
    isInverted: boolean;
    isFollowUp: boolean;
    weight: number;
    domain: string;
    dashboardDomain: string;
    dashboardDomainWeight: number;
}

export function getRandomQuestions(questions: Question[], count: number): Question[] {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export function isHighRisk(question: Question, selectedOption: string): boolean {
    if (question.isInverted) {
        return selectedOption === question.options[question.options.length - 1];
    } else {
        return selectedOption === question.options[0];
    }
}
 */