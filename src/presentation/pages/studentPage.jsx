import React, {useState} from "react";
import {Users, Search, Award, CheckCircle} from 'lucide-react';
import { LetterAvatar } from '../components/atoms/LetterAvatar';

export function StudensPage({ enrollments = [] }){
    const [serch, setSearch] = useState('');

    const filtered = enrollments.filter(e =>
        e.studentName.toLowerCase().includes(serch.toLowerCase()) || e.courseTitle.toLowerCase().includes(Search.toLowerCase())
    );

    return (
        <div className="car animate-fade-in" style={{padding: '1.5rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0}}>Alumnos inscritos y progreso</h2>
                    <p style={{ color: '#878a99', fontSize: '13px', margin: 0}}>Monitoreo de avance formativo en tiempo real.</p>
                </div>
                <div style={{ width: '300px'}}>
                    <input className="form-control"
                    placeholder="Buscar por alumno o curso"
                    value={search}
                    onChange={e => setSearch(e.target.value)}/>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table" style={{ width: '100%', borderCollapse: 'collapse'}}>
                    <thread>
                        <tr style={{borderBottom: '2px solid #e9ebec', textAling: 'left', color: '878a99', fontSize: '12px'}}>
                            <th style={{ padding: '0.75rem'}}>ESTUDIANTES</th>
                            <th style={{ padding: '0.75rem'}}>CURSOS</th>
                            <th style={{ padding: '0.75rem'}}>PROGRESO</th>
                            <th style={{ padding: '0.75rem'}}>CLSES VISTAS</th>
                            <th style={{ padding: '0.75rem'}}>ESTADO</th>
                        </tr>
                    </thread>
                    <tbody>
                        {filtered.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #e9ebec', fontSize: '13px'}}>
                                <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                                    <LetterAvatar name={item.studentName} size={36} />
                                    <div>
                                        <div style={{ fontWeight: 600}}>{item.studentName}</div>
                                        <div style={{ fontSize: '11px', color:'#878a99'}}>{item.email}</div>
                                    </div>
                                </td>
                                <td style={{ padding: '0.75rem', fontWeight: 500, color: '#405189'}}>{item.courseTitle}</td>
                                <td style={{ padding: '0.75rem', width:'220px'}}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                        <div style={{ flex: 1, height: 8, background: 'e9ebec', borderRadius: 4, overflow: 'hidden'}}>
                                            <div style={{ width: `${item.progressPercentage}%`, height: '100%', background: item.isGraduated ? 'var(--color-primary)' : '#405289'}}/>
                                        </div>
                                        <span style={{ fontSize: '12px', fontWeight: 600}}>{item.progressPercentage}%</span>
                                    </div>
                                </td>
                                <td style={{ padding: '0.75rem'}}>{item.completedLessons} / {item.totalLessons} lecciones</td>
                                <td style={{ padding: '0.75rem'}}>{item.isGraduated ? (
                                    <span className="badge rounded-pill badge-soft-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px'}}>
                                        <CheckCircle size={12}/> Completado</span>
                                ) : (
                                    <span className="badge rounded-pill badge-soft-primary">En curso</span>
                                )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}