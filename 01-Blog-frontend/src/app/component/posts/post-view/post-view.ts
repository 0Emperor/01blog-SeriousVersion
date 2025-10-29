import { Component, inject, Input } from '@angular/core';
import { CommentArea } from '../../comments/comment-area/comment-area';
import { MarkdownModule } from 'ngx-markdown';
import { Post } from '../../../dto/dto';
import { PostService } from '../../../service/post';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { UserHeaderComponent } from "../../users/user-header/user-header";
import { TimeAgoPipe } from '../../../pipe/time-ago-pipe';
import { UserStore } from '../../../service/user';
import { AdminService } from '../../../service/admin-service';
import { ReportPostComponent } from '../../report/report/report';
import { ConfirmationModalComponent } from "../../admin/confirm/confirm";

@Component({
  selector: 'app-post-view',
  imports: [CommentArea, ReportPostComponent, MarkdownModule, UserHeaderComponent, TimeAgoPipe, RouterLink, ConfirmationModalComponent],
  templateUrl: './post-view.html',
  styleUrl: './post-view.scss'
})
export class PostView {
  post: Post | null = null;
  loading = false;
  httpPost = inject(PostService)
  private route = inject(ActivatedRoute);
  private router = inject(Router)
  current = inject(UserStore)
  adminService= inject(AdminService)
  openReportModal: boolean = false;
  showConfirmModal: boolean = false;
  pendingAction: 'delete' | 'hide' | 'unhide' | null = null;
  confirmMessage: string = '';
  confirmButtonText: string = '';
  ngOnInit() {
    this.route.paramMap.pipe(
      tap(() => this.loading = true),
      switchMap(params => {
        const postId = params.get('id');
        if (postId) {
          return this.httpPost.getPostById(postId);
        }
        return new Promise(() => { });
      })
    ).subscribe({
      next: (data: any) => {
        this.post = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  editNavigate(){
    this.router.navigate(["edit",this.post?.postId])

  }
  triggerAdminAction(action: 'delete' | 'hide' | 'unhide') {
    if (!this.post) return;
    this.pendingAction = action;
    this.showConfirmModal = true;

    switch (action) {
      case 'delete':
        this.confirmMessage = "Are you sure you want to permanently delete this post? This action cannot be undone.";
        this.confirmButtonText = "Delete Permanently";
        break;
      case 'hide':
        this.confirmMessage = "Are you sure you want to hide this post? It will be invisible to non-admin users.";
        this.confirmButtonText = "Hide Post";
        break;
      case 'unhide':
        this.confirmMessage = "Are you sure you want to unhide this post? It will become visible to all users.";
        this.confirmButtonText = "Unhide Post";
        break;
    }
  }
  onConfirmAction() {
    this.showConfirmModal = false; // Close modal first
    if (!this.post || !this.pendingAction) return;

    const postId = this.post.postId;
    let apiCall;
    
    // Choose API call based on pendingAction
    switch (this.pendingAction) {
      case 'delete':
        apiCall = this.httpPost.deletePost(postId); // Assuming httpPost.delete handles post deletion
        break;
      case 'hide':
        apiCall = this.adminService.hide(postId);
        break;
      case 'unhide':
        apiCall = this.adminService.unhide(postId);
        break;
    }

    apiCall.subscribe({
        next: () => {
            // Update local state or navigate
            if (this.pendingAction === 'delete') {
                this.router.navigate(["home"]);
            } else if (this.post) {
                this.post.hidden = this.pendingAction === 'hide';
            }
        },
        error: (err) => console.error(`Error performing ${this.pendingAction} action:`, err)
    });

    this.pendingAction = null; // Reset
  }
  
  delete() {
    this.triggerAdminAction('delete');
  }
  hide() {
    this.triggerAdminAction('hide');
  }
  unHide() {
    this.triggerAdminAction('unhide');
  }
}
