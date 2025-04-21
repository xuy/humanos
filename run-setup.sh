#!/bin/bash

# Convert WSL path to Windows path
WIN_SCRIPT_PATH=$(wslpath -w "$(pwd)/setup-metro-access.ps1")

# Run PowerShell script as administrator
powershell.exe -Command "Start-Process powershell -Verb RunAs -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File \"$WIN_SCRIPT_PATH\"'" 