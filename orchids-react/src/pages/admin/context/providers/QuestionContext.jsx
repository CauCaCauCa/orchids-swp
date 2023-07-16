import React, { createContext } from 'react';
import usePage from '../../hooks/usePage';
import useFetch from '../../hooks/useFetch';
import { FetchQuestionsByPage, GetQuestionsStats } from '../../../../api/adminAPI';

export const QuestionContext = createContext();

export default function QuestionContextProvider({ children }) {
    const AllQuestions = usePage(FetchQuestionsByPage);
    const QuestionStats = useFetch(GetQuestionsStats);

    return (
        <QuestionContext.Provider
            value={{
                AllQuestions: {
                    questions: AllQuestions.list,
                    setQuestions: AllQuestions.setList,
                    changePageQuestions: AllQuestions.changePage,
                    totalQuestions: AllQuestions.total,
                    isLoadingQuestions: AllQuestions.isLoading
                },
                stats: {
                    questionStats: QuestionStats.data,
                    isLoadingQuestionStats: QuestionStats.isLoading
                }
            }}
        >
            {children}
        </QuestionContext.Provider>
    );
}
