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
    """
    Reads only lines beginning with 'Layer:'.

    This automatically ignores the duplicated copy
    underneath each After Effects layer.
    """

    layers = []

    for raw_line in text.splitlines():

        stripped = raw_line.strip()

        if not stripped.startswith("Layer:"):
            continue

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
    """
    One Arabic line + one English line = one verse.
    """

    english_lines = []
    arabic_lines = []

    for line in layers:

        if contains_arabic(line):
            arabic_lines.append(line)

        else:
            english_lines.append(line)


    # Make sure both languages contain the same number of lines
    if len(arabic_lines) != len(english_lines):

        raise ValueError(
            "The number of Arabic and English lines does not match.\n"
            f"Arabic lines: {len(arabic_lines)}\n"
            f"English lines: {len(english_lines)}"
        )


    verses = []


    for arabic, english in zip(
        arabic_lines,
        english_lines
    ):

        verse = {
            "arabic": arabic,
            "english": english
        }


        # Ignore immediately duplicated complete verses
        if (
            REMOVE_CONSECUTIVE_DUPLICATE_VERSES
            and verses
            and verse == verses[-1]
        ):
            continue


        verses.append(verse)


    return verses


def verse_to_html(verse: dict) -> str:

    arabic_text = html.escape(
        verse["arabic"],
        quote=False
    )

    english_text = html.escape(
        verse["english"],
        quote=False
    )


    return (
        '                    <li class="poem-verse">\n'
        f'                        <p class="arabic-text">{arabic_text}</p>\n'
        f'                        <p class="eng-translation">{english_text}</p>\n'
        '                    </li>'
    )


def generate_html(
    input_file: Path
) -> tuple[str, int]:

    source = input_file.read_text(
        encoding="utf-8-sig"
    )


    layers = read_after_effects_layers(
        source
    )


    if not layers:

        raise ValueError(
            "No lines beginning with 'Layer:' "
            "were found in the text file."
        )


    verses = build_verses(
        layers
    )


    result = "\n\n".join(
        verse_to_html(verse)
        for verse in verses
    )


    return result, len(verses)


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":

    print(
        "Islamic Qalam - AE Text to Poem HTML"
    )

    print(
        "------------------------------------"
    )

    print()


    raw_path = input(
        "Text file path: "
    ).strip().strip('"')


    input_file = Path(
        raw_path
    )


    if not input_file.exists():

        print()

        print(
            f"ERROR: File not found: "
            f"{input_file}"
        )

        raise SystemExit(1)


    output_file = input_file.with_name(
        input_file.stem
        + "-poem-verses.html"
    )


    try:

        output_html, verse_count = (
            generate_html(
                input_file
            )
        )


        output_file.write_text(
            output_html,
            encoding="utf-8"
        )


        print()

        print(
            f"Created {verse_count} verses."
        )

        print(
            f"Output: "
            f"{output_file.resolve()}"
        )


    except Exception as error:

        print()

        print(
            f"ERROR: {error}"
        )

        raise SystemExit(1)