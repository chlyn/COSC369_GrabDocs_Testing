import re
from playwright.sync_api import expect

SETTINGS_URL = "https://app.grabdocs.com/settings"


def test_change_display_theme_to_dark(page_with_auth):
    page = page_with_auth

    page.goto(SETTINGS_URL)
    expect(page.get_by_role("heading", name="Settings")).to_be_visible(timeout=6000)

    # Click the "Display" tab
    try:
        page.get_by_role("button", name=re.compile(r"^display$", re.I)).click()
    except Exception:
        # Fallback: Display tab known as button[12 of 16] → index 11
        page.locator("button").nth(11).click()

    expect(page.get_by_text("Display Settings")).to_be_visible(timeout=6000)

    theme_select = page.locator("select").first

    # Change theme to Dark by selecting option value "dark"
    theme_select.select_option("dark")

    # Assert the <select> value is now "dark"
    expect(theme_select).to_have_value("dark")

    theme_display = page.locator(
        "xpath=//*[text()='Select Theme']/following::*[1]"
    )
    expect(theme_display).to_contain_text(re.compile("dark", re.I), timeout=6000)

    # Switch back to Light
    theme_select.select_option("light")
    expect(theme_select).to_have_value("light")
    expect(theme_display).to_contain_text(re.compile("light", re.I), timeout=6000)
