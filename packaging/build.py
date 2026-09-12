"""
Build script — produces dist/LocalLLMChat/LocalLLMChat.exe (and supporting files).

Usage:
    cd packaging
    pip install pyinstaller
    py build.py

The build takes 3-7 minutes. Output:
    packaging/dist/LocalLLMChat/        ← copy this whole folder to share
        LocalLLMChat.exe
        Setup_Ollama.bat
        README.txt
        _internal/   (Python + libs)

Then zip the folder and send to faculty.
"""
from __future__ import annotations

import os
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
APP_SRC = os.path.join(ROOT, "apps", "local_llm_chat.py")
APP_LOCAL_COPY = os.path.join(HERE, "local_llm_chat.py")
LAUNCHER = os.path.join(HERE, "launcher.py")
DIST = os.path.join(HERE, "dist")
BUILD = os.path.join(HERE, "build")
SPEC = os.path.join(HERE, "LocalLLMChat.spec")


def main() -> int:
    # 1. Copy the Streamlit app next to launcher so PyInstaller can bundle it
    shutil.copy2(APP_SRC, APP_LOCAL_COPY)
    print(f"[1/3] Copied {APP_SRC}\n   -> {APP_LOCAL_COPY}")

    # 2. Run PyInstaller
    args = [
        sys.executable, "-m", "PyInstaller",
        "--name=LocalLLMChat",
        "--onedir",                # faster startup + easier to debug than --onefile
        "--noconfirm",
        "--clean",
        "--console",               # keep console window so faculty see startup logs
        f"--distpath={DIST}",
        f"--workpath={BUILD}",
        f"--specpath={HERE}",
        f"--add-data={APP_LOCAL_COPY}{os.pathsep}.",
        "--collect-all=streamlit",
        "--collect-all=altair",
        "--collect-data=pypdf",
        "--collect-submodules=streamlit",
        "--hidden-import=ollama",
        "--hidden-import=docx",
        "--hidden-import=pypdf",
        LAUNCHER,
    ]
    print("[2/3] Running PyInstaller...\n   " + " ".join(args))
    rc = subprocess.call(args)
    if rc != 0:
        print(f"[FAIL] PyInstaller exited with code {rc}")
        return rc

    # 3. Copy faculty-facing files into the dist folder
    out_dir = os.path.join(DIST, "LocalLLMChat")
    for f in ("Setup_Ollama.bat", "Launch.bat", "README_Faculty.md"):
        src = os.path.join(HERE, f)
        if os.path.exists(src):
            shutil.copy2(src, out_dir)
            print(f"   Copied {f}  ->  {out_dir}")
    print(f"\n[3/3] DONE.  Share this folder: {out_dir}")
    print("       Tip: zip the folder before sending.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
