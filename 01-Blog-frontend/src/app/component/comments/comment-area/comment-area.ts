import { Component, inject, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommentAdd } from "../comment-add/comment-add";
import { CommentCard } from '../comment-card/comment-card';
import { Comment, Post, User } from '../../../dto/dto';
import { CommentShare } from '../../../service/comment-share';
import { finalize } from 'rxjs/operators';
import { Subject, takeUntil } from 'rxjs';
import { CommentS } from '../../../service/comment';

@Component({
  selector: 'app-comment-area',
  imports: [CommentAdd, CommentCard],
  templateUrl: './comment-area.html',
  styleUrl: './comment-area.scss'
})
export class CommentArea implements OnInit, OnDestroy {
  @Input() pid!: string;

  private commentSvc = inject(CommentS);
  private commentReceive = inject(CommentShare);
  private destroy$ = new Subject<void>();

  comments: Comment[] = [];
  private page = 1;               // 1-based for UI
  private size = 10;
  loading = false;
  finished = false;

  ngOnInit() {
    this.loadPage();                       // first chunk
    this.listenForNewComment();            // real-time add
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPage(): void {    
    this.loading = true;
    this.commentSvc
      .getCommentsPerPost(this.page, this.size, this.pid)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe(({ comment, hasNext }) => {
        this.comments.push(...comment);   
        console.log(hasNext);
        
        this.finished = !hasNext;         // boolean from backend
        if (!this.finished) this.page++;  // only advance when more exists
      });
  }
  /* ---------- real-time add via service ---------- */
  private listenForNewComment(): void {
    this.commentReceive.currentComment
      .pipe(takeUntil(this.destroy$))
      .subscribe(cmt => {
        if (!cmt) return;
        this.comments = [cmt, ...this.comments];
        this.commentReceive.changeMessage(null)
      });
  }
  @HostListener('window:scroll', [])
  onScroll() {
    // Check if the user is near the bottom of the page (e.g., within 200px)
    const tolerance = 200;
    const scrollPosition = window.scrollY + window.innerHeight;
    const totalHeight = document.documentElement.scrollHeight;    
    // Trigger next page if near bottom AND not currently loading AND not finished
    if (scrollPosition > totalHeight - tolerance && !this.loading && !this.finished) {
    this.loadPage()
    }
  }
  onEdit(comment: Comment, newText: string) {
    this.commentSvc.editComment(comment.id, newText).subscribe((d) => {
      console.log(d)
      comment.content = newText;
    });
  }
  
  onDelete(comment: Comment) {
    this.commentSvc.deleteComment(comment.id).subscribe(() => {
      this.comments = this.comments.filter(c => c.id !== comment.id);
    });
  }
}