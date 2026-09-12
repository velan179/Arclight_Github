"""
Launcher for the bundled Local LLM Chat .exe.

PyInstaller can't bundle a Streamlit app directly because `streamlit run`
expects a real Python file on disk. This launcher starts Streamlit
programmatically pointing to the bundled `local_llm_chat.py`, then opens
the user's default browser.
"""
import os
import sys
import threading
import time
import traceback
import webbrowser


URL = "http://localhost:8501"


def _open_browser_when_ready():
    # Give Streamlit ~2.5 s to bind the port; this is fine because the
    # browser will retry / show its own loader.
    time.sleep(2.5)
    try:
        webbrowser.open(URL)
    except Exception:
        pass


def _pause(msg: str = "Press Enter to exit..."):
    try:
        input(msg)
    except Exception:
        pass


def main() -> int:
    # When frozen by PyInstaller, bundled data files live in sys._MEIPASS
    base = getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__)))
    app_path = os.path.join(base, "local_llm_chat.py")

    print("=" * 55)
    print(" Local LLM Chat - starting up...")
    print(" A browser tab will open at " + URL)
    print(" Close this window to stop the app.")
    print("=" * 55)
    print(f"  base     = {base}")
    print(f"  app_path = {app_path}")
    print(f"  exists?  = {os.path.exists(app_path)}")
    print("-" * 55)

    if not os.path.exists(app_path):
        print(f"[FATAL] Cannot find bundled app at {app_path}")
        _pause()
        return 1

    try:
        from streamlit.web import cli as stcli
    except Exception as e:
        print(f"[FATAL] Could not import Streamlit: {e}")
        traceback.print_exc()
        _pause()
        return 2

    threading.Thread(target=_open_browser_when_ready, daemon=True).start()

    sys.argv = [
        "streamlit",
        "run",
        app_path,
        "--server.headless=true",
        "--server.port=8501",
        "--browser.gatherUsageStats=false",
        "--global.developmentMode=false",
    ]

    try:
        return stcli.main()
    except SystemExit as e:
        # Streamlit normally calls sys.exit(); only pause if it was an error
        if e.code not in (0, None):
            print(f"[FATAL] Streamlit exited with code {e.code}")
            _pause()
        return e.code or 0
    except Exception as e:
        print(f"[FATAL] Unhandled exception: {e}")
        traceback.print_exc()
        _pause()
        return 3


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        print(f"[FATAL] Crash before startup: {e}")
        traceback.print_exc()
        _pause()
        sys.exit(99)

