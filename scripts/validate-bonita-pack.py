from __future__ import annotations

import json
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "process" / "bonita" / "runtime"
BPMN = ROOT / "process" / "bpmn" / "solicitud-acceso-final.bpmn"

EXPECTED_STATES = {
    "PENDIENTE",
    "EN_REVISION",
    "APROBADA",
    "RECHAZADA",
    "PROVISIONANDO",
    "COMPLETADA",
    "ERROR_INTEGRACION",
}
EXPECTED_BDM_FIELDS = {
    "requestId",
    "nombreSolicitante",
    "correo",
    "departamento",
    "sistema",
    "nivelAcceso",
    "justificacion",
    "estado",
    "aprobada",
    "comentarioAprobador",
    "externalReference",
    "createdAt",
    "closedAt",
}
EXPECTED_START_INPUTS = {
    "nombreSolicitante",
    "correo",
    "departamento",
    "sistema",
    "nivelAcceso",
    "justificacion",
}
EXPECTED_APPROVAL_INPUTS = {"aprobada", "comentarioAprobador"}


def load_json(name: str) -> dict:
    path = RUNTIME / name
    if not path.exists():
        raise AssertionError(f"Missing runtime artifact: {path.relative_to(ROOT)}")
    return json.loads(path.read_text(encoding="utf-8"))


def validate_manifest() -> None:
    manifest = load_json("implementation-manifest.json")
    assert manifest["process"]["businessVariable"] == "solicitudAcceso"
    assert manifest["bdm"]["package"] == "com.jmsoftware.bonitasoft.model"
    assert manifest["bdm"]["object"] == "SolicitudAcceso"

    fields = {field["name"] for field in manifest["bdm"]["attributes"]}
    assert fields == EXPECTED_BDM_FIELDS, f"BDM mismatch: {fields ^ EXPECTED_BDM_FIELDS}"

    states = set(manifest["states"])
    assert states == EXPECTED_STATES, f"State mismatch: {states ^ EXPECTED_STATES}"

    assert set(manifest["contracts"]["start"]) == EXPECTED_START_INPUTS
    assert set(manifest["contracts"]["approval"]) == EXPECTED_APPROVAL_INPUTS

    integration = manifest["integration"]
    assert integration["method"] == "POST"
    assert integration["url"] == "http://localhost:8000/provision"
    assert integration["successStatus"] == "PROVISIONED"
    assert integration["bdmReferenceField"] == "externalReference"


def validate_contracts_and_connector() -> None:
    start = load_json("start-contract.json")
    approval = load_json("approval-contract.json")
    connector = load_json("rest-connector.json")
    scenarios = load_json("e2e-scenarios.json")

    assert {item["name"] for item in start["inputs"]} == EXPECTED_START_INPUTS
    assert {item["name"] for item in approval["inputs"]} == EXPECTED_APPROVAL_INPUTS
    assert approval["actor"] == "Aprobador"

    assert connector["method"] == "POST"
    assert connector["url"] == "http://localhost:8000/provision"
    assert connector["expected"]["status"] == "PROVISIONED"
    assert connector["mapping"]["external_reference"] == "solicitudAcceso.externalReference"

    ids = {scenario["id"] for scenario in scenarios["scenarios"]}
    assert ids == {"E2E-01", "E2E-02", "E2E-03", "E2E-04", "E2E-05"}

    for script_name in [
        "initializeSolicitudAcceso.groovy",
        "applyDecision.groovy",
        "buildProvisionPayload.groovy",
        "applyProvisionResponse.groovy",
        "markIntegrationError.groovy",
    ]:
        assert (RUNTIME / script_name).exists(), f"Missing Groovy script: {script_name}"


def validate_bpmn() -> None:
    if not BPMN.exists():
        raise AssertionError(f"Missing BPMN: {BPMN.relative_to(ROOT)}")

    tree = ET.parse(BPMN)
    root = tree.getroot()
    ns = {"bpmn": "http://www.omg.org/spec/BPMN/20100524/MODEL"}
    process = root.find("bpmn:process", ns)
    assert process is not None
    assert process.attrib["id"] == "Process_SolicitudAcceso_Final"

    ids = {element.attrib.get("id") for element in process.iter() if element.attrib.get("id")}
    required_ids = {
        "StartEvent_Solicitud",
        "Task_Validar",
        "Task_Aprobar",
        "Gateway_Decision",
        "Task_Preparar",
        "Task_Provisionar",
        "BoundaryError_Provisionar",
        "Task_Error",
        "Task_Completar",
        "Task_Rechazar",
        "EndEvent_Aprobada",
        "EndEvent_Rechazada",
        "Flow_Approved",
        "Flow_Rejected",
        "Flow_Error",
        "Flow_Retry",
    }
    missing = required_ids - ids
    assert not missing, f"BPMN elements missing: {sorted(missing)}"

    boundary = process.find("bpmn:boundaryEvent", ns)
    assert boundary is not None
    assert boundary.attrib["attachedToRef"] == "Task_Provisionar"


def main() -> int:
    checks = [validate_manifest, validate_contracts_and_connector, validate_bpmn]
    for check in checks:
        check()
        print(f"PASS {check.__name__}")
    print("Bonita runtime pack is internally consistent.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (AssertionError, KeyError, json.JSONDecodeError, ET.ParseError) as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)
