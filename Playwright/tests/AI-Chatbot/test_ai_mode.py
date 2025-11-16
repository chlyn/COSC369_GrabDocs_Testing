from playwright.sync_api import expect

def test_chatbot_mode_switching(page_with_auth):
    page = page_with_auth

    expect(page.get_by_text("Drop files or click to browse")).to_be_visible(timeout=6000)

    # Default should be Refined
    expect(
        page.get_by_text("Refined: AI-enhanced from documents", exact=False)
    ).to_be_visible(timeout=5000)

    # Switch to Exact
    page.get_by_role("button", name="Exact").click()

    expect(
        page.get_by_text("Exact: Only from documents", exact=False)
    ).to_be_visible(timeout=5000)

    # Switch to Expanded
    page.get_by_role("button", name="Expanded").click()

    expect(
        page.get_by_text("Expanded: Documents + external sources", exact=False)
    ).to_be_visible(timeout=5000)

    # Switch back to Refined
    page.get_by_role("button", name="Refined").click()

    expect(
        page.get_by_text("Refined: AI-enhanced from documents", exact=False)
    ).to_be_visible(timeout=5000)
