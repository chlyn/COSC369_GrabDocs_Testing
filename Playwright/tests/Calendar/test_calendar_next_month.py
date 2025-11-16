import re
from playwright.sync_api import expect

CALENDAR_URL = "https://app.grabdocs.com/calendar"


def test_calendar_next_button_changes_month(page_with_auth):
    page = page_with_auth
    page.goto(CALENDAR_URL)
    expect(page.get_by_text("My Calendar")).to_be_visible(timeout=6000)

    # Grab the current month header text
    # matches any "Word Word" like "November 2025"
    month_header = page.locator("text=/^[A-Za-z]+ \\d{4}$/").first
    initial_text = month_header.inner_text()

    # Click the "Next" button
    page.get_by_role("button", name="Next").click()

    # Assert the month header text is now different
    expect(month_header).not_to_have_text(initial_text)
