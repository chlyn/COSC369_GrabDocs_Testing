# tests/Settings/test_app_scale.py
import re
from playwright.sync_api import expect

SETTINGS_URL = "https://app.grabdocs.com/settings"

def test_change_app_scale_with_buttons(page_with_auth):
    page = page_with_auth
    page.goto(SETTINGS_URL)
    expect(page.get_by_role("heading", name="Settings")).to_be_visible(timeout=6000)

    try:
        page.get_by_role("button", name=re.compile(r"^display$", re.I)).click()
    except Exception:
        page.locator("button").nth(11).click()

    expect(page.get_by_text("Display Settings")).to_be_visible(timeout=6000)

    precise_input = page.locator("xpath=//*[text()='Precise Value']/following::input[1]")
    current_scale_label = page.get_by_text(re.compile(r"Current Scale", re.I))

    expect(precise_input).to_be_visible(timeout=6000)

    # Click Compact and verify value & scale
    page.get_by_role("button", name="Compact").click()
    expect(precise_input).to_have_value("0.85", timeout=5000)
    expect(current_scale_label).to_contain_text("85%", timeout=5000)

    # Click Small and verify
    page.get_by_role("button", name="Small").click()
    expect(precise_input).to_have_value("0.95", timeout=5000)
    expect(current_scale_label).to_contain_text("95%", timeout=5000)

    # Click Normal and verify
    page.get_by_role("button", name="Normal").click()
    expect(precise_input).to_have_value("1", timeout=5000)
    expect(current_scale_label).to_contain_text("100%", timeout=5000)

    # Click Large and verify
    page.get_by_role("button", name="Large").click()
    expect(precise_input).to_have_value("1.1", timeout=5000)
    expect(current_scale_label).to_contain_text("110%", timeout=5000)

    # back to Small
    page.get_by_role("button", name="Small").click()
    expect(precise_input).to_have_value("0.95", timeout=5000)
    expect(current_scale_label).to_contain_text("95%", timeout=5000)
