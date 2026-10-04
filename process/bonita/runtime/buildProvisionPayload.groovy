import groovy.json.JsonOutput

// Bonita Studio: payload del REST POST /provision.
// Ejecutar cuando solicitudAcceso.estado haya sido actualizado a PROVISIONANDO.

return JsonOutput.toJson([
    request_id  : solicitudAcceso.requestId,
    user_email  : solicitudAcceso.correo,
    system      : solicitudAcceso.sistema,
    access_level: solicitudAcceso.nivelAcceso
])
