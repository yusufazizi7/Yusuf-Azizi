from pathlib import Path
import re
import shutil
from collections import Counter


# ============================================================
# FILE LOCATIONS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

HTML_FILE = BASE_DIR / "Al-Baqarah.html"

BACKUP_FILE = BASE_DIR / "Al-Baqarah.before-redesign.html"

CSS_FILE = (
    BASE_DIR
    / ".."
    / ".."
    / "CSS"
    / "quran-page.css"
).resolve()


# ============================================================
# SAFETY CHECKS
# ============================================================

if not HTML_FILE.exists():
    raise FileNotFoundError(
        f"Could not find:\n{HTML_FILE}\n\n"
        "Put this Python script in the same folder "
        "as Al-Baqarah.html."
    )


html = HTML_FILE.read_text(
    encoding="utf-8"
)


# Prevent accidental second conversion
if (
    'class="surah-page"' in html
    and
    'class="surah-hero"' in html
):
    raise SystemExit(
        "Al-Baqarah.html already appears to use "
        "the new Qur'an page design."
    )


# ============================================================
# BACKUP ORIGINAL FILE
# ============================================================

if not BACKUP_FILE.exists():

    shutil.copy2(
        HTML_FILE,
        BACKUP_FILE
    )

    print(
        f"Backup created:\n"
        f"{BACKUP_FILE}\n"
    )

else:

    print(
        "Backup already exists, so it was not overwritten:\n"
        f"{BACKUP_FILE}\n"
    )


# ============================================================
# EXTRACT CURRENT QUR'AN CONTAINER
# ============================================================

container_match = re.search(
    r'<section\s+class="quran-container"\s*>'
    r'(.*?)'
    r'</section>',
    html,
    flags=re.DOTALL | re.IGNORECASE
)


if not container_match:
    raise RuntimeError(
        "Could not find <section class=\"quran-container\">."
    )


container_html = container_match.group(1)


# ============================================================
# EXTRACT EXISTING AYAH BLOCKS
# ============================================================

ayah_matches = re.findall(
    r'<div\s+class="ayah-block"\s*>'
    r'(.*?)'
    r'</div>',
    container_html,
    flags=re.DOTALL | re.IGNORECASE
)


if not ayah_matches:
    raise RuntimeError(
        "No .ayah-block elements were found."
    )


print(
    f"Found {len(ayah_matches)} existing ayah blocks."
)


# ============================================================
# HELPERS
# ============================================================

def clean_text_content(value):
    """
    Collapse indentation/newlines without changing
    Arabic letters, harakat, Qur'anic symbols or numerals.
    """

    return re.sub(
        r"\s+",
        " ",
        value
    ).strip()


def arabic_number_to_int(value):
    """
    Convert:
        ١٢٣
    to:
        123
    """

    translation_table = str.maketrans(
        "٠١٢٣٤٥٦٧٨٩",
        "0123456789"
    )

    return int(
        value.translate(
            translation_table
        )
    )


# ============================================================
# READ EACH AYAH
# ============================================================

new_ayah_blocks = []

detected_numbers = []

blocks_with_multiple_numbers = []


for block_index, block in enumerate(
    ayah_matches,
    start=1
):

    # --------------------------------------------------------
    # Arabic
    # --------------------------------------------------------

    arabic_match = re.search(
        r'<p\s+class="arabic-text"\s*>'
        r'(.*?)'
        r'</p>',
        block,
        flags=re.DOTALL | re.IGNORECASE
    )


    if not arabic_match:

        print(
            f"WARNING: ayah block {block_index} "
            "does not contain .arabic-text."
        )

        continue


    arabic_text = clean_text_content(
        arabic_match.group(1)
    )


    # --------------------------------------------------------
    # Translation
    # --------------------------------------------------------

    translation_match = re.search(
        r'<p\s+class="translation-text"\s*>'
        r'(.*?)'
        r'</p>',
        block,
        flags=re.DOTALL | re.IGNORECASE
    )


    if translation_match:

        translation_text = clean_text_content(
            translation_match.group(1)
        )

    else:

        translation_text = ""


    # --------------------------------------------------------
    # Detect Qur'anic Arabic verse numbers
    # --------------------------------------------------------

    number_strings = re.findall(
        r'[٠-٩]+',
        arabic_text
    )


    numbers_in_block = [
        arabic_number_to_int(number)
        for number in number_strings
    ]


    detected_numbers.extend(
        numbers_in_block
    )


    if len(numbers_in_block) > 1:

        blocks_with_multiple_numbers.append(
            (
                block_index,
                numbers_in_block
            )
        )


    # --------------------------------------------------------
    # Build new ayah block
    #
    # IMPORTANT:
    # We DO NOT create a separate verse-number element.
    #
    # The Arabic numeral stays in the Qur'an text so your
    # Quran-Hafs font can render it as the Qur'anic ayah symbol.
    # --------------------------------------------------------

    new_block = f'''
                <article class="ayah-block">

                    <p
                        class="arabic-text"
                        lang="ar"
                        dir="rtl">
                        {arabic_text}
                    </p>

                    <p class="translation-text">{translation_text}</p>

                </article>
'''.rstrip()


    new_ayah_blocks.append(
        new_block
    )


