import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface MediaItem {
    type: 'image' | 'video';
    url: string;
}

export interface LightboxData {
    media: MediaItem[];
    currentIndex: number;
}

@Component({
    selector: 'app-media-lightbox',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    templateUrl: './media-lightbox.component.html',
    styleUrls: ['./media-lightbox.component.scss']
})
export class MediaLightboxComponent {
    currentIndex: number;
    media: MediaItem[];

    constructor(
        public dialogRef: MatDialogRef<MediaLightboxComponent>,
        @Inject(MAT_DIALOG_DATA) public data: LightboxData
    ) {
        this.media = data.media;
        this.currentIndex = data.currentIndex;
    }

    get currentMedia(): MediaItem {
        return this.media[this.currentIndex];
    }

    get hasPrevious(): boolean {
        return this.currentIndex > 0;
    }

    get hasNext(): boolean {
        return this.currentIndex < this.media.length - 1;
    }

    previous(): void {
        if (this.hasPrevious) {
            this.currentIndex--;
        }
    }

    next(): void {
        if (this.hasNext) {
            this.currentIndex++;
        }
    }

    close(): void {
        this.dialogRef.close();
    }

    onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowLeft':
                this.previous();
                break;
            case 'ArrowRight':
                this.next();
                break;
            case 'Escape':
                this.close();
                break;
        }
    }
}
