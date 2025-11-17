# test_upload_multiple_files.py
from datetime import datetime
from pathlib import Path
from playwright.sync_api import expect

def _make_file(fixtures_dir: Path, stem: str, ext=".txt") -> Path:
    fixtures_dir.mkdir(exist_ok=True)
    fname = f"{stem}_{datetime.now().strftime('%H%M%S')}{ext}"
    fpath = fixtures_dir / fname
    fpath.write_text(f"This is a test file named {fname}\n", encoding="utf-8")
    return fpath

def _upload_file(page, fpath: Path):
    file_input = page.locator('input[type="file"]').first
    expect(file_input).to_be_visible(timeout=10_000)

    file_input.set_input_files(str(fpath))

    visible_name = fpath.stem

    try:
        expect(page.get_by_text(visible_name, exact=False)).to_be_visible(timeout=10_000)
        return
    except Exception:
        pass

    # check that the "no documents" empty state is gone
    try:
        expect(page.get_by_text("No documents uploaded yet", exact=False)).not_to_be_visible(timeout=3_000)
        return
    except Exception:
        pass

    # Debug on failure
    page.screenshot(path=f"upload_debug_{fpath.stem}.png", full_page=True)
    Path(f"upload_debug_{fpath.stem}.html").write_text(page.content(), encoding="utf-8")
    raise AssertionError(f"Upload did not appear for: {visible_name}")

def test_upload_three_files(page_with_auth):
    page = page_with_auth #starts on /upload page (no need to login)
    fixtures = Path(__file__).parent / "fixtures"
    
    #three files to test upload
    # it will only upload the 2nd and 3rd file if the 1st one is successful 
    files = [
        _make_file(fixtures, "multi1"),
        _make_file(fixtures, "multi2"),
        _make_file(fixtures, "multi3"),
    ]

    for fpath in files:
        _upload_file(page, fpath)
