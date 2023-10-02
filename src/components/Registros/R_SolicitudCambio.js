﻿import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios'
import { ApiDelete, ApiGet, ApiPost } from '../../Api';
import { AlertContext, UserContext } from '../../Contexts';
import { SuccessAlert, ErrorAlert, AlertMessage } from '../Alertas';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { esES } from '@mui/x-date-pickers/locales';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DeleteConfirm, SaveConfirm } from '../Confirmaciones';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


const theme = createTheme(esES);

const SolicitudCambio = (props) => {
    const alertContext = useContext(AlertContext)
    const userContext = useContext(UserContext)
    const [loading, setLoading] = useState(true)

    const [solicitudCambioId, setSolicitudCambioId] = useState(0)
    const [usuarioId, setUsuarioId] = useState(userContext.usuarioEmpleado.EmpleadoId)
    const [turnoActualId, setTurnoActualId] = useState(0)
    const [turnoActual, setTurnoActual] = useState(null)
    const [turnoSolicitadoId, setTurnoSolicitadoId] = useState(0)
    const [turnoSolicitado, setTurnoSolicitado] = useState(null)
    const [fechaTurnoActual, setFechaTurnoActual] = useState("")
    const [fechaTurnoSolicitado, setFechaTurnoSolicitado] = useState("")
    const [fechaSolicitud, setFechaSolicitud] = useState("2001-01-01T01:01:01")
    const [motivo, setMotivo] = useState("")
    const [estadoSolicitudId, setEstadoSolicitudId] = useState(2)
    const [comentario, setComentario] = useState("")

    const [turnos, setTurnos] = useState([])
    const [fechaTurnoActualComponent, setFechaTurnoActualComponent] = useState(dayjs(new Date().toLocaleString()))
    const [fechaTurnoSolicitadoComponent, setFechaTurnoSolicitadoComponent] = useState(dayjs(new Date().toLocaleString()))

    const handleSubmit = (e) => {
        e.preventDefault()

        const turno = {
            SolicitudCambioId: solicitudCambioId,
            UsuarioId: usuarioId,
            TurnoActualId: turnoActualId,
            TurnoActual: turnoActual,
            TurnoSolicitadoId: turnoSolicitadoId,
            TurnoSolicitado: turnoSolicitado,
            FechaTurnoActual: fechaTurnoActual,
            FechaTurnoSolicitado: fechaTurnoSolicitado,
            FechaSolicitud: fechaSolicitud,
            Motivo: motivo,
            EstadoSolicitudId: estadoSolicitudId,
            Comentario: comentario
        }
        console.log(turno)

        SaveConfirm(() => {
            return new Promise((resolve, reject) => {
                ApiPost("/api/SolicitudCambio", turno)
                    .then(d => {
                        alertContext.setAlertas((al) => [...al, {
                            Alerta: SuccessAlert,
                            mensaje: AlertMessage.guardado
                        }])
                        console.log(d.response)
                        props.setIsOpen(false)
                        props.solicitarData()
                        setLoading(false)
                        resolve()
                    })
                    .catch(d => {
                        alertContext.setAlertas((al) => [...al, {
                            Alerta: ErrorAlert,
                            mensaje: AlertMessage.noGuardado
                        }])
                        console.log(d)
                        setLoading(false)
                        reject()
                    })
            })
        })
    }

    const handleDelete = () => {
        DeleteConfirm(() => {
            return new Promise((resolve, reject) => {
                ApiDelete("/api/SolicitudCambio", solicitudCambioId)
                    .then(d => {
                        alertContext.setAlertas((al) => [...al, {
                            Alerta: SuccessAlert,
                            mensaje: AlertMessage.guardado
                        }])
                        console.log(d.response)
                        props.setIsOpen(false)
                        props.solicitarData()
                        setLoading(false)
                        resolve()
                    })
                    .catch(d => {
                        alertContext.setAlertas((al) => [...al, {
                            Alerta: ErrorAlert,
                            mensaje: AlertMessage.noGuardado
                        }])
                        console.log(d)
                        setLoading(false)
                        reject()
                    })
            })
        })
    }

    const handleCambiarEstado = (estado) => {
        const solicitudCambio = {
            SolicitudCambioId: solicitudCambioId,
            UsuarioId: usuarioId,
            TurnoActualId: turnoActualId,
            TurnoSolicitadoId: turnoSolicitadoId,
            FechaTurnoActual: fechaTurnoActual,
            FechaTurnoSolicitado: fechaTurnoSolicitado,
            FechaSolicitud: fechaSolicitud,
            Motivo: motivo,
            EstadoSolicitudId: estado,
            Comentario: comentario
        }
        console.log(solicitudCambio)

        SaveConfirm(() => {
            return new Promise((resolve, reject) => {
                ApiPost("/api/SolicitudCambio/CambiarEstado", solicitudCambio)
                    .then(d => {
                        alertContext.setAlertas((al) => [...al, {
                            Alerta: SuccessAlert,
                            mensaje: AlertMessage.guardado
                        }])
                        props.setIsOpen(false)
                        props.solicitarData()
                        setLoading(false)
                        resolve()
                    })
                    .catch(d => {
                        alertContext.setAlertas((al) => [...al, {
                            Alerta: ErrorAlert,
                            mensaje: AlertMessage.noGuardado
                        }])
                        console.log(d)
                        setLoading(false)
                        reject()
                    })
            })
        })
    }

    useEffect(() => {
        if (props.entidad != null) {
            setSolicitudCambioId(props.entidad.solicitudCambioId)
            setUsuarioId(props.entidad.usuarioId)
            setTurnoActualId(props.entidad.turnoActualId)
            setTurnoActual(props.entidad.turnoActual)
            setTurnoSolicitadoId(props.entidad.turnoSolicitadoId)
            setTurnoSolicitado(props.entidad.turnoSolicitado)
            setFechaTurnoActualComponent(dayjs(props.entidad.fechaTurnoActual))
            setFechaTurnoSolicitadoComponent(dayjs(props.entidad.fechaTurnoSolicitado))
            setFechaSolicitud(props.entidad.fechaSolicitud)
            setMotivo(props.entidad.motivo)
            setEstadoSolicitudId(props.entidad.estadoSolicitudId)
            setComentario(props.entidad.comentario)
        } else {
            setSolicitudCambioId(0)
            setUsuarioId(userContext.usuarioEmpleado.EmpleadoId)
            setTurnoActualId(0)
            setTurnoActual(null)
            setTurnoSolicitadoId(0)
            setTurnoSolicitado(null)
            setFechaTurnoActualComponent(dayjs(new Date().toLocaleString()))
            setFechaTurnoSolicitadoComponent(dayjs(new Date().toLocaleString()))
            setFechaSolicitud("2001-01-01T01:01:01")
            setMotivo("")
            setEstadoSolicitudId(2)
            setComentario("")
        }
    }, [props.entidad])

    useEffect(() => {
        let anio = fechaTurnoActualComponent.$y
        let mes = (fechaTurnoActualComponent.$M < 10) ? "0" + (fechaTurnoActualComponent.$M + 1) : fechaTurnoActualComponent.$M + 1
        let dia = (fechaTurnoActualComponent.$D < 10) ? "0" + fechaTurnoActualComponent.$D.toString() : fechaTurnoActualComponent.$D.toString()
        let hora = (fechaTurnoActualComponent.$H < 10) ? "0" + fechaTurnoActualComponent.$H.toString() : fechaTurnoActualComponent.$H.toString()
        let minuto = (fechaTurnoActualComponent.$m < 10) ? "0" + fechaTurnoActualComponent.$m.toString() : fechaTurnoActualComponent.$m.toString()
        let segundo = (fechaTurnoActualComponent.$s < 10) ? "0" + fechaTurnoActualComponent.$s.toString() : fechaTurnoActualComponent.$s.toString()
        setFechaTurnoActual(anio + "-" + mes + "-" + dia + "T" + hora + ":" + minuto + ":" + segundo)
    }, [fechaTurnoActualComponent])

    useEffect(() => {
        let anio = fechaTurnoSolicitadoComponent.$y
        let mes = (fechaTurnoSolicitadoComponent.$M < 10) ? "0" + (fechaTurnoSolicitadoComponent.$M + 1) : fechaTurnoSolicitadoComponent.$M + 1
        let dia = (fechaTurnoSolicitadoComponent.$D < 10) ? "0" + fechaTurnoSolicitadoComponent.$D.toString() : fechaTurnoSolicitadoComponent.$D.toString()
        let hora = (fechaTurnoSolicitadoComponent.$H < 10) ? "0" + fechaTurnoSolicitadoComponent.$H.toString() : fechaTurnoSolicitadoComponent.$H.toString()
        let minuto = (fechaTurnoSolicitadoComponent.$m < 10) ? "0" + fechaTurnoSolicitadoComponent.$m.toString() : fechaTurnoSolicitadoComponent.$m.toString()
        let segundo = (fechaTurnoSolicitadoComponent.$s < 10) ? "0" + fechaTurnoSolicitadoComponent.$s.toString() : fechaTurnoSolicitadoComponent.$s.toString()
        setFechaTurnoSolicitado(anio + "-" + mes + "-" + dia + "T" + hora + ":" + minuto + ":" + segundo)
    }, [fechaTurnoSolicitadoComponent])


    const solicitarData = () => {
        ApiGet("/api/Turno")
            .then(d => {
                setTurnos(d.response)
            })
            .catch(d => {
                alertContext.setAlertas((al) => [...al, {
                    Alerta: ErrorAlert,
                    mensaje: AlertMessage.noCargado
                }])
                console.log(d)
            })
    }

    useEffect(() => {
        if (turnoActualId > 0) {
            setTurnoActual(turnos.find((turno) => turno.turnoId == turnoActualId))
        }
    }, [turnoActualId])

    useEffect(() => {
        if (turnoSolicitadoId > 0) {
            setTurnoSolicitado(turnos.find((turno) => turno.turnoId == turnoSolicitadoId))
        }
    }, [turnoSolicitadoId])

    useEffect(() => {
        solicitarData();
    }, [])

    return (
        <div>
            <Modal isOpen={props.isOpen} fullscreen={true} toggle={() => props.setIsOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <ModalHeader toggle={() => props.setIsOpen(false)}>
                        <h1>Registro de Solicitud de Cambio</h1>
                    </ModalHeader>
                    <ModalBody>
                        <ThemeProvider theme={theme}>
                            <div className="row d-flex justify-content-center">
                                <div className="col-md-4">
                                    <div className="text-danger"></div>
                                    <div className="form-group">
                                        <label className="control-label">Turno Actual</label>
                                        <select value={turnoActualId} className="form-select" onChange={(e) => setTurnoActualId(e.target.value)}>
                                            <option value="0" disabled></option>
                                            {turnos.map((turno, key) => {
                                                return (
                                                    <option key={key} selected={(turno.turnoId == turnoActualId)} value={turno.turnoId}>{turno.tipoTurno.descripcion + " - " + turno.usuario.nombre + " " + turno.usuario.apellido}</option>
                                                )
                                            })}
                                        </select>
                                        <span className="text-danger"></span>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">Turno Solicitado</label>
                                        <select value={turnoSolicitadoId} className="form-select" onChange={(e) => setTurnoSolicitadoId(e.target.value)}>
                                            <option value="0" disabled></option>
                                            {turnos.map((turno, key) => {
                                                return (
                                                    <option key={key} selected={(turno.turnoId == turnoSolicitadoId)} value={turno.turnoId}>{turno.tipoTurno.descripcion + " - " + turno.usuario.nombre + " " + turno.usuario.apellido}</option>
                                                )
                                            })}
                                        </select>
                                        <span className="text-danger"></span>
                                    </div>

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <div className="form-group">
                                            <label className="control-label">Fecha del Turno Actual</label>
                                            <DemoItem>
                                                <MobileDatePicker className="form-control" id="FechaActual" name="FechaActual" format="DD/MM/YYYY" value={fechaTurnoActualComponent} onChange={(e) => setFechaTurnoActualComponent(e)} />
                                            </DemoItem>
                                            <span className="text-danger"></span>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label">Fecha del Turno Solicitado</label>
                                            <DemoItem>
                                                <MobileDatePicker className="form-control" id="FechaSolicitado" name="FechaSolicitado" format="DD/MM/YYYY" value={fechaTurnoSolicitadoComponent} onChange={(e) => setFechaTurnoSolicitadoComponent(e)} />
                                            </DemoItem>
                                            <span className="text-danger"></span>
                                        </div>
                                    </LocalizationProvider>
                                    <div className="form-group">
                                        <label className="control-label">Motivo</label>
                                        <input className="form-control" id="Motivo" name="Motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
                                        <span className="text-danger"></span>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label">Comentario</label>
                                        <input className="form-control" id="Comentario" name="Comentario" value={comentario} onChange={(e) => setComentario(e.target.value)} />
                                        <span className="text-danger"></span>
                                    </div>
                                </div>
                            </div>
                        </ThemeProvider>
                    </ModalBody>
                    <ModalFooter>
                        <div className="form-group">
                            <input type="submit" className="btn btn-primary" />
                        </div>
                        {(props.entidad != null) ?
                            <>
                                <Button color="success" onClick={() => {
                                    setEstadoSolicitudId(1)
                                    handleCambiarEstado(1)
                                }} >Aprobar</Button>
                                <Button color="info" onClick={() => {
                                    setEstadoSolicitudId(3)
                                    handleCambiarEstado(3)
                                }}>Iniciar Proceso</Button>
                                <Button color="dark" onClick={() => {
                                    setEstadoSolicitudId(6)
                                    handleCambiarEstado(6)
                                }}>Invalidar</Button>
                                <Button color="danger" onClick={() => {
                                    setEstadoSolicitudId(5)
                                    handleCambiarEstado(5)
                                }}>Rechazar</Button>
                                <Button color="warning" onClick={() => {
                                    setEstadoSolicitudId(4)
                                    handleCambiarEstado(4)
                                }}>Cancelar Solicitud</Button>
                                <Button color="danger" onClick={handleDelete}>Eliminar</Button>
                            </>
                            :
                            <></>
                        }
                        <Button color="secondary" onClick={() => props.setIsOpen(false)}>Cancel</Button>
                    </ModalFooter>
                </form>
            </Modal>
        </div>
    )
}

export default SolicitudCambio