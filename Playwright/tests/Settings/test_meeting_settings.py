import re
from playwright.sync_api import expect

SETTINGS_URL = "https://app.grabdocs.com/settings"


def test_toggle_video_default_and_autostart_settings(page_with_auth):
    page = page_with_auth
    page.goto(SETTINGS_URL)
    expect(page.get_by_role("heading", name="Settings")).to_be_visible(timeout=6000)

    try:
        page.get_by_role("button", name=re.compile(r"^video$", re.I)).click()
    except Exception:
        # Fallback: if needed, use raw index
        page.locator("button").nth(13).click()

    expect(page.get_by_text("Video Meeting Settings")).to_be_visible(timeout=6000)

    # Locate the four checkboxes
    default_rec_cb = page.get_by_label(
        "Enable recording by default for new meetings"
    )
    default_trans_cb = page.get_by_label(
        "Enable transcription by default for new meetings"
    )
    auto_rec_cb = page.get_by_label(
        "Automatically start recording when joining meetings"
    )
    auto_trans_cb = page.get_by_label(
        "Automatically start transcription when joining meetings"
    )

    # Get original states
    orig_default_rec = default_rec_cb.is_checked()
    orig_default_trans = default_trans_cb.is_checked()
    orig_auto_rec = auto_rec_cb.is_checked()
    orig_auto_trans = auto_trans_cb.is_checked()

    # Toggle all four
    default_rec_cb.click()
    default_trans_cb.click()
    auto_rec_cb.click()
    auto_trans_cb.click()

    # Verify that a "Video settings saved successfully" toast appears
    toast = page.get_by_text("Video settings saved successfully", exact=False).first
    expect(toast).to_be_visible(timeout=6000)

    # And that each one actually changed value
    assert default_rec_cb.is_checked() == (not orig_default_rec)
    assert default_trans_cb.is_checked() == (not orig_default_trans)
    assert auto_rec_cb.is_checked() == (not orig_auto_rec)
    assert auto_trans_cb.is_checked() == (not orig_auto_trans)

    # Restore original states
    if default_rec_cb.is_checked() != orig_default_rec:
        default_rec_cb.click()
    if default_trans_cb.is_checked() != orig_default_trans:
        default_trans_cb.click()
    if auto_rec_cb.is_checked() != orig_auto_rec:
        auto_rec_cb.click()
    if auto_trans_cb.is_checked() != orig_auto_trans:
        auto_trans_cb.click()

    # Verify settings saved again + original states restored
    toast2 = page.get_by_text("Video settings saved successfully", exact=False).first
    expect(toast2).to_be_visible(timeout=6000)

    assert default_rec_cb.is_checked() == orig_default_rec
    assert default_trans_cb.is_checked() == orig_default_trans
    assert auto_rec_cb.is_checked() == orig_auto_rec
    assert auto_trans_cb.is_checked() == orig_auto_trans
