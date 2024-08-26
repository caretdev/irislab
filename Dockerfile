FROM containers.intersystems.com/intersystems/iris-community:2024.1

RUN --mount=type=bind,src=.,dst=/home/irisowner/irislab <<EOT
wget https://pm.community.intersystems.com/packages/zpm/latest/installer -O /tmp/zpm.xml
iris start iris
cat <<"EOF" | iris session iris -U %SYS
do $system.OBJ.Load("/tmp/zpm.xml", "ck")
zpm "load /home/irisowner/irislab -v"
halt
EOF
iris stop iris quietly
EOT