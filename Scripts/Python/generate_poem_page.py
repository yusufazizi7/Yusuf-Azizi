from pathlib import Path
import re
import unicodedata


# ============================================================
# SETTINGS
# ============================================================

# Put this script in the same folder as your website and set
# this to the poem page you want to use as the master template.
TEMPLATE_FILE = Path("laamiyah-ibn-taymiyyah.html")

# New poem pages will be created in the same folder.
OUTPUT_FOLDER = Path(".")


# ============================================================
# HELPERS
# ============================================================

def slugify(text: str) -> str:
    """
    Convert:
        Ra'iyyah Ibn Rajab
    into:
        raiyyah-ibn-rajab
    """

    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")

    text = text.lower().strip()

    # Remove apostrophes completely so they do NOT become hyphens
    text = text.replace("'", "")
    text = text.replace("’", "")

    # Everything else separating words becomes a hyphen
    text = re.sub(r"[^a-z0-9]+", "-", text)

    return text.strip("-")


def replace_once(pattern: str, replacement: str, html: str, label: str) -> str:
    new_html, count = re.subn(
        pattern,
        replacement,
        html,
        count=1,
        flags=re.DOTALL,
    )

    if count != 1:
        raise ValueError(f"Could not find {label} in the template.")

    return new_html


# ============================================================
# GENERATOR
# ============================================================

def generate_poem_page(poem_name: str) -> Path:
    if not TEMPLATE_FILE.exists():
        raise FileNotFoundError(
            f"Template not found: {TEMPLATE_FILE.resolve()}\n"
            "Change TEMPLATE_FILE at the top of the script to your actual template filename."
        )

    poem_name = poem_name.strip()

    if not poem_name:
        raise ValueError("Poem name cannot be empty.")

    slug = slugify(poem_name)

    if not slug:
        raise ValueError(
            "Could not create a URL slug from that poem name. "
            "Use an English/transliterated poem name."
        )

    output_file = OUTPUT_FOLDER / f"{slug}.html"

    if output_file.exists():
        raise FileExistsError(
            f"{output_file} already exists. "
            "Rename/delete it first so it is not overwritten accidentally."
        )

    html = TEMPLATE_FILE.read_text(encoding="utf-8")

    description = (
        f"Read {poem_name} with English translation on Islamic Qalam. "
        "Explore Islamic poetry with Arabic text and its meaning."
    )

    keywords = (
        f"Islam, {poem_name}, Arabic poetry, Islamic poems, Islamic Qalam"
    )

    canonical_url = f"https://www.islamicqalam.com/{slug}.html"

    # --------------------------------------------------------
    # HEAD / SEO
    # --------------------------------------------------------

    html = replace_once(
        r'(<meta\s+name="description"\s*\n?\s*content=")[^"]*(">)',
        rf'\g<1>{description}\g<2>',
        html,
        "meta description",
    )

    html = replace_once(
        r'(<meta\s+name="keywords"\s+content=")[^"]*(">)',
        rf'\g<1>{keywords}\g<2>',
        html,
        "meta keywords",
    )

    html = replace_once(
        r'(<link\s+rel="canonical"\s+href=")[^"]*(">)',
        rf'\g<1>{canonical_url}\g<2>',
        html,
        "canonical URL",
    )

    html = replace_once(
        r"<title>.*?</title>",
        f"<title>{poem_name} - Islamic Qalam</title>",
        html,
        "page title",
    )

    # --------------------------------------------------------
    # JSON-LD
    # --------------------------------------------------------

    json_ld_match = re.search(
        r'(<script type="application/ld\+json">)(.*?)(</script>)',
        html,
        flags=re.DOTALL,
    )

    if not json_ld_match:
        raise ValueError("Could not find the JSON-LD block in the template.")

    json_ld = json_ld_match.group(2)

    json_ld = re.sub(
        r'("name"\s*:\s*")[^"]*(")',
        rf'\g<1>{poem_name}\g<2>',
        json_ld,
        count=1,
    )

    json_ld = re.sub(
        r'("url"\s*:\s*")[^"]*(")',
        rf'\g<1>{canonical_url}\g<2>',
        json_ld,
        count=1,
    )

    json_ld = re.sub(
        r'("description"\s*:\s*")[^"]*(")',
        rf'\g<1>{description}\g<2>',
        json_ld,
        count=1,
    )

    json_ld = re.sub(
        r'"keywords"\s*:\s*\[[^\]]*\]',
        (
            '"keywords": ['
            f'"Islam", "{poem_name}", "Arabic poetry", '
            '"Islamic poems", "Islamic Qalam"]'
        ),
        json_ld,
        count=1,
        flags=re.DOTALL,
    )

    html = (
        html[:json_ld_match.start(2)]
        + json_ld
        + html[json_ld_match.end(2):]
    )

    # --------------------------------------------------------
    # POEM-SPECIFIC PAGE VALUES
    # --------------------------------------------------------

    html = replace_once(
        r'(<main\s+class="poem-page"\s+data-page-id=")[^"]*(">)',
        rf'\g<1>{slug}\g<2>',
        html,
        "poem data-page-id",
    )

    html = replace_once(
        r'(<span\s+class="sr-only">\s*).*?(\s*</span>)',
        rf'\g<1>{poem_name}\g<2>',
        html,
        "screen-reader poem title",
    )

    # Your current template uses the text inside this custom
    # <icon> tag as the SVG/title key. We default it to the slug.
    html = replace_once(
        r'(<icon\s+class="poem-title-svg">\s*).*?(\s*</icon>)',
        rf'\g<1>{slug}\g<2>',
        html,
        "poem title SVG key",
    )

    # --------------------------------------------------------
    # EMPTY VERSES
    # --------------------------------------------------------

    empty_verse_container = '''<ol class="poem-container">
                    <li class="poem-verse">
                        <p class="arabic-text"></p>
                        <p class="eng-translation"></p>
                    </li>
                </ol>'''

    html = replace_once(
        r'<ol\s+class="poem-container">.*?</ol>',
        empty_verse_container,
        html,
        "poem verse container",
    )

    # --------------------------------------------------------
    # SAVE
    # --------------------------------------------------------

    OUTPUT_FOLDER.mkdir(parents=True, exist_ok=True)
    output_file.write_text(html, encoding="utf-8")

    return output_file


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    print("Islamic Qalam - Poem Page Generator")
    print("-----------------------------------")

    name = input("Poem name: ").strip()

    try:
        created_file = generate_poem_page(name)

        print()
        print("Page created successfully:")
        print(created_file.resolve())

    except Exception as error:
        print()
        print(f"Error: {error}")
