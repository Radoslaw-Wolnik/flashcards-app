import argparse
import json
import re
from pathlib import Path


def clean_math_and_lists(answer: str) -> str:
    answer = re.sub(r'\\\[\s*(.*?)\s*\\\]', r'$$\1$$', answer, flags=re.DOTALL)
    answer = re.sub(r'\\\(\s*(.*?)\s*\\\)', r'$\1$', answer)
    answer = re.sub(r'\(\(\s*(.*?)\s*\)\)', r'$\1$', answer)
    answer = re.sub(r'(?m)^\*\*(.+?)\*\*:', r'**\1**  \n', answer)
    answer = re.sub(r'(?m)([^\n])\n\s*-\s+', r'\1\n\n- ', answer)
    return answer


def clean_json_file(input_path: Path, output_path: Path) -> None:
    cards = json.loads(input_path.read_text(encoding='utf-8'))
    for card in cards:
        if 'answer' in card:
            card['answer'] = clean_math_and_lists(card['answer'])

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(cards, ensure_ascii=False, indent=2) + '\n',
        encoding='utf-8',
    )


def clean_directory(input_dir: Path, output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    for file in sorted(input_dir.glob('*.json')):
        out_file = output_dir / file.name
        print(f'Cleaning {file.name} -> {out_file}')
        clean_json_file(file, out_file)


def main() -> None:
    parser = argparse.ArgumentParser(description='Normalize markdown and math in flashcard JSON files.')
    parser.add_argument('--input-dir', type=Path, default=Path('out/flashcards'))
    parser.add_argument('--output-dir', type=Path, default=Path('out/cleaned'))
    args = parser.parse_args()

    clean_directory(args.input_dir, args.output_dir)


if __name__ == '__main__':
    main()
