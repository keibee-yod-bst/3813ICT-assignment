import { TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component'; // Import the standalone component
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProfileComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent, HttpClientTestingModule], // Use imports instead of declarations
    }).compileComponents();
  });

  it('should create the profile component', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should set the username correctly from the service', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    const component = fixture.componentInstance;
    component.username = 'testuser';
    fixture.detectChanges();
    expect(component.username).toBe('testuser');
  });
});
