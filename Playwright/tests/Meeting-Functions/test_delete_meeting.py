import re
from datetime import datetime
from playwright.sync_api import expect

REACH_URL = "https://app.grabdocs.com/video-meeting"
TOAST_OK = re.compile(r"Meeting created successfully", re.I)

def _goto_reach_from_upload(page):
    expect(page.get_by_text("Drop files or click to browse", exact=False)).to_be_visible(timeout=6000)
    page.goto(REACH_URL)


def test_delete_meeting(page_with_auth):
    page = page_with_auth

    _goto_reach_from_upload(page)

    # create a meeting (repeated code)
    # should make a helper file for creating meeting
    meeting_name = f"pw-meet-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    page.get_by_role("button", name=re.compile(r"^create\s+meeting$", re.I)).click()
    page.get_by_placeholder(re.compile(r"enter\s+meeting\s+name", re.I)).fill(meeting_name)
    page.get_by_role("button", name=re.compile(r"^create\s+meeting$", re.I)).nth(1).click()

    expect(page.get_by_text(TOAST_OK)).to_be_visible(timeout=8000)

    # find DELETE button for THIS meeting
    delete_btn = page.locator(
        f"xpath=(//*[contains(text(), '{meeting_name}')]/following::button[contains(@title, 'Delete')])[1]"
    )

    expect(delete_btn).to_be_visible(timeout=8000)
    delete_btn.click()

    # make sure the meeting card is gone
    expect(page.get_by_text(meeting_name)).not_to_be_visible(timeout=8000)
