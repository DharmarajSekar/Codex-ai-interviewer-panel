from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

from interview_ai.models.types import CandidateProfile, Difficulty, InterviewContext
from interview_ai.prompts.templates import FOLLOWUP_SYSTEM_PROMPT, QUESTION_SYSTEM_PROMPT, RESUME_AWARE_PROMPT


class PromptOrchestrator:
    def __init__(self, llm) -> None:
        self.llm = llm
        self.parser = StrOutputParser()

    def generate_dynamic_question(
        self,
        profile: CandidateProfile,
        context: InterviewContext,
        difficulty: Difficulty,
        retrieved_memory: str,
    ) -> str:
        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", QUESTION_SYSTEM_PROMPT),
                (
                    "human",
                    "Resume context:\n{resume_context}\n\nMemory:\n{memory}\n\nRecent answers:\n{answers}",
                ),
            ]
        )
        chain = prompt | self.llm | self.parser
        return chain.invoke(
            {
                "difficulty": difficulty.value,
                "target_role": profile.target_role,
                "topic": context.current_topic,
                "resume_context": profile.resume_text,
                "memory": retrieved_memory,
                "answers": "\n".join(context.candidate_answers[-3:]),
            }
        )

    def generate_follow_up(self, candidate_answer: str, weaknesses: str) -> str:
        prompt = ChatPromptTemplate.from_messages(
            [("system", FOLLOWUP_SYSTEM_PROMPT), ("human", "Answer:\n{answer}\nGaps:\n{gaps}")]
        )
        return (prompt | self.llm | self.parser).invoke({"answer": candidate_answer, "gaps": weaknesses})

    def generate_resume_aware_seed_questions(self, profile: CandidateProfile) -> str:
        prompt = ChatPromptTemplate.from_messages(
            [("system", RESUME_AWARE_PROMPT), ("human", "Resume:\n{resume}\nRole:\n{role}")]
        )
        return (prompt | self.llm | self.parser).invoke({"resume": profile.resume_text, "role": profile.target_role})
