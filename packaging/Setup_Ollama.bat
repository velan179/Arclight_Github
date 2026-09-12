@echo off
title Setup Ollama for Local LLM Chat
color 0B
echo.
echo ============================================================
echo   Setup Ollama  -  one-time setup for Local LLM Chat
echo ============================================================
echo.

REM ---- Step 1: Check / install Ollama ---------------------------------
echo [Step 1/2]  Checking if Ollama is installed...
where ollama >nul 2>&1
if %ERRORLEVEL%==0 (
    echo            Ollama is already installed.
    goto pull_model
)

echo            Ollama NOT found on this machine.
echo            Opening the official download page in your browser...
start "" "https://ollama.com/download/windows"
echo.
echo  ------------------------------------------------------------
echo   What to do next:
echo     1. Download and run the Ollama installer ^(Windows^).
echo     2. After it finishes, close this window and run
echo        Setup_Ollama.bat again.
echo  ------------------------------------------------------------
echo.
pause
exit /b 1

:pull_model
echo.
echo [Step 2/2]  Pulling model llama3.2:3b ^(~2 GB, one-time^)...
echo            This may take a few minutes depending on your internet.
echo.
ollama pull llama3.2:3b
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  [WARNING] Could not pull llama3.2:3b. You can try a smaller model:
    echo            ollama pull gemma2:2b
    echo            ollama pull qwen2.5:1.5b
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo   All set!  Now double-click  LocalLLMChat.exe  to start.
echo ============================================================
echo.
pause
