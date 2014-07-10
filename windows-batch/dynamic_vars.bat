@echo off
setlocal enabledelayedexpansion
set count=1
for /f "tokens=* USEBACKQ" %%F in (`type settings.txt`) do (
  set setting!count!=%%F
  set /a count=!count!+1
)
echo %setting1%
echo %setting2%
echo %setting3%
