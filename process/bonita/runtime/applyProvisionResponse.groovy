import groovy.json.JsonSlurper

// Bonita Studio: procesa la respuesta del REST connector después de POST /provision.
// Sustituye `responseBody` por el nombre exacto de la salida Body ofrecida por
// el connector REST de la versión de Bonita Studio instalada.

def json = new JsonSlurper().parseText(responseBody as String)

if (json.status != "PROVISIONED") {
    throw new IllegalStateException("Respuesta inesperada del servicio: ${json.status}")
}

if (!json.external_reference) {
    throw new IllegalStateException("La respuesta no contiene external_reference")
}

solicitudAcceso.setExternalReference(json.external_reference as String)
solicitudAcceso.setEstado("COMPLETADA")
solicitudAcceso.setClosedAt(new Date())

return solicitudAcceso
