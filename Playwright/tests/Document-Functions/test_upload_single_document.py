from datetime import datetime
from pathlib import Path
from playwright.sync_api import expect

def test_upload_document(page_with_auth, tmp_path):
    page = page_with_auth

    fixtures = Path(__file__).parent / "fixtures"
    fixtures.mkdir(exist_ok=True)

    visible_name = f"upload_test_{datetime.now().strftime('%H%M%S')}"
 
    fname = f"{visible_name}.txt"
    fpath = fixtures / fname
    fpath.write_text("This is a test upload file.\n", encoding="utf-8")

    file_input = page.locator('input[type="file"]').first
    expect(file_input).to_be_attached(timeout=10_000)
    file_input.set_input_files(str(fpath))

    # verify the upload completed
    try:
        # Use visible_name here
        expect(page.get_by_text(visible_name, exact=False)).to_be_visible(timeout=10_000)
    except Exception:
        # Fallback if "No documents uploaded yet" is still visible
        try:
            expect(
                page.get_by_text("No documents uploaded yet", exact=False)
            ).not_to_be_visible(timeout=3_000)
        except Exception:
            # Collect artifacts to see what happened
            page.screenshot(path="upload_debug_screenshot.png", full_page=True)
            html_path = Path("upload_debug_dom.html")
            html_path.write_text(page.content(), encoding="utf-8")
            raise AssertionError(
                "Upload verification failed. "
                "Saved upload_debug_screenshot.png and upload_debug_dom.html for inspection."
            )
