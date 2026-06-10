@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%~2' -DestinationPath '%~4' -Force"
