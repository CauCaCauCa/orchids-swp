@echo off

REM Open a new tab in Windows Terminal and navigate to the "orchids-react" folder
start wt -d "orchids-react" cmd.exe /k "npm start"

REM Split the tab vertically and navigate to the "orchids-express" folder
start wt -d "orchids-express" cmd.exe /k "npm run dev"