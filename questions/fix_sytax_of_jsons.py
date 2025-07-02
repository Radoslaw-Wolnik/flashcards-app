import os
import json
import re
from pathlib import Path

def clean_math_and_lists(answer: str) -> str:
    # Convert block math delimiters \[...\] to $$...$$
    answer = re.sub(r'\\\[\s*(.*?)\s*\\\]', r'$$\1$$', answer, flags=re.DOTALL)
    # Convert inline math delimiters \(..\) to $...$
    answer = re.sub(r'\\\(\s*(.*?)\s*\\\)', r'$\1$', answer)
    # Convert double parentheses ((...)) to $...$ as fallback
    answer = re.sub(r'\(\(\s*(.*?)\s*\)\)', r'$\1$', answer)
    # Ensure bold headings end with two spaces + newline
    answer = re.sub(r'(?m)^\*\*(.+?)\*\*:', r'**\1**  \n', answer)
    # Add blank line before list items
    answer = re.sub(r'(?m)([^\n])\n\s*-\s+', r'\1\n\n- ', answer)
    return answer

def clean_json_file(input_path: Path, output_path: Path):
    cards = json.loads(input_path.read_text(encoding='utf-8'))
    for card in cards:
        if 'answer' in card:
            card['answer'] = clean_math_and_lists(card['answer'])
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(cards, ensure_ascii=False, indent=2), encoding='utf-8')

def clean_directory(input_dir: Path, output_dir: Path):
    output_dir.mkdir(parents=True, exist_ok=True)
    for file in input_dir.glob('*.json'):
        out_file = output_dir / file.name
        print(f"Cleaning {file.name} → {out_file}")
        clean_json_file(file, out_file)

if __name__ == "__main__":
    input_dir = "out/flashcards"
    output_dir = "out/cleaned"

    clean_directory(Path(input_dir), Path(output_dir))
