// Bonita Studio: usar en la ruta/tarea de recuperación cuando el connector falle.
// No marcar COMPLETADA ni asignar externalReference mientras el servicio no responda.

solicitudAcceso.setEstado("ERROR_INTEGRACION")
solicitudAcceso.setExternalReference(null)

return solicitudAcceso
