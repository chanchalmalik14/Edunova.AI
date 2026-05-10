from google import genai

import os

from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_quiz(text):

    prompt = f"""
    Generate 5 multiple choice questions
    from the following notes.

    Return ONLY valid JSON.

    Format:

    {{
      "title": "Quiz Title",
      "questions": [
        {{
          "question": "Question here",
          "options": [
            "Option1",
            "Option2",
            "Option3",
            "Option4"
          ],
          "correct_answer": "Correct option"
        }}
      ]
    }}

    Notes:
    {text}
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    return response.text