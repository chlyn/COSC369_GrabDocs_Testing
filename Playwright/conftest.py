# conftest.py
import os
import re
import pytest
from pathlib import Path
from playwright.sync_api import expect

# -------------- Config --------------
BASE_URL  = os.getenv("BASE_URL", "https://app.grabdocs.com")
LOGIN_URL = os.getenv("LOGIN_URL", f"{BASE_URL}/login")
EMAIL     = os.getenv("GRABDOCS_EMAIL")
PASSWORD  = os.getenv("GRABDOCS_PASSWORD")
AUTH_FILE = "auth.json" 

# -------------- Browser --------------
@pytest.fixture(scope="session")
def browser(playwright):
    headed = os.getenv("PWDEBUG") in ("1", "true", "True")
    return playwright.chromium.launch(headless=not headed)

# -------------- Helpers --------------
def _fill_and_submit_login(page):
    # placeholder fields + "Sign in" button 
    # needs verification code to login
    expect(page.get_by_placeholder("Email")).to_be_visible(timeout=8000)
    page.get_by_placeholder("Email").fill(EMAIL)

    expect(page.get_by_placeholder("Password")).to_be_visible(timeout=8000)
    page.get_by_placeholder("Password").fill(PASSWORD)

    page.get_by_role("button", name=re.compile(r"^sign in$", re.I)).click()

def _wait_for_logged_in(page):
    # any of these are acceptable signals to show we are logged in
    candidates = [
        page.get_by_text("Drop files or click to browse", exact=False),
        page.get_by_text("No documents uploaded yet", exact=False),
        page.get_by_role("button", name=re.compile(r"google drive", re.I)),
        page.get_by_role("button", name=re.compile(r"dropbox", re.I)),
        page.get_by_text("Ask me anything about your documents", exact=False),
    ]
    last_err = None
    for loc in candidates:
        try:
            expect(loc).to_be_visible(timeout=6000)
            return
        except Exception as e:
            last_err = e
    raise AssertionError(f"Post-login UI not detected. Last error: {last_err}")

# -------------- Session login (runs once) --------------
@pytest.fixture(scope="session")
def ensure_auth(browser):
    if not EMAIL or not PASSWORD:
        raise RuntimeError("Set GRABDOCS_EMAIL and GRABDOCS_PASSWORD env vars first.")

    if Path(AUTH_FILE).exists():
        return AUTH_FILE

    ctx = browser.new_context()
    page = ctx.new_page()

    page.goto(LOGIN_URL, wait_until="domcontentloaded")
    _fill_and_submit_login(page)

    try:
        _wait_for_logged_in(page)
    except Exception:
        page.screenshot(path="post_login_failed.png", full_page=True)
        ctx.close()
        raise

    ctx.storage_state(path=AUTH_FILE)
    ctx.close()
    return AUTH_FILE

# -------------- Per-test page, already authenticated, will land on /upload page --------------
@pytest.fixture()
def page_with_auth(browser, ensure_auth):
    ctx = browser.new_context(storage_state=ensure_auth)
    page = ctx.new_page()
    page.goto(f"{BASE_URL}/upload", wait_until="domcontentloaded")
    yield page
    ctx.close()
