REM Remove directory (forced without prompt)
rmdir "%directory%" /s/q

REM Copy file (forced overwrite)
xcopy "%source%" "%target%" /y
