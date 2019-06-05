!macro customInstall
  WriteRegStr SHCTX "SOFTWARE\RegisteredApplications" "Flowr-pc-client" "Software\Clients\StartMenuInternet\Flowr-pc-client\Capabilities"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Flowr-pc-client\Capabilities\StartMenu" "StartMenuInternet" "Flowr-pc-client"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Flowr-pc-client" "" "Flowr-pc-client"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Flowr-pc-client\Capabilities" "ApplicationDescription" "A client for FlowR"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Flowr-pc-client\Capabilities" "ApplicationName" "Flowr-pc-client"
  WriteRegDWORD SHCTX "SOFTWARE\Clients\StartMenuInternet\Flowr-pc-client\InstallInfo" "IconsVisible" 1
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Flowr-pc-client\shell\open\command" "" "$0\Flowr-pc-client.exe"
  WriteRegStr HKCU "SOFTWARE\Classes\BraveBetaHTML\shell\open\command" "" '"$0\Flowr-pc-client.exe" -- "%1"'
!macroend
!macro customUnInstall
  DeleteRegKey HKCU "SOFTWARE\Classes\Flowr-pc-client"
  DeleteRegKey SHCTX "SOFTWARE\Clients\StartMenuInternet\Flowr-pc-client"
  DeleteRegValue SHCTX "SOFTWARE\RegisteredApplications" "Flowr-pc-client"
!macroend
