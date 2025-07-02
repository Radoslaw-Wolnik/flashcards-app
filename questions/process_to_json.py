import os
import re
import json
import random

# Patterns to match subjects, questions, and separators
subject_pattern = re.compile(r'^## \*\*(.+?)\*\*')
question_pattern = re.compile(r'^####\s*\*\*(\d+)\.\s*\[(.*?)\]\s*(.*?)\*\*')
separator_pattern = re.compile(r'^---')

# Helper to slugify names
def slugify(name):
    return name.strip().lower().replace(' ', '_')

# Generate flashcard ID: first two letters of subjectId + two-digit counter
def make_id(subject_id, idx):
    prefix = subject_id[:2]
    return f"{prefix}{str(idx).zfill(2)}"


def parse_markdown(md_path):
    lines = []
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = [line.rstrip('\n') for line in f]

    subjects = []
    flashcards_by_subject = {}
    current_subject = None
    teacher_id = random.choice(['A', 'B', 'C'])

    i = 0
    while i < len(lines):
        line = lines[i]
        # Subject header
        m_sub = subject_pattern.match(line)
        if m_sub:
            subj_name = m_sub.group(1).strip()
            subj_id = slugify(subj_name)
            current_subject = {'id': subj_id, 'name': subj_name, 'teacherId': teacher_id}
            subjects.append(current_subject)
            flashcards_by_subject[subj_id] = []
            i += 1
            continue

        # Question line
        m_q = question_pattern.match(line)
        if m_q and current_subject:
            q_num = m_q.group(1)
            icon = m_q.group(2)
            question_text = m_q.group(3).strip()
            q_type = 'memorize' if '📘' in icon else 'understand'

            # Move past question line
            i += 1
            # Skip any blank lines
            while i < len(lines) and not lines[i].strip():
                i += 1

            # Collect answer until separator
            answer_lines = []
            while i < len(lines) and not separator_pattern.match(lines[i]):
                answer_lines.append(lines[i])
                i += 1
            answer_text = '\n'.join(answer_lines).strip()

            # assign ID based on count
            subj_id = current_subject['id']
            idx = len(flashcards_by_subject[subj_id]) + 1
            card_id = make_id(subj_id, idx)

            card = {
                'id': card_id,
                'subjectId': subj_id,
                'type': q_type,
                'question': question_text,
                'answer': answer_text
            }
            flashcards_by_subject[subj_id].append(card)
            continue

        i += 1

    if not subjects:
        raise ValueError('No subject header found in markdown file.')

    return subjects, flashcards_by_subject


def write_flashcards(flashcards_by_subject, out_dir):
    cards_dir = os.path.join(out_dir, 'flashcards')
    os.makedirs(cards_dir, exist_ok=True)
    for subj_id, cards in flashcards_by_subject.items():
        file_path = os.path.join(cards_dir, f"{subj_id}.json")
        with open(file_path, 'w', encoding='utf-8') as f:
            # f.write('export interface Flashcard {\n')
            # f.write('  id: string;\n')
            # f.write('  subjectId: string;\n')
            # f.write("  type: 'memorize' | 'understand';\n")
            # f.write('  question: string;\n')
            # f.write('  answer: string;\n')
            # f.write('}\n\n')
            # f.write('export const flashcards: Flashcard[] = ')
            json.dump(cards, f, ensure_ascii=False, indent=2)
            f.write('\n')
        print(f"Wrote {len(cards)} flashcards to {file_path}")


def update_subjects_json(subjects, category_id, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    subj_file = os.path.join(out_dir, 'subjects.json')
    try:
        with open(subj_file, 'r', encoding='utf-8') as f:
            existing = json.load(f)
    except FileNotFoundError:
        existing = []

    existing_ids = {s['id'] for s in existing}
    for s in subjects:
        if s['id'] not in existing_ids:
            existing.append({'id': s['id'], 'name': s['name'], 'categoryId': category_id, 'teacherId': s['teacherId']})
    with open(subj_file, 'w', encoding='utf-8') as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)
    print(f"Updated subjects.json with {len(subjects)} subjects")


if __name__ == '__main__':
    md_file = 'Maths.md' # ComputerScience.md
    out = 'out'
    category = 'maths' # cs
    subjects, flashcards_by_subject = parse_markdown(md_file)
    write_flashcards(flashcards_by_subject, out)
    update_subjects_json(subjects, category, out)
