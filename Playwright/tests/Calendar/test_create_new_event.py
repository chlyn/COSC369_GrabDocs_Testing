# tests/Calendar/test_create_event.py
import re
from datetime import datetime
from playwright.sync_api import expect

CALENDAR_URL = "https://app.grabdocs.com/calendar"
CALENDAR_CREATE_URL = "https://app.grabdocs.com/calendar/create"

def test_create_calendar_event(page_with_auth):
    page = page_with_auth
    page.goto(CALENDAR_URL)
    expect(page.get_by_text("My Calendar")).to_be_visible(timeout=6000)

    # Go directly to the event-create page
    page.goto(CALENDAR_CREATE_URL)
    expect(page.get_by_text("Create New Event")).to_be_visible(timeout=6000)

    event_name = f"Test Event {datetime.now().strftime('%Y%m%d-%H%M%S')}"

    page.get_by_placeholder("Team Meeting, Client Call, etc.").fill(event_name)

    #  Click "Create Event"
    create_btn = page.get_by_role("button", name=re.compile(r"create event", re.I))
    expect(create_btn).to_be_visible(timeout=6000)
    create_btn.click()

    # Go back to the calendar view and verify the event is visible
    page.goto(CALENDAR_URL)
    expect(page.get_by_text(event_name)).to_be_visible(timeout=10000)
