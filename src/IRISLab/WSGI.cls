Class IRISLab.WSGI Extends %SYS.Python.WSGI
{

ClassMethod OnPreDispatch(pUrl As %String, pMethod As %String, ByRef pContinue As %Boolean) As %Status [ Internal ]
{
	set staticFileDirectory = $$$GetSecurityApplicationsPath(%request.AppData)
	set serveStaticEnabled = $$$GetSecurityApplicationsServeFiles(%request.AppData)
  set serveStaticEnabled = 1
	set pContinue = 0
	if serveStaticEnabled {
    if '$match(pUrl, "^/api(/.*)*$") {
      if pUrl = "/" set pUrl = "/index.html" 
      set file = %request.Application _ pUrl
      set %request.Data("FILE", 1) = file
      quit ##class(%CSP.StreamServer).Page()
    }
	}

	do ..DispatchREST(pUrl, "", "irislab.api", "api", "1")
	quit $$$OK
}

}
