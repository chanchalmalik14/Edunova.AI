from google import genai
from google.genai import types
import os

from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_summary(text):

    prompt = f"""
    Summarize the following notes
    in simple student-friendly language:

    {text}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text


def generate_multimodal_summary(file_bytes: bytes, mime_type: str, user_prompt: str = ""):
    instructions = """
    You are Edunova.AI, a premium student learning assistant.
    Analyze the attached notes document/image and explain it in clear, structured, student-friendly language.
    If the user has asked a specific question, answer it directly using the file's context.
    """
    
    prompt = user_prompt if user_prompt else "Summarize these notes in simple, clear points."
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            types.Part.from_bytes(
                data=file_bytes,
                mime_type=mime_type
            ),
            f"{instructions}\n\nUser Question/Request: {prompt}"
        ]
    )
    return response.text