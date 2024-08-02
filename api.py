import iris
from flask import Flask
from flask import send_from_directory

app = Flask(__name__, static_folder="build", static_url_path="")
app.debug = True


# put this sippet ahead of all your bluprints
# blueprint can also be app~~
@app.after_request
def after_request(response):
    header = response.headers
    header["Access-Control-Allow-Origin"] = "*"
    return response


@app.route("/api/<ns>/ss")
def get_ss(ns):
    return [
        row
        for row in iris.sql.exec(
            'select Process, JobType, Device, Namespace, Routine, CPU, Glob, Pr, "User", Location from %SYS.ProcessQuery_SS()'
        )
    ]


@app.route("/api/<ns>/schemas")
def get_schemas(ns):
    return [
        row
        for row in iris.sql.exec(
            "select SCHEMA_NAME from %SQL_MANAGER.SCHEMAS(0) where TABLE_EXISTS=1"
        )
    ]


@app.route("/api/<ns>/tables/", defaults={"schema": ""})
@app.route("/api/<ns>/tables/<schema>")
def get_tables(ns, schema):
    return [
        row
        for row in iris.sql.exec(f"select NAME from %SQL_MANAGER.TABLES('{schema}')")
    ]


@app.route("/api/<ns>/classes/", defaults={"package": ""})
@app.route("/api/<ns>/classes/<path:package>")
def get_classes(ns, package):
    # spec, direction, orderBy, systemFiles, flat ? "1" : "0", notStudio, generated
    spec = (package.replace("/", ".") + "/" if package else "") + "*.cls"
    direction = 1
    orderBy = 1
    systemFiles = 0
    flat = 0
    notStudio = 0
    generated = 0
    rows = iris.sql.exec(
        "SELECT Name, Type FROM %Library.RoutineMgr_StudioOpenDialog(?,?,?,?,?,?,?)",
        spec,
        direction,
        orderBy,
        systemFiles,
        flat,
        notStudio,
        generated,
    )
    return [row for row in rows]


@app.route("/api/<ns>/doc/<path:doc>")
def get_doc(ns, doc):
    docname = doc.replace("/", ".")
    linesArray = iris.arrayref()
    iris.cls("%Atelier.v1.Utils.TextServices").GetTextAsArray(docname, 0, linesArray, 0)
    lines = int(linesArray["0"])
    return list(linesArray.value.values())[1:lines]


@app.route("/api")
def get_root_info(ns=None):
    nsArr = iris.arrayref()
    iris.cls("%Atelier.v1.Utils.General").AccessibleNamespaces(nsArr)
    return {
        "version": iris.system.Version.GetVersion(),
        "username": iris.system.Process.UserName(),
        "namespaces": list(nsArr.value.keys()),
    }


@app.route("/api/<ns>")
def get_ns_info(ns=None):
    return {
        "namespace": iris.system.Process.NameSpace(),
    }


@app.route("/")
def catch_all():
    return send_from_directory("build", "index.html")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
