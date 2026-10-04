import com.jmsoftware.bonitasoft.model.SolicitudAcceso

// Bonita Studio: expresión de inicialización de la business variable solicitudAcceso.
// Entradas esperadas: requestInput.nombreSolicitante, correo, departamento,
// sistema, nivelAcceso y justificacion.

def solicitud = new SolicitudAcceso()
solicitud.setRequestId(
    "SA-" + java.util.UUID.randomUUID()
        .toString()
        .replace("-", "")
        .substring(0, 8)
        .toUpperCase()
)
solicitud.setNombreSolicitante(requestInput.nombreSolicitante as String)
solicitud.setCorreo(requestInput.correo as String)
solicitud.setDepartamento(requestInput.departamento as String)
solicitud.setSistema(requestInput.sistema as String)
solicitud.setNivelAcceso(requestInput.nivelAcceso as String)
solicitud.setJustificacion(requestInput.justificacion as String)
solicitud.setEstado("PENDIENTE")
solicitud.setAprobada(null)
solicitud.setComentarioAprobador(null)
solicitud.setExternalReference(null)
solicitud.setCreatedAt(new Date())
solicitud.setClosedAt(null)

return solicitud
