from bs4 import BeautifulSoup
import re

# Load the HTML
with open("Quran/Warsh/Al-Baqarah.html", "r", encoding="utf-8") as file:
    soup = BeautifulSoup(file, "html.parser")

# Waqf signs Unicode
WAQF_SIGNS = ['\u06D6', '\u06D7', '\u06D8', '\u06D9', '\u06DA', '\u06DB', '\u06FA']
WAQF_SET = set(WAQF_SIGNS)

def separate_waqf(text):
    output = []
    for word in text.split():
        if any(ch in WAQF_SET for ch in word):
            base = ''.join(ch for ch in word if ch not in WAQF_SET)
            waqf = ''.join(ch for ch in word if ch in WAQF_SET)
            output.append(base)
            output.append(waqf)
        else:
            output.append(word)
    return ' '.join(output)

# Process Arabic ayahs
for p in soup.find_all("p", class_="arabic-text"):
    # Modify inner text
    if p.string:
        original_text = p.string
        modified = separate_waqf(original_text)
        p.string.replace_with(modified)
    
    # Modify hafs-data attribute if present
    hafs_text = p.get("hafs-data")
    if hafs_text:
        modified_hafs = separate_waqf(hafs_text)
        p["hafs-data"] = modified_hafs

# Save modified HTML
with open("Al-Baqarah_modified.html", "w", encoding="utf-8") as f_out:
    f_out.write(str(soup))  # Keeps structure fairly intact

print("✅ Done. Modified file saved as 'Al-Baqarah_modified.html'")
