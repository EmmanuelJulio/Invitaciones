import { InvitadoResponseDto } from '../dtos/InvitadoResponseDto';

export interface ExportService {
  exportToCSV(invitados: InvitadoResponseDto[]): Promise<string>;
  exportToExcel(invitados: InvitadoResponseDto[]): Promise<Buffer>;
}