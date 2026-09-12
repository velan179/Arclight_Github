@echo off
REM Wrapper that launches LocalLLMChat.exe and keeps the window open
REM so any error message stays visible.

cd /d "%~dp0"
title Local LLM Chat
color 0B

echo.
echo ============================================================
echo   Local LLM Chat
echo ============================================================
echo.
echo Starting... a browser tab will open at http://localhost:8501
echo Keep this window open while you use the app.
echo Close this window to stop the app.
echo.
echo ------------------------------------------------------------
echo.

LocalLLMChat.exe

echo.
echo ------------------------------------------------------------
echo   The app has stopped. Exit code: %ERRORLEVEL%
echo.
echo   If you saw an error above, copy it and send to the
echo   workshop facilitator.
echo ------------------------------------------------------------
pause
