// Bonita Studio: operaciones de salida de la Human Task "Revisar y decidir solicitud".
// Entradas esperadas: decisionInput.aprobada y decisionInput.comentarioAprobador.

solicitudAcceso.setAprobada(decisionInput.aprobada as Boolean)
solicitudAcceso.setComentarioAprobador(decisionInput.comentarioAprobador as String)

if (decisionInput.aprobada == true) {
    solicitudAcceso.setEstado("APROBADA")
} else {
    solicitudAcceso.setEstado("RECHAZADA")
    solicitudAcceso.setClosedAt(new Date())
}

return solicitudAcceso
