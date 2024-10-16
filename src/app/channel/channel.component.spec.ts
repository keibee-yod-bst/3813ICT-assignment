import { TestBed } from '@angular/core/testing';
import { ChannelComponent } from './channel.component'; // Import the standalone component
import { RouterTestingModule } from '@angular/router/testing';

describe('ChannelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelComponent, RouterTestingModule], // Use imports instead of declarations
    }).compileComponents();
  });

  it('should create the channel component', () => {
    const fixture = TestBed.createComponent(ChannelComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should contain at least one channel', () => {
    const fixture = TestBed.createComponent(ChannelComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('li').length).toBeGreaterThan(0);
  });
});
