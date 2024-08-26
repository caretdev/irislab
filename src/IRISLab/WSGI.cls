Class IRISLab.WSGI Extends %SYS.Python.WSGI
{

Parameter UseSession = 1;

Parameter Debug = 1;

ClassMethod OnPreDispatch(pUrl As %String, pMethod As %String, ByRef pContinue As %Boolean) As %Status [ Internal ]
{
  #if $system.Version.GetNumber()]]"2024.1"  
  set debug = $$$GetSecurityApplicationsWSGIDebug(%request.AppData)
  if debug '= ..#Debug {
    do ..SetDebug(%request.Application, ..#Debug)
  }
  do %response.SetHeader("x-wsgidebug", debug)
  #endIf

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
  
  if $piece(pUrl, "/", 3) '= "" {
    try {
      set namespace = $piece(pUrl, "/", 3)
      set $namespace = namespace
    }
    catch {
      set %response.Status = 403
      return $$$OK
    }
  }
  set params = 0
  
  #if $system.Version.GetNumber()]]"2024.1"
  set params = 1
  set params(1) = 1
  #endIf

	do ##class(%SYS.Python.WSGI).DispatchREST(pUrl, "", "irislab.api", "api", params...)
	quit $$$OK
}

ClassMethod AccessCheck(Output pAuthorized As %Boolean = 0) As %Status
{
  $$$QuitOnError(##super(.pAuthorized))
  if pAuthorized, $username'="UnknownUser" {
    if %request.Method="POST" {
      set %response.Redirect = %request.URL
    }
    quit $$$OK
  }
  quit $$$OK
}

ClassMethod Login(skipheader As %Boolean = 1) As %Status
{
  set tUrl = %request.URL
  set tUrl = "/"_$extract(tUrl,$length(%request.Application)+1,*)
  if $piece(tUrl, "/", 2) = "portal" {
    set %response.ServerSideRedirect = "/csp/sys" _ tUrl
    set filename = $system.CSP.GetFileName("/csp/sys" _ tUrl)
    quit $$$OK
  }
  kill %request.Data("Error:ErrorCode")
  quit ##class(%CSP.Login).Page(skipheader)
}

ClassMethod SetDebug(app As %String = "/irislab", debug = 0)
{
  new $namespace
  set $namespace = ""
  set p("WSGIDebug") = 1
  quit ##class(Security.Applications).Modify(app, .p)
}

}
