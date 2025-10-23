import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualsPreviewComponent } from './mutuals-preview-component';

describe('MutualsPreviewComponent', () => {
  let component: MutualsPreviewComponent;
  let fixture: ComponentFixture<MutualsPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MutualsPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MutualsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
