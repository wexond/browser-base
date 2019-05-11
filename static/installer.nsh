!macro customInstall
  WriteRegStr SHCTX "SOFTWARE\RegisteredApplications" "Wexond" "Software\Clients\StartMenuInternet\Wexond\Capabilities"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond\Capabilities\StartMenu" "StartMenuInternet" "Wexond"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond" "" "Wexond"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond\Capabilities" "ApplicationDescription" "A privacy-focused, extensible and beautiful web browser"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond\Capabilities" "ApplicationName" "Wexond"
  WriteRegDWORD SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond\InstallInfo" "IconsVisible" 1
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond\shell\open\command" "" "$0\Wexond.exe"
  WriteRegStr HKCU "SOFTWARE\Classes\BraveBetaHTML\shell\open\command" "" '"$0\Wexond.exe" -- "%1"'
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\BraveBeta\Capabilities\URLAssociations" "http" "Wexond"
!macroend
!macro customUnInstall
  DeleteRegKey HKCU "SOFTWARE\Classes\Wexond"
  DeleteRegKey SHCTX "SOFTWARE\Clients\StartMenuInternet\Wexond"
  DeleteRegValue SHCTX "SOFTWARE\RegisteredApplications" "Wexond"
!macroend