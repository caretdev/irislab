import iris
from flask import Flask

app = Flask(__name__)


# put this sippet ahead of all your bluprints
# blueprint can also be app~~
@app.after_request
def after_request(response):
    header = response.headers
    header["Access-Control-Allow-Origin"] = "*"
    return response


@app.route("/api/ss")
def get_ss():
    return [
        row
        for row in iris.sql.exec(
            'select Process, JobType, Device, Namespace, Routine, CPU, Glob, Pr, "User", Location from %SYS.ProcessQuery_SS()'
        )
    ]


@app.route("/api/schemas")
def get_schemas():
    return [
        row
        for row in iris.sql.exec(
            "select SCHEMA_NAME from %SQL_MANAGER.SCHEMAS(0) where TABLE_EXISTS=1"
        )
    ]


@app.route("/api/tables/", defaults={"schema": ""})
@app.route("/api/tables/<schema>")
def get_tables(schema):
    return [
        row
        for row in iris.sql.exec(f"select NAME from %SQL_MANAGER.TABLES('{schema}')")
    ]


@app.route("/api/classes/", defaults={"package": ""})
@app.route("/api/classes/<path:package>")
def get_classes(package):
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


@app.route("/api/doc/<path:doc>")
def get_doc(doc):
    doc = doc.replace("/", ".")
    stream = iris.cls("%Stream.TmpCharacter")._New()
    iris.cls("%SYSTEM.OBJ").ExportToStream(doc, stream, "-d")
    return [line for line in stream]


@app.route("/api")
def get_info():
    return {
        "zversion": iris.system.Version.GetVersion(),
        "namespace": iris.system.Process.NameSpace(),
    }


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return "You want path: %s" % path


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