# ============================================================
# SOURCE CONTENT CHECK
# ============================================================

number_counts = Counter(
    detected_numbers
)


duplicate_numbers = sorted(
    number
    for number, count
    in number_counts.items()
    if count > 1
)


missing_numbers = [
    number
    for number in range(1, 287)
    if number not in number_counts
]


print()
print("Qur'an text check:")
print("-------------------")


if blocks_with_multiple_numbers:

    print(
        "Blocks containing more than one Arabic "
        "verse number:"
    )

    for block_number, numbers in blocks_with_multiple_numbers:

        print(
            f"  Block {block_number}: "
            f"{numbers}"
        )

else:

    print(
        "No blocks containing multiple "
        "verse numbers detected."
    )


if duplicate_numbers:

    print(
        "Duplicate verse numbers detected:",
        duplicate_numbers
    )

else:

    print(
        "No duplicate verse numbers detected."
    )


if missing_numbers:

    print(
        "Missing verse numbers detected:",
        missing_numbers
    )

else:

    print(
        "All verse numbers 1–286 were detected."
    )


print(
    "\nIMPORTANT: The script does NOT alter "
    "or correct the Qur'an text."
)


# ============================================================
# JOIN ALL AYAH BLOCKS
# ============================================================

all_ayahs_html = "\n\n".join(
    new_ayah_blocks
)


# ============================================================
# NEW AL-BAQARAH HTML
# ============================================================

