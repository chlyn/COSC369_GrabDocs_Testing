import re
from playwright.sync_api import expect

SETTINGS_URL = "https://app.grabdocs.com/settings"


def test_usage_page_ui(page_with_auth):
    page = page_with_auth
    page.goto(SETTINGS_URL)
    expect(page.get_by_role("heading", name="Settings")).to_be_visible(timeout=6000)

    try:
        page.get_by_role("button", name=re.compile(r"^usage$", re.I)).click()
    except Exception:
        page.locator("button").nth(14).click()  # fallback tab index

    expect(page.get_by_text("Subscription & Usage")).to_be_visible(timeout=6000)

    # UI Sections
    expected_texts = [
        "Free Plan",
        "Next reset",
        "AI Tokens",
        "Tokens Used",
        "File Storage",
        "Storage Used",
        "Meetings",
        "Meetings Conducted",
        "Meeting Minutes",
        "Transcription",
        "Minutes Used",
        "Workspaces",
        "Workspaces Used",
    ]

    for label in expected_texts:
        if label == "Free Plan":
            expect(
                page.get_by_role("heading", name=re.compile("Free Plan", re.I))
            ).to_be_visible(timeout=6000)
        else:
            locator = page.get_by_text(re.compile(label, re.I)).first
            expect(locator).to_be_visible(timeout=6000)

    # Validate "Refresh" button and plan badge
    expect(
        page.get_by_role("button", name=re.compile("refresh", re.I))
    ).to_be_visible(timeout=6000)
    expect(
        page.get_by_text("Free Plan", exact=False).first
    ).to_be_visible(timeout=6000)
