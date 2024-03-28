docker build --tag harbor.telecom.kz/cpr-resource-order-fe/resource-design-fe:version0.2 . && ^
docker login harbor.telecom.kz && ^
docker image push harbor.telecom.kz/cpr-resource-order-fe/resource-design-fe:version0.2
