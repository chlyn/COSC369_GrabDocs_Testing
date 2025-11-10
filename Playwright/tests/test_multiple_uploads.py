# tests/test_upload_multiple_files.py
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
    # Re-locates the file input everytime a file uploads in case the DOM re-renders
    file_input = page.locator('input[type="file"]').first
    expect(file_input).to_be_visible(timeout=10000)

    # upload
    file_input.set_input_files(str(fpath))

    # verify the upload completed 
    # checks if the filename is somwewhere on the page
    try:
        expect(page.get_by_text(fpath.name, exact=False)).to_be_visible(timeout=900)
        return
    except Exception:
        pass

    # Fallbacks checks if file upload failed
    try:
        expect(page.get_by_text("No documents uploaded yet", exact=False)).not_to_be_visible(timeout=900)
        return
    except Exception:
        pass

    # Debug on failure
    page.screenshot(path=f"upload_debug_{fpath.stem}.png", full_page=True)
    Path(f"upload_debug_{fpath.stem}.html").write_text(page.content(), encoding="utf-8")
    raise AssertionError(f"Upload did not appear for: {fpath.name}")

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