new_html = '''<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <meta
        name="description"
        content="Read Surah Al-Baqarah from the Qur'an in Arabic on Islamic Qalam.">

    <meta
        name="keywords"
        content="Quran, Qur'an, Al-Baqarah, Surah Al-Baqarah, Surah 2, Islamic Qalam, Hafs">

    <meta
        name="author"
        content="Mohammad Yusuf Azizi">

    <link
        rel="canonical"
        href="https://www.islamicqalam.com/Quran/Hafs/Al-Baqarah.html">


    <title>
        Surah Al-Baqarah - Islamic Qalam
    </title>


    <!-- JSON-LD Structured Data -->

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Surah Al-Baqarah",
        "url": "https://www.islamicqalam.com/Quran/Hafs/Al-Baqarah.html",
        "author": {
            "@type": "Person",
            "name": "Mohammad Yusuf Azizi"
        },
        "description": "Read Surah Al-Baqarah from the Qur'an in Arabic on Islamic Qalam.",
        "keywords": [
            "Quran",
            "Qur'an",
            "Al-Baqarah",
            "Surah Al-Baqarah",
            "Surah 2",
            "Islamic Qalam",
            "Hafs"
        ]
    }
    </script>


    <!-- Stylesheets -->

    <link
        rel="stylesheet"
        href="/CSS/global.css">

    <link
        rel="stylesheet"
        href="/CSS/quran-page.css">

    <link
        rel="stylesheet"
        href="/CSS/QiraatVariations.css">


    <link
        rel="icon"
        type="image/png"
        href="/Images/website-favicon.png">


    <!-- FontAwesome -->

    <script
        src="https://kit.fontawesome.com/50f622582e.js"
        crossorigin="anonymous">
    </script>

</head>


<body class="qiraah-hafs">


    <a
        class="skip-link"
        href="#main-content">

        Skip to content

    </a>


    <!-- =====================================================
         NAVBAR
         ===================================================== -->

    <header class="site-header">


        <div class="brand">

            <object
                class="website-logo"
                data="/Images/Website-logo.svg"
                type="image/svg+xml"
                aria-label="Islamic Qalam logo">
            </object>


            <span class="brand-name">
                Islamic Qalam
            </span>

        </div>


        <nav
            id="primary-navigation"
            class="navbar"
            aria-label="Main navigation">


            <a href="/index.html#poetry-library">
                Poetry
            </a>


            <a
                href="/quran.html"
                class="active"
                aria-current="page">

                Qur'an

            </a>


            <a href="/videos.html">
                Videos
            </a>


            <a href="/e-books.html">
                E-books
            </a>


            <a href="/contact-us.html">
                Contact
            </a>


            <a
                class="nav-donate"
                href="https://buy.stripe.com/6oE3eY8xJ0ZM5Nu7sv"
                target="_blank"
                rel="noopener noreferrer">

                Donate

            </a>


            <a
                id="navAccountLink"
                class="nav-login"
                href="/login.html">

                <i
                    class="fa-solid fa-right-to-bracket"
                    aria-hidden="true">
                </i>

                <span id="navAccountText">
                    Login
                </span>

            </a>


        </nav>


        <button
            id="menu-bars"
            class="menu-toggle"
            type="button"
            aria-label="Open navigation menu"
            aria-controls="primary-navigation"
            aria-expanded="false">

            <i
                class="fa-solid fa-bars"
                aria-hidden="true">
            </i>

        </button>


    </header>


    <!-- =====================================================
         DONATION POPUP
         ===================================================== -->

    <div
        id="donationPopup"
        class="popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="donation-title"
        aria-hidden="true">


        <div class="popup-content">


            <button
                class="close-btn"
                type="button"
                aria-label="Close donation message">

                &times;

            </button>


            <span
                class="popup-icon"
                aria-hidden="true">

                <i class="fa-solid fa-heart"></i>

            </span>


            <h2 id="donation-title">
                Support Islamic Qalam
            </h2>


            <p>
                Islamic Qalam is maintained independently.
                A small donation helps cover website costs
                and supports the creation of more translations
                and beneficial resources.
            </p>


            <div class="popup-actions">

                <button
                    id="donateButton"
                    type="button">

                    Donate

                </button>


                <button
                    id="cancelButton"
                    type="button">

                    Maybe later

                </button>

            </div>


        </div>

    </div>


    <!-- =====================================================
         SURAH PAGE
         ===================================================== -->

    <main
        id="main-content"
        class="surah-page">


        <!-- =================================================
             HERO
             ================================================= -->

        <section class="surah-hero">


            <div class="surah-hero-inner">


                <div class="surah-hero-copy">


                    <p class="surah-eyebrow">
                        The Noble Qur'an
                    </p>


                    <h1>
                        Surah Al-Baqarah
                    </h1>


                    <p class="surah-hero-description">

                        Read the Arabic text of Al-Baqarah
                        in a clean and carefully presented
                        Qur'an reader.

                    </p>


                    <div
                        class="surah-meta"
                        aria-label="Surah information">


                        <span>

                            <i
                                class="fa-regular fa-file-lines"
                                aria-hidden="true">
                            </i>

                            Surah 2

                        </span>


                        <span>

                            <i
                                class="fa-solid fa-list-ol"
                                aria-hidden="true">
                            </i>

                            286 Ayahs

                        </span>


                        <span>

                            <i
                                class="fa-solid fa-book-open"
                                aria-hidden="true">
                            </i>

                            Hafs

                        </span>


                    </div>


                </div>


                <div
                    class="surah-hero-art"
                    aria-hidden="true">


                    <div class="surah-hero-art-frame">


                        <span class="surah-arabic-title">
                            البقرة
                        </span>


                        <span class="surah-arabic-subtitle">
                            سورة البقرة
                        </span>


                    </div>


                </div>


            </div>


        </section>


        <!-- =================================================
             READING SECTION
             ================================================= -->

        <section class="surah-reading-section">


            <!-- TOP NAVIGATION -->

            <nav
                class="surah-navigation"
                aria-label="Surah navigation">


                <a
                    class="surah-nav-button secondary"
                    href="/Quran/Hafs/Al-Fatihah.html">

                    <i
                        class="fa-solid fa-arrow-left"
                        aria-hidden="true">
                    </i>

                    Al-Fatihah

                </a>


                <span
                    class="surah-nav-button disabled"
                    aria-disabled="true">

                    Aal-E-Imran

                    <i
                        class="fa-solid fa-arrow-right"
                        aria-hidden="true">
                    </i>

                </span>


            </nav>


            <!-- READING CARD -->

            <div class="surah-reading-card">


                <div class="surah-reading-header">


                    <div>

                        <span class="surah-reading-label">
                            Arabic Text
                        </span>

                        <p>
                            Surah Al-Baqarah · 286 Ayahs · Hafs
                        </p>

                    </div>


                    <span
                        class="surah-reading-icon"
                        aria-hidden="true">

                        <i class="fa-solid fa-book-quran"></i>

                    </span>


                </div>


                <!-- BISMILLAH -->

                <div
                    class="surah-bismillah"
                    lang="ar"
                    dir="rtl">

                    ﷽

                </div>


                <!-- ================================
                     AYAH 1–286
                     ================================ -->

__AYAHS__


            </div>


            <!-- BOTTOM NAVIGATION -->

            <nav
                class="surah-navigation bottom-navigation"
                aria-label="Surah navigation">


                <a
                    class="surah-nav-button secondary"
                    href="/Quran/Hafs/Al-Fatihah.html">

                    <i
                        class="fa-solid fa-arrow-left"
                        aria-hidden="true">
                    </i>

                    Al-Fatihah

                </a>


                <span
                    class="surah-nav-button disabled"
                    aria-disabled="true">

                    Aal-E-Imran

                    <i
                        class="fa-solid fa-arrow-right"
                        aria-hidden="true">
                    </i>

                </span>


            </nav>


        </section>


    </main>


    <!-- =====================================================
         FOOTER
         ===================================================== -->

    <footer class="footer site-footer">


        <div class="footer-inner">


            <div class="footer-brand">


                <object
                    class="website-logo"
                    data="/Images/Website-logo.svg"
                    type="image/svg+xml"
                    aria-label="Islamic Qalam logo">
                </object>


                <div>

                    <strong>
                        Islamic Qalam
                    </strong>

                    <p>
                        Classical works, thoughtfully presented.
                    </p>

                </div>


            </div>


            <div
                class="footer-links"
                aria-label="Footer navigation">


                <a href="/quran.html">
                    Qur'an
                </a>


                <a href="/videos.html">
                    Videos
                </a>


                <a href="/e-books.html">
                    E-books
                </a>


                <a href="/contact-us.html">
                    Contact
                </a>


            </div>


            <div
                class="social-links"
                aria-label="Social media">


                <a
                    href="https://www.youtube.com/@yusufazizi319/videos"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube">

                    <i
                        class="fa-brands fa-youtube"
                        aria-hidden="true">
                    </i>

                </a>


                <a
                    href="https://www.instagram.com/yusufazizizizizi/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram">

                    <i
                        class="fa-brands fa-instagram"
                        aria-hidden="true">
                    </i>

                </a>


                <a
                    href="https://www.tiktok.com/@yusufazizizizi"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok">

                    <i
                        class="fa-brands fa-tiktok"
                        aria-hidden="true">
                    </i>

                </a>


            </div>


        </div>


        <div class="footer-bottom">


            <p>

                &copy;

                <span id="current-year">
                    2026
                </span>

                Islamic Qalam. All rights reserved.

            </p>


        </div>


    </footer>


    <!-- =====================================================
         SCRIPTS
         ===================================================== -->


    <script
        src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2">
    </script>


    <script
        src="/Supabase/supabase-client.js">
    </script>


    <script src="/Scripts/global.js"></script>

    <script src="/Scripts/donation-popup.js"></script>


</body>

</html>
'''


