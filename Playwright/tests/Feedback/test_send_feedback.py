# test_send_feedback.py
import re
from playwright.sync_api import expect

FEEDBACK_URL = "https://app.grabdocs.com/feedback"

def _goto_feedback_from_upload(page):
    expect(page.get_by_text("Drop files or click to browse", exact=False)).to_be_visible(timeout=6000)
    page.goto(FEEDBACK_URL)

def test_send_support_feedback(page_with_auth):
    page = page_with_auth

    _goto_feedback_from_upload(page)

    expect(page.get_by_text("Send Feedback")).to_be_visible(timeout=6000)

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

