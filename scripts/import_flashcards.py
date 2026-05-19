import argparse
import json
import re
from pathlib import Path


SUBJECT_PATTERN = re.compile(r'^## \*\*(.+?)\*\*')
QUESTION_PATTERN = re.compile(r'^####\s*\*\*(\d+)\.\s*(?:(\S+)\s+)?(.+?)\*\*')
SEPARATOR_PATTERN = re.compile(r'^---')

MEMORIZE_ICON = '\U0001f4d8'


def slugify(name: str) -> str:
    return name.strip().lower().replace(' ', '_')


def make_id(subject_id: str, index: int) -> str:
    return f'{subject_id}-{index:02d}'


def parse_markdown(md_path: Path, teacher_id: str | None = None):
    lines = md_path.read_text(encoding='utf-8').splitlines()

    subjects = []
    flashcards_by_subject = {}
    current_subject = None

    i = 0
    while i < len(lines):
        line = lines[i]

        subject_match = SUBJECT_PATTERN.match(line)
        if subject_match:
            subject_name = subject_match.group(1).strip()
            subject_id = slugify(subject_name)
            current_subject = {
                'id': subject_id,
                'name': subject_name,
            }
            if teacher_id:
                current_subject['teacherId'] = teacher_id
            subjects.append(current_subject)
            flashcards_by_subject[subject_id] = []
            i += 1
            continue

        question_match = QUESTION_PATTERN.match(line)
        if question_match and current_subject:
            icon = question_match.group(2) or ''
            question_text = question_match.group(3).strip()
            question_type = 'memorize' if icon == MEMORIZE_ICON else 'understand'

            i += 1
            while i < len(lines) and not lines[i].strip():
                i += 1

            answer_lines = []
            while i < len(lines) and not SEPARATOR_PATTERN.match(lines[i]):
                answer_lines.append(lines[i])
                i += 1

            subject_id = current_subject['id']
            index = len(flashcards_by_subject[subject_id]) + 1
            flashcards_by_subject[subject_id].append({
                'id': make_id(subject_id, index),
                'subjectId': subject_id,
                'type': question_type,
                'question': question_text,
                'answer': '\n'.join(answer_lines).strip(),
            })
            continue

        i += 1

    if not subjects:
        raise ValueError(f'No subject headers found in {md_path}')

    return subjects, flashcards_by_subject


def write_flashcards(flashcards_by_subject, out_dir: Path) -> None:
    cards_dir = out_dir / 'flashcards'
    cards_dir.mkdir(parents=True, exist_ok=True)

    for subject_id, cards in flashcards_by_subject.items():
        file_path = cards_dir / f'{subject_id}.json'
        file_path.write_text(
            json.dumps(cards, ensure_ascii=False, indent=2) + '\n',
            encoding='utf-8',
        )
        print(f'Wrote {len(cards)} flashcards to {file_path}')


def update_subjects_json(subjects, category_id: str, out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    subjects_file = out_dir / 'subjects.json'

    if subjects_file.exists():
        existing = json.loads(subjects_file.read_text(encoding='utf-8'))
    else:
        existing = []

    existing_ids = {subject['id'] for subject in existing}
    for subject in subjects:
        if subject['id'] in existing_ids:
            continue

        entry = {
            'id': subject['id'],
            'name': subject['name'],
            'categoryId': category_id,
        }
        if 'teacherId' in subject:
            entry['teacherId'] = subject['teacherId']
        existing.append(entry)

    subjects_file.write_text(
        json.dumps(existing, ensure_ascii=False, indent=2) + '\n',
        encoding='utf-8',
    )
    print(f'Updated {subjects_file} with {len(subjects)} subjects')


def main() -> None:
    parser = argparse.ArgumentParser(description='Import source Markdown into flashcard JSON.')
    parser.add_argument('source', type=Path, help='Source Markdown file to parse')
    parser.add_argument('--category', choices=['maths', 'cs'], required=True)
    parser.add_argument('--teacher-id', default=None)
    parser.add_argument('--out-dir', type=Path, default=Path('out'))
    args = parser.parse_args()

    subjects, flashcards_by_subject = parse_markdown(args.source, args.teacher_id)
    write_flashcards(flashcards_by_subject, args.out_dir)
    update_subjects_json(subjects, args.category, args.out_dir)


if __name__ == '__main__':
    main()
