@echo off
@setlocal enableextensions
@cd /d "%~dp0"
start cmd /k npm run package-all
