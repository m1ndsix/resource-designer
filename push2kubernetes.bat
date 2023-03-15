docker build --tag alma-kube-registry.cdn.telecom.kz/cpr-resource-order-fe/resource-design-fe:version0.1 . && ^
docker login alma-kube-registry.cdn.telecom.kz && ^
docker image push alma-kube-registry.cdn.telecom.kz/cpr-resource-order-fe/resource-design-fe:version0.1