new_html = new_html.replace(
    "__AYAHS__",
    all_ayahs_html
)


# ============================================================
# WRITE UPDATED HTML
# ============================================================

HTML_FILE.write_text(
    new_html,
    encoding="utf-8"
)


print()
print(
    "Al-Baqarah.html successfully redesigned."
)


# ============================================================
# UPDATE SHARED QURAN PAGE CSS
# ============================================================

if CSS_FILE.exists():

    css = CSS_FILE.read_text(
        encoding="utf-8"
    )


    # --------------------------------------------------------
    # Helper to ensure a CSS property has a certain value
    # --------------------------------------------------------

    def set_css_property(
        css_text,
        selector,
        property_name,
        property_value
    ):

        pattern = re.compile(
            rf'({re.escape(selector)}\s*\{{)'
            rf'([^{{}}]*)'
            rf'(\}})',
            flags=re.DOTALL
        )


        def replace_block(match):

            opening = match.group(1)
            body = match.group(2)
            closing = match.group(3)


            property_pattern = re.compile(
                rf'(^\s*)'
                rf'{re.escape(property_name)}'
                rf'\s*:\s*[^;]+;',
                flags=re.MULTILINE
            )


            if property_pattern.search(body):

                body = property_pattern.sub(
                    lambda m:
                        f"{m.group(1)}"
                        f"{property_name}: "
                        f"{property_value};",
                    body
                )

            else:

                body += (
                    f"\n    "
                    f"{property_name}: "
                    f"{property_value};"
                    f"\n"
                )


            return (
                opening
                + body
                + closing
            )


        return pattern.sub(
            replace_block,
            css_text
        )


    # --------------------------------------------------------
    # Arabic must remain RIGHT aligned
    # --------------------------------------------------------

    css = set_css_property(
        css,
        ".arabic-text",
        "text-align",
        "right"
    )

    css = set_css_property(
        css,
        ".arabic-text",
        "width",
        "100%"
    )


    # --------------------------------------------------------
    # English must remain LEFT aligned
    # --------------------------------------------------------

    css = set_css_property(
        css,
        ".translation-text",
        "text-align",
        "left"
    )

    css = set_css_property(
        css,
        ".translation-text",
        "width",
        "100%"
    )

    css = set_css_property(
        css,
        ".translation-text",
        "max-width",
        "none"
    )

    css = set_css_property(
        css,
        ".translation-text",
        "margin",
        "0"
    )


    # --------------------------------------------------------
    # Remove old separate circular ayah number styling
    # if it still exists.
    #
    # Verse numbers stay INSIDE the Quran text.
    # --------------------------------------------------------

    css = re.sub(
        r'\s*\.ayah-number\s*\{'
        r'[^{}]*'
        r'\}',
        '',
        css,
        flags=re.DOTALL
    )


    # --------------------------------------------------------
    # Al-Baqarah support styles
    # --------------------------------------------------------

    SUPPORT_MARKER = (
        "/* ================= "
        "SURAH READER EXTRA SUPPORT "
        "================= */"
    )


    if SUPPORT_MARKER not in css:

        css += r'''


/* ================= SURAH READER EXTRA SUPPORT ================= */


/* Bismillah used before Surahs such as Al-Baqarah */

.surah-bismillah {
    padding:
        2.2rem
        1rem
        1.7rem;

    border-bottom:
        1px solid
        rgba(
            13,
            59,
            38,
            0.09
        );

    color:
        var(--home-green);

    background:
        #ffffff;

    font-family:
        Amiri,
        serif;

    font-size:
        2.2rem;

    line-height:
        1.5;

    direction:
        rtl;

    text-align:
        center;
}


/* Disabled next/previous Surah navigation */

.surah-nav-button.disabled {
    border-color:
        var(--home-border);

    color:
        var(--home-muted);

    background:
        var(--home-surface-soft);

    opacity:
        0.65;

    cursor:
        not-allowed;

    pointer-events:
        none;
}


@media only screen and (max-width: 768px) {

    .surah-bismillah {
        padding:
            1.8rem
            1rem
            1.4rem;

        font-size:
            1.9rem;
    }

}
'''


    CSS_FILE.write_text(
        css,
        encoding="utf-8"
    )


    print(
        "quran-page.css also updated."
    )


else:

    print()
    print(
        "WARNING: quran-page.css was not found at:"
    )

    print(
        CSS_FILE
    )

    print(
        "The HTML was still updated successfully."
    )


# ============================================================
# FINISHED
# ============================================================

print()
print("Finished.")
print()
print(
    "Original backup:"
)
print(
    BACKUP_FILE
)
print()
print(
    "Updated page:"
)
print(
    HTML_FILE
)