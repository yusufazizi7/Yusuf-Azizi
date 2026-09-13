from pathlib import Path
import re
import html


# ============================================================
# SETTINGS
# ============================================================

REMOVE_CONSECUTIVE_DUPLICATE_VERSES = True


# ============================================================
# HELPERS
# ============================================================

def contains_arabic(text: str) -> bool:
    return bool(re.search(
        r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF"
        r"\uFB50-\uFDFF\uFE70-\uFEFF]",
        text
    ))


def clean_text(text: str) -> str:
    return " ".join(text.strip().split())


def read_after_effects_layers(text: str) -> list[str]:
    layers = []

    for raw_line in text.splitlines():
        stripped = raw_line.strip()

        if stripped.startswith("Layer:"):
            value = stripped[len("Layer:"):].strip()

            if not value:
                continue

            value = clean_text(value)

            # Ignore layers containing only digits:
            # 1, 2, 15, 123456, etc.
            if value.isdigit():
                continue

            layers.append(value)

    return layers


def build_verses(layers: list[str]):
    english_lines = []
    arabic_lines = []

    for line in layers:
        if contains_arabic(line):
            arabic_lines.append(line)
        else:
            english_lines.append(line)

    if len(arabic_lines) % 2 != 0:
        raise ValueError(
            f"Found {len(arabic_lines)} Arabic lines. "
            "The number must be even because every verse needs two Arabic halves."
        )

    if len(english_lines) % 2 != 0:
        raise ValueError(
            f"Found {len(english_lines)} English lines. "
            "The number must be even because every verse needs two English halves."
        )

    arabic_verses = [
        (arabic_lines[i], arabic_lines[i + 1])
        for i in range(0, len(arabic_lines), 2)
    ]

    english_verses = [
        (english_lines[i], english_lines[i + 1])
        for i in range(0, len(english_lines), 2)
    ]

    if len(arabic_verses) != len(english_verses):
        raise ValueError(
            "The number of Arabic and English verses does not match.\n"
            f"Arabic verses: {len(arabic_verses)}\n"
            f"English verses: {len(english_verses)}"
        )

    verses = []

    for arabic, english in zip(arabic_verses, english_verses):
        verse = {
            "arabic_1": arabic[0],
            "arabic_2": arabic[1],
            "english_1": english[0],
            "english_2": english[1],
        }

        if (
            REMOVE_CONSECUTIVE_DUPLICATE_VERSES
            and verses
            and verse == verses[-1]
        ):
            continue

        verses.append(verse)

    return verses


def verse_to_html(verse: dict) -> str:
    arabic_1 = html.escape(verse["arabic_1"], quote=False)
    arabic_2 = html.escape(verse["arabic_2"], quote=False)
    english_1 = html.escape(verse["english_1"], quote=False)
    english_2 = html.escape(verse["english_2"], quote=False)

    return (
        '                    <li class="poem-verse">\n'
        f'                        <p class="arabic-text">{arabic_1} * {arabic_2}</p>\n'
        f'                        <p class="eng-translation">{english_1} <br>\n'
        f'                            {english_2}</p>\n'
        '                    </li>'
    )


def generate_html(input_file: Path) -> tuple[str, int]:
    source = input_file.read_text(encoding="utf-8-sig")

    layers = read_after_effects_layers(source)

    if not layers:
        raise ValueError(
            "No lines beginning with 'Layer:' were found in the text file."
        )

    verses = build_verses(layers)

    result = "\n\n".join(
        verse_to_html(verse)
        for verse in verses
    )

    return result, len(verses)


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    print("Islamic Qalam - AE Text to Poem HTML")
    print("------------------------------------")
    print()

    raw_path = input("Text file path: ").strip().strip('"')
    input_file = Path(raw_path)

    if not input_file.exists():
        print()
        print(f"ERROR: File not found: {input_file}")
        raise SystemExit(1)

    output_file = input_file.with_name(
        input_file.stem + "-poem-verses.html"
    )

    try:
        output_html, verse_count = generate_html(input_file)

        output_file.write_text(
            output_html,
            encoding="utf-8"
        )

        print()
        print(f"Created {verse_count} verses.")
        print(f"Output: {output_file.resolve()}")

    except Exception as error:
        print()
        print(f"ERROR: {error}")
        raise SystemExit(1)
