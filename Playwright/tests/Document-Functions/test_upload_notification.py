from pathlib import Path
from datetime import datetime
from playwright.sync_api import expect

def test_upload_notification(page_with_auth):
    page = page_with_auth

    # create a test file
    fixtures = Path(__file__).parent / "fixtures"
    fixtures.mkdir(exist_ok=True)

    fname = f"notif_test_{datetime.now().strftime('%H%M%S')}.txt"
    fpath = fixtures / fname
    fpath.write_text("Notification test file.\n", encoding="utf-8")

    # upload test file
    file_input = page.locator('input[type="file"]').first
    expect(file_input).to_be_attached(timeout=8000)
    file_input.set_input_files(str(fpath))

    # check for notifcation to appera
    # note: this only checks for the notification of upload, NOT if the actual upload is successful
    notification = page.get_by_text("Files uploaded successfully", exact=False)
    expect(notification).to_be_visible(timeout=10000)

    # checks for notificaiton to go away
    expect(notification).not_to_be_visible(timeout=10000)
