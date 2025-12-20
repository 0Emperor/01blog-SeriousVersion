import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { reason } from '../../../dto/dto';
import { Report } from '../../../service/report';
import { ToastService } from '../../../service/toast-service';

@Component({
  selector: 'app-report-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report.html',
  styleUrls: ['./report.scss']
})
export class ReportPostComponent {
  @Input() postId!: string;
  @Output() close = new EventEmitter<void>();
  selectedReason: reason | null = null; //
  private reportService = inject(Report);

  // Expose reason enum and its keys
  reasonEnum = reason;
  reasonKeys = Object.keys(reason).filter(k => isNaN(Number(k)));
  selectedReasonKey: string | null = null;
  reportMessage: string | null = null;

  getReasonText(key: string): string {
    const reasonMap: Record<string, string> = {
      SPAM: 'Spam',
      HATE_SPEECH: 'Hate Speech',
      INAPPROPRIATE_CONTENT: 'Inappropriate Content',
      BULLYING_HARASSMENT: 'Bullying/Harassment',
      INTELLECTUAL_PROPERTY: 'Intellectual Property'
    };
    return reasonMap[key] || key;
  }
  toastService = inject(ToastService)
  onSubmit() {
    if (this.selectedReason === null) return;

    // API call uses the selectedReason (which is already the enum value)
    this.reportService.report(this.postId, this.selectedReason).subscribe({
      next: () => {
        this.toastService.show('thank you for helping.', 'Report made', 'success')
        this.close.emit();
      },
      error: (err) => {
        this.reportMessage = 'An error occurred while submitting the report.';
      }
    });
  }
}