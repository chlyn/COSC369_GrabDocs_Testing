import re
from datetime import datetime
from playwright.sync_api import expect

REACH_URL = "https://app.grabdocs.com/video-meeting"

def _goto_reach_from_upload(page):
    expect(page.get_by_text("Drop files or click to browse", exact=False)).to_be_visible(timeout=6000)
    page.goto(REACH_URL)

def test_create_meeting(page_with_auth):
    page = page_with_auth

    _goto_reach_from_upload(page)

    # Create a meeting
    meeting_name = f"pw-meet-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    page.get_by_role("button", name=re.compile(r"^create\s+meeting$", re.I)).click()
    page.get_by_placeholder(re.compile(r"enter\s+meeting\s+name", re.I)).fill(meeting_name)
    page.get_by_role("button", name=re.compile(r"^create\s+meeting$", re.I)).nth(1).click()
