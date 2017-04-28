@echo off
@setlocal enableextensions
@cd /d "%~dp0"
cd ../..
start cmd /k npm run compile-all
