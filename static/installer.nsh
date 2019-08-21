!macro customInstall
  WriteRegStr SHCTX "SOFTWARE\RegisteredApplications" "Wexond" "Software\Clients\StartMenuInternet\Wexond\Capabilities"

  WriteRegStr SHCTX "SOFTWARE\Classes\Wexond" "" "Wexond HTML Document"
  WriteRegStr SHCTX "SOFTWARE\Classes\Wexond\Application" "AppUserModelId" "Wexond"
  WriteRegStr SHCTX "SOFTWARE\Classes\Wexond\Application" "ApplicationIcon" "$INSTDIR\Wexond.exe,0"
  WriteRegStr SHCTX "SOFTWARE\Classes\Wexond\Application" "ApplicationName" "Wexond"
  WriteRegStr SHCTX "SOFTWARE\Classes\Wexond\Application" "ApplicationCompany" "Wexond"      
  WriteRegStr SHCTX "SOFTWARE\Classes\Wexond\Application" "ApplicationDescription" "A privacy-focused, extensible and beautiful web browser"      
  WriteRegStr SHCTX "SOFTWARE\Classes\Wexond\DefaultIcon" "DefaultIcon" "$INSTDIR\Wexond.exe,0"
  WriteRegStr SHCTX "SOFTWARE\Classes\Wexond\shell\open\command" "" '"$INSTDIR\Wexond.exe" "%1"'

  WriteRegStr SHCTX "SOFTWARE\Classes\.htm\OpenWithProgIds" "Wexond" ""
  WriteRegStr SHCTX "SOFTWARE\Classes\.html\OpenWithProgIds" "Wexond" ""

  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond" "" "Wexond"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond\DefaultIcon" "" "$INSTDIR\Wexond.exe,0"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond\Capabilities" "ApplicationDescription" "A privacy-focused, extensible and beautiful web browser"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond\Capabilities" "ApplicationName" "Wexond"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond\Capabilities" "ApplicationIcon" "$INSTDIR\Wexond.exe,0"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond\Capabilities\FileAssociations" ".htm" "Wexond"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond\Capabilities\FileAssociations" ".html" "Wexond"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond\Capabilities\URLAssociations" "http" "Wexond"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond\Capabilities\URLAssociations" "https" "Wexond"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond\Capabilities\StartMenu" "StartMenuInternet" "Wexond"
  
  WriteRegDWORD SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond\InstallInfo" "IconsVisible" 1
  
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond\shell\open\command" "" "$INSTDIR\Wexond.exe"
!macroend
!macro customUnInstall
  DeleteRegKey SHCTX "SOFTWARE\Classes\Wexond"
  DeleteRegKey SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond"
  DeleteRegValue SHCTX "SOFTWARE\RegisteredApplications" "Wexond"
!macroend