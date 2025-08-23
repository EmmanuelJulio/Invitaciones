#!/usr/bin/env ts-node

import * as XLSX from 'xlsx';
import * as path from 'path';

// Datos de ejemplo
const invitadosEjemplo = [
  {
    nombre: 'Juan Carlos Pérez',
    telefono: '+573001234567',
    mensaje: 'Esperamos contar con tu presencia en este día especial'
  },
  {
    nombre: 'María Elena González',
    telefono: '+573007654321',
    mensaje: 'Tu amistad ha sido muy importante durante estos años'
  },
  {
    nombre: 'Carlos Alberto Rodríguez',
    telefono: '+573009876543',
    mensaje: ''
  },
  {
    nombre: 'Ana Sofía Martínez',
    telefono: '3005551234',
    mensaje: 'Sería un honor contar con tu presencia'
  },
  {
    nombre: 'Diego Fernando López',
    telefono: '+57 300 555 6789',
    mensaje: 'Queremos celebrar contigo este logro'
  }
];

function crearExcelEjemplo(): void {
  console.log('📝 Creando archivo Excel de ejemplo...');

  // Crear nuevo workbook
  const workbook = XLSX.utils.book_new();
  
  // Crear worksheet con los datos de ejemplo
  const worksheet = XLSX.utils.json_to_sheet(invitadosEjemplo);
  
  // Ajustar ancho de columnas
  const columnWidths = [
    { wch: 25 }, // nombre
    { wch: 20 }, // telefono
    { wch: 50 }  // mensaje
  ];
  worksheet['!cols'] = columnWidths;
  
  // Agregar worksheet al workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Invitados');
  
  // Guardar archivo
  const rutaArchivo = path.join(__dirname, '../invitados-ejemplo.xlsx');
  XLSX.writeFile(workbook, rutaArchivo);
  
  console.log(`✅ Archivo creado: ${rutaArchivo}`);
  console.log(`📋 Contiene ${invitadosEjemplo.length} invitados de ejemplo`);
  console.log('\nColumnas del archivo:');
  console.log('- nombre: Nombre completo del invitado');
  console.log('- telefono: Número de teléfono (acepta varios formatos)');
  console.log('- mensaje: Mensaje personalizado opcional');
  
  console.log('\n🚀 Para enviar las invitaciones ejecuta:');
  console.log('npm run enviar-invitaciones invitados-ejemplo.xlsx');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  crearExcelEjemplo();
}