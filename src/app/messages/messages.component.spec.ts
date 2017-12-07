import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { MessagesComponent } from './messages.component';
import { MessageService } from '../message.service';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let rootEl:      HTMLElement;
  let de:      DebugElement;
  let el:      HTMLElement;

  let messageService;
  let addSpy;
  let clearSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesComponent ],
      providers: [ MessageService ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;

    rootEl = fixture.debugElement.nativeElement;
    messageService = TestBed.get(MessageService);
  });

  it('should created message component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not render any html if no messages are stored', () => {
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('div'));

    expect(de).toBeNull();
    expect(messageService.messages.length).toBe(0);
  });

  it('should render messages div if there are messages', () => {
    messageService.messages = ["testMessage1", "testMessage2"];
    fixture.detectChanges();

    let messageDivs = fixture.debugElement.queryAll(By.css('button ~ div'));
    expect(messageDivs.length).toBe(2);
    expect(messageDivs[0].nativeElement.innerText).toBe("testMessage1");
    expect(messageDivs[1].nativeElement.innerText).toBe("testMessage2");

    expect(messageService.messages.length).toBe(2);
  });

  it('should remove messages div if messages are cleared', () => {
    messageService.messages = ["testMessage1", "testMessage2"];
    fixture.detectChanges();

    de = fixture.debugElement.query(By.css('div'));
    expect(de).not.toBeNull();

    let messageDivs = fixture.debugElement.queryAll(By.css('button ~ div'));
    expect(messageDivs.length).toBe(2);
    expect(messageService.messages.length).toBe(2);

    messageService.clear();
    fixture.detectChanges();

    de = fixture.debugElement.query(By.css('div'));
    expect(de).toBeNull();

    messageDivs = fixture.debugElement.queryAll(By.css('button ~ div'));
    expect(messageDivs.length).toBe(0);
    expect(messageService.messages.length).toBe(0);
  });
});
