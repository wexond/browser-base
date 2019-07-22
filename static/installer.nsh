!macro customInstall
  WriteRegStr SHCTX "SOFTWARE\RegisteredApplications" "flowr-desktop" "Software\Clients\StartMenuInternet\flowr-desktop\Capabilities"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\flowr-desktop\Capabilities\StartMenu" "StartMenuInternet" "flowr-desktop"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\flowr-desktop" "" "flowr-desktop"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\flowr-desktop\Capabilities" "ApplicationDescription" "A client for FlowR"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\flowr-desktop\Capabilities" "ApplicationName" "flowr-desktop"
  WriteRegDWORD SHCTX "SOFTWARE\Clients\StartMenuInternet\flowr-desktop\InstallInfo" "IconsVisible" 1
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\flowr-desktop\shell\open\command" "" "$0\flowr-desktop.exe"
  WriteRegStr HKCU "SOFTWARE\Classes\BraveBetaHTML\shell\open\command" "" '"$0\flowr-desktop.exe" -- "%1"'
!macroend
!macro customUnInstall
  DeleteRegKey HKCU "SOFTWARE\Classes\flowr-desktop"
  DeleteRegKey SHCTX "SOFTWARE\Clients\StartMenuInternet\flowr-desktop"
  DeleteRegValue SHCTX "SOFTWARE\RegisteredApplications" "flowr-desktop"
!macroend
