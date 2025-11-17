# tests/Settings/test_update_profile.py
import re
import random
from playwright.sync_api import expect

SETTINGS_URL = "https://app.grabdocs.com/settings"

def test_update_profile_first_name(page_with_auth):
    page = page_with_auth
    page.goto(SETTINGS_URL)

    expect(page.get_by_role("heading", name="Settings")).to_be_visible(timeout=6000)

    # Generate a random new first name
    new_name = f"test{random.randint(1000, 9999)}"

    # Fill the First Name field
    first_name_input = page.get_by_label("First Name")
    first_name_input.fill(new_name)

    # Click Save Changes (we wont actually save)
    save_btn = page.get_by_role("button", name=re.compile("save changes", re.I))
    save_btn.click()

    # Website is not working properly, test fails this assertion (11-17-2025)
    expect(
        page.get_by_text("Failed to update profile", exact=False)
    ).not_to_be_visible(timeout=4000)