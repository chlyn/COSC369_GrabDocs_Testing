# test_submit_feedback.py
import re
from playwright.sync_api import expect

def test_submit_support_feedback(page_with_auth):
    page = page_with_auth

    ask_button = page.get_by_role("button", name=re.compile(r"\bask\b", re.I))
    expect(ask_button).to_be_visible(timeout=6000)

    ask_button.click()

    expect(page.get_by_text("GD Assistant")).to_be_visible(timeout=6000)
    expect(page.get_by_text("Need Help?")).to_be_visible(timeout=6000)

    # Support label is visible
    support_label = page.get_by_text(re.compile(r"^support$", re.I)).first
    expect(support_label).to_be_visible(timeout=6000)

    # Category dropdown
    category_select = page.locator(
        "xpath=//label[normalize-space()='Category']/following::select[1]"
    )
    expect(category_select).to_be_visible(timeout=6000)

    # Choose the first real option
    category_select.select_option(index=1)

    title_input = page.get_by_placeholder("Brief summary of your feedback")
    message_input = page.get_by_placeholder("Please provide detailed feedback...")

    expect(title_input).to_be_visible(timeout=6000)
    expect(message_input).to_be_visible(timeout=6000)

    title_input.fill("Test feedback")
    message_input.fill(
        "This is an automated test message."
    )

    # Submit Feedback
    submit_btn = page.get_by_role("button", name=re.compile("submit feedback", re.I))
    expect(submit_btn).to_be_enabled(timeout=6000)

    submit_btn.click()

    # Fail immediately if error toast appears
    error_toast = page.get_by_text(re.compile(r"failed to submit feedback", re.I))
    if error_toast.count() > 0:
        raise AssertionError("ERROR: 'Failed to submit feedback' toast appeared — feedback submission did NOT succeed.")
    
    # asserts success if passes (it will not)
    success_toast = page.get_by_text(re.compile(r"success", re.I))
    expect(success_toast).to_be_visible(timeout=5000)

