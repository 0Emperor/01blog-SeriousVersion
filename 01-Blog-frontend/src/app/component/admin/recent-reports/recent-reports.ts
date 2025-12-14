import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { reason, report, state, User } from '../../../dto/dto';
import { AdminService } from '../../../service/admin-service';
import { ConfirmationModalComponent } from "../confirm/confirm";


@Component({
  selector: 'app-recent-reports',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmationModalComponent],
  templateUrl: './recent-reports.html',
  styleUrls: ['./recent-reports.scss']
})
export class RecentreportsComponent {
  @Input() recentreports: report[] = [];
  @Input() title? = "Recent Reports"
  showConfirmModal: boolean = false;
  pendingAction: 'dismiss' | null = null;
  reportToActOn: number | null = null;
  confirmMessage: string = '';
  confirmButtonText: string = '';
  private router = inject(Router);
  private adminService = inject(AdminService);
  // Expose enum to template
  ngOnInit() {
    console.log(this.recentreports);

  }
  state = state;
  // onView(report: report) { }
  getReasonText(Reason: reason): string {
    const reasonMap: Record<reason, string> = {
      [reason.SPAM]: 'Spam',
      [reason.HATE_SPEECH]: 'Hate Speech',
      [reason.INAPPROPRIATE_CONTENT]: 'Inappropriate Content',
      [reason.BULLYING_HARASSMENT]: 'Bullying/Harassment',
      [reason.INTELLECTUAL_PROPERTY]: 'Intellectual Property'
    };
    Reason = Reason as any
    let id = 0
    switch (Reason.toString()) {
      case ("SPAM"):
        id = 0
        break
      case ("HATE_SPEECH"):
        id = 1
        break
      case ("INAPPROPRIATE_CONTENT"):
        id = 2
        break
      case ("BULLYING_HARASSMENT"):
        id = 3
        break
      case ("INTELLECTUAL_PROPERTY"):
        id = 4
        break
    }
    return reasonMap[id as reason];
  }

  onTakeAction(report: report): void {
    this.router.navigate([report.post?.postId||"/profile/"+report.user?.username]);
  }

  // 👇 Dismiss Action: Calls the API (or uses a helper in AdminService) to dismiss the report
  onDismiss(report: report, idx: number): void {

    if (report.state !== state.PENDING && report.state as any !== "PENDING") return; // Prevent double dismissal    
    this.triggerUserAction(idx);
  }
  triggerUserAction(user: number) {
    this.reportToActOn = user;
    this.pendingAction = 'dismiss';
    this.showConfirmModal = true;

    this.confirmMessage = `Dismissing a report might make it harder to find it later, Do you want to proceed?`;
    this.confirmButtonText = "Dismiss report";
  }

  // 👇 Executes the action once confirmed
  onConfirmAction() {
    this.showConfirmModal = false; // Close modal
    const report = this.recentreports[this.reportToActOn||0];
    const action = this.pendingAction;

    if (!report || !action) return;
    this.adminService.dismiss(report.id).subscribe({
      next: () => {
        report.state = state.DISMISSED
      }
    })
    this.reportToActOn = null;
    this.pendingAction = null;
  }
  getStateText(State: state): string {
    const stateMap: Record<state, string> = {
      [state.PENDING]: 'Pending',
      [state.ACTION_TAKEN]: 'Action Taken',
      [state.DISMISSED]: 'Dismissed'
    };
    State = State as any
    let id = 0;
    switch (State.toString()) {
      case ("PENDING"):
        id = 0
        break
      case ("ACTION_TAKEN"):
        id = 1
        break
      case ("DISMISSED"):
        id = 2
        break
      default:
        id = State
    }
    return stateMap[id as state];
  }

  getStateClass(State: state): string {
    const stateClassMap: Record<state, string> = {
      [state.PENDING]: 'pending',
      [state.ACTION_TAKEN]: 'action-taken',
      [state.DISMISSED]: 'dismissed'
    };
    State = State as any
    let id = 0;
    switch (State.toString()) {
      case ("PENDING"):
        id = 0
        break
      case ("ACTION_TAKEN"):
        id = 1
        break
      case ("DISMISSED"):
        id = 2
        break
      default:
        id = State
    }
    return stateClassMap[id as state];
  }

  formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  // onDelete(r:report){}
}