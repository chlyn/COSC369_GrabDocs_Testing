import re
from datetime import datetime
from playwright.sync_api import expect

CALENDAR_URL = "https://app.grabdocs.com/calendar"
CALENDAR_CREATE_URL = "https://app.grabdocs.com/calendar/create"

def test_delete_calendar_event(page_with_auth):
    page = page_with_auth
    page.goto(CALENDAR_URL)
    expect(page.get_by_text("My Calendar")).to_be_visible(timeout=6000)

    # Create an event
    # reused code, should have a helper function
    page.goto(CALENDAR_CREATE_URL)
    expect(page.get_by_text("Create New Event")).to_be_visible(timeout=6000)

    event_name = f"Test Event {datetime.now().strftime('%Y%m%d-%H%M%S')}"
    page.get_by_placeholder("Team Meeting, Client Call, etc.").fill(event_name)
    page.get_by_role("button", name=re.compile("create event", re.I)).click()

    # Open the event from Total Events
    page.goto(CALENDAR_URL)
    page.get_by_text("Total Events").click()
    expect(page.get_by_text(event_name)).to_be_visible(timeout=8000)
    page.get_by_text(event_name).click()

    # Click the delete button on the event details page
    expect(page.get_by_text(event_name)).to_be_visible(timeout=8000)

    # delete button nth(5)
    delete_btn = page.locator("button").nth(5)
    delete_btn.click()

    # Confirm delete if dialog pops up
    try:
        page.get_by_role("button", name=re.compile("delete", re.I)).click(timeout=5000)
    except Exception:
        pass

    # Make sure it's gone
    page.goto(CALENDAR_URL)
    page.get_by_text("Total Events").click()
    expect(page.get_by_text(event_name)).not_to_be_visible(timeout=8000)
