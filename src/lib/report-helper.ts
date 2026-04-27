import { Submission } from "@/data/mock";

export interface CandidateReportData {
  candidateName: string;
  examName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  cheatingScore: number;
  riskLevel: "Low" | "Medium" | "High";
  rank?: number;
  violations: number;
  status: string;
  submittedAt: string;
  aiRecommendation: string;
  isShortlisted: boolean;
}

export interface StudentReportData {
  candidateName: string;
  examName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  correct: number;
  wrong: number;
  unanswered: number;
  status: string;
  submittedAt: string;
  recommendation: string;
}

export const computeReportData = (
  submission: Submission,
  rank?: number,
  allSubmissions?: Submission[]
): CandidateReportData => {
  const percentage = Math.round((submission.score / submission.totalMarks) * 100);
  
  // Calculate cheating score based on violations (0-100)
  // Each violation adds 20 points (5 violation types max)
  const cheatingScore = Math.min(submission.violations * 15, 100);
  
  // Determine risk level
  let riskLevel: "Low" | "Medium" | "High" = "Low";
  if (cheatingScore > 60) {
    riskLevel = "High";
  } else if (cheatingScore > 30) {
    riskLevel = "Medium";
  }
  
  // Generate AI recommendation
  let aiRecommendation = "";
  if (riskLevel === "High") {
    aiRecommendation = `⚠️ HIGH RISK: Multiple exam integrity violations detected (${submission.violations} violations). Manual review recommended before shortlisting. Score: ${percentage}%.`;
  } else if (riskLevel === "Medium") {
    aiRecommendation = `⚠️ MEDIUM RISK: Some exam integrity concerns detected (${submission.violations} violations). Recommend careful review. Score: ${percentage}%.`;
  } else {
    if (percentage >= 75) {
      aiRecommendation = `✅ RECOMMENDED: Clean exam with strong performance (${percentage}%). Candidate demonstrates integrity and competency.`;
    } else if (percentage >= 60) {
      aiRecommendation = `✅ ACCEPTABLE: Clean exam with moderate performance (${percentage}%). Suitable for consideration.`;
    } else {
      aiRecommendation = `❌ NOT RECOMMENDED: Performance below passing threshold (${percentage}%). Consider alternative candidates.`;
    }
  }
  
  return {
    candidateName: submission.candidateName,
    examName: submission.hackathonName,
    score: submission.score,
    totalMarks: submission.totalMarks,
    percentage,
    cheatingScore,
    riskLevel,
    rank,
    violations: submission.violations,
    status: submission.status,
    submittedAt: submission.submittedAt,
    aiRecommendation,
    isShortlisted: submission.isShortlisted,
  };
};

export const computeStudentReportData = (
  submission: Submission
): StudentReportData => {
  const percentage = Math.round((submission.score / submission.totalMarks) * 100);
  
  // For mock data, since answers is Record<string, string>, we can't determine correct/wrong/unanswered
  // In real implementation, this would come from backend with Answer[] including isCorrect
  // For now, we'll estimate based on score and assume some distribution
  const totalQuestions = Object.keys(submission.answers).length;
  const estimatedCorrect = Math.round((submission.score / submission.totalMarks) * totalQuestions);
  const estimatedWrong = Math.round(totalQuestions * 0.2); // assume 20% wrong
  const unanswered = totalQuestions - estimatedCorrect - estimatedWrong;
  
  // In real implementation, calculate from answers:
  // const correct = answers.filter(a => a.isCorrect === true).length;
  // const wrong = answers.filter(a => a.isCorrect === false).length;
  // const unanswered = answers.filter(a => a.isCorrect === null || a.isCorrect === undefined).length;
  
  // Generate rule-based recommendation
  let recommendation = "";
  if (percentage < 50) {
    recommendation = "Low score detected. Focus on practicing more questions to improve your performance.";
  } else if (unanswered > totalQuestions * 0.5) {
    recommendation = "Many unanswered questions. Work on improving time management during exams.";
  } else if (estimatedWrong > totalQuestions * 0.5) {
    recommendation = "Many wrong answers. Consider revising key concepts and fundamentals.";
  } else if (percentage >= 80) {
    recommendation = "Excellent work! You performed very well. Try advanced practice questions to further enhance your skills.";
  } else {
    recommendation = "Good performance. Keep practicing to maintain and improve your results.";
  }
  
  return {
    candidateName: submission.candidateName,
    examName: submission.hackathonName,
    score: submission.score,
    totalMarks: submission.totalMarks,
    percentage,
    correct: estimatedCorrect,
    wrong: estimatedWrong,
    unanswered: unanswered,
    status: submission.status,
    submittedAt: submission.submittedAt,
    recommendation,
  };
};
