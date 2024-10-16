// chat.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { FormsModule } from '@angular/forms';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatComponent],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the chat component', () => {
    expect(component).toBeTruthy();
  });

  it('should clear the input field after sending a message', () => {
    component.messageInput = 'Hello!';
    component.sendMessage();
    expect(component.messageInput).toBe('');
  });
});
