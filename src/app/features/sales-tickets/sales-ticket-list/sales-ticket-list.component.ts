import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SalesTicketService } from '../../../core/services/sales-ticket.service';
import { SalesTicket } from '../../../core/models/sales-ticket.model';
import { SalesTicketDialogComponent } from './sales-ticket-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-sales-ticket-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Tickets de Venta</h2>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Nuevo Ticket
        </button>
      </div>

      <div class="table-responsive">
        <table mat-table [dataSource]="salesTickets" class="mat-elevation-z8">
          <!-- ID Column -->
          <ng-container matColumnDef="ticketId">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let element">{{element.ticketId}}</td>
          </ng-container>

          <!-- Fecha Column -->
          <ng-container matColumnDef="saleDate">
            <th mat-header-cell *matHeaderCellDef>Fecha</th>
            <td mat-cell *matCellDef="let element">{{element.saleDate | date:'short'}}</td>
          </ng-container>

          <!-- Total Column -->
          <ng-container matColumnDef="totalPayment">
            <th mat-header-cell *matHeaderCellDef>Total</th>
            <td mat-cell *matCellDef="let element">{{element.totalPayment | currency:'PEN':'symbol'}}</td>
          </ng-container>

          <!-- Delivery Column -->
          <ng-container matColumnDef="delivery">
            <th mat-header-cell *matHeaderCellDef>Delivery</th>
            <td mat-cell *matCellDef="let element">{{element.delivery}}</td>
          </ng-container>

          <!-- Estado Column -->
          <ng-container matColumnDef="orderStatusType">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let element">{{element.orderStatusType?.name}}</td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button color="accent" (click)="openDialog(element, true)" matTooltip="Ver Detalle">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button color="primary" (click)="openDialog(element)" matTooltip="Editar">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteSalesTicket(element)" matTooltip="Eliminar">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>

      <div *ngIf="loading" class="d-flex justify-content-center mt-4">
        <mat-spinner></mat-spinner>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .table-responsive {
      margin-top: 20px;
    }
    table {
      width: 100%;
    }
    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
  `]
})
export class SalesTicketListComponent implements OnInit {
  salesTickets: SalesTicket[] = [];
  displayedColumns: string[] = ['ticketId', 'saleDate', 'totalPayment', 'delivery', 'orderStatusType', 'actions'];
  loading = false;

  constructor(
    private salesTicketService: SalesTicketService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSalesTickets();
  }

  loadSalesTickets(): void {
    this.loading = true;
    this.salesTicketService.getSalesTickets().subscribe({
      next: (data) => {
        console.log('Data received from sales ticket service:', data);
        this.salesTickets = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading sales tickets:', error);
        this.loading = false;
      }
    });
  }

  openDialog(salesTicket?: SalesTicket, isViewMode: boolean = false): void {
    if (salesTicket) {
      this.loading = true;
      this.salesTicketService.getSalesTicket(salesTicket.ticketId!).subscribe({
        next: (detailedTicket) => {
          this.loading = false;
          const dialogRef = this.dialog.open(SalesTicketDialogComponent, {
            width: '800px',
            data: {
              title: isViewMode ? 'Detalle del Ticket' : 'Editar Ticket de Venta',
              salesTicket: detailedTicket,
              isEdit: !isViewMode,
              isView: isViewMode
            }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result && !isViewMode) {
              if (result.ticketId) {
                console.log('Updating sales ticket with data:', result);
                this.salesTicketService.updateSalesTicket(result.ticketId, result).subscribe({
                  next: () => { this.loadSalesTickets(); },
                  error: (error) => { console.error('Error updating sales ticket:', error); }
                });
              }
            }
          });
        },
        error: (error) => {
          this.loading = false;
          console.error('Error loading sales ticket details:', error);
        }
      });
    } else {
      const dialogRef = this.dialog.open(SalesTicketDialogComponent, {
        width: '800px',
        data: {
          title: 'Nuevo Ticket de Venta',
          salesTicket: {},
          isEdit: false,
          isView: false
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed with result:', result);
        if (result) {
          console.log('Attempting to create sales ticket with data:', result);
          this.salesTicketService.createSalesTicket(result).subscribe({
            next: () => {
              console.log('Sales ticket created successfully. Loading list...');
              this.loadSalesTickets();
            },
            error: (error) => {
              console.error('Error creating sales ticket:', error);
            }
          });
        }
      });
    }
  }

  deleteSalesTicket(salesTicket: SalesTicket): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar eliminación',
        message: '¿Está seguro de que desea eliminar este ticket de venta?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && salesTicket.ticketId) {
        this.salesTicketService.deleteSalesTicket(salesTicket.ticketId).subscribe({
          next: () => {
            this.loadSalesTickets();
          },
          error: (error) => {
            console.error('Error deleting sales ticket:', error);
          }
        });
      }
    });
  }
} 